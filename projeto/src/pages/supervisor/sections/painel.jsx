import { useState, useEffect } from "react"
import { useSupervisorData } from "../contexts/supervisorcontext"

import CardsEstatisticas from "../components/cardestatisticas"
import TabelaEstagiarios from "../components/tabelaestagiarios"
import DialogoFrequencias from "../components/dialogofrequencias"
import DetalhesEstagiario from "../components/detalhesestagiario"
import QuestionarioAvaliacao from "../components/questionarioavaliacao"
import DialogoConfirmacao from "../components/dialogoconfirmacao"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react"
import { formatarDataHora } from "@/utils/datetime"
import { useSearchParams } from "react-router"

/**
 * Painel principal do supervisor.
 *
 * Todas as "sub-páginas" acontecem AQUI via estado local, sem navegação:
 *   - Ver perfil (Sheet lateral)
 *   - Ver frequências (Dialog)
 *   - Responder/ver avaliação (tela inline)
 *   - Confirmar frequências do estágio concluído (Dialog de "e-mail")
 */
export default function PainelGeral() {
  const { estagiarios, marcarQuestionarioRespondido, confirmarFrequencias } =
    useSupervisorData()
  const [searchParams, setSearchParams] = useSearchParams()

  /* Estados de cada "sub-página" */
  const [estagiarioAvaliando, setEstagiarioAvaliando] = useState(null)
  const [estagiarioFrequencias, setEstagiarioFrequencias] = useState(null)
  const [estagiarioDetalhe, setEstagiarioDetalhe] = useState(null)
  const [estagiarioConfirmando, setEstagiarioConfirmando] = useState(null)

  useEffect(() => {
    const id = Number(searchParams.get("estagiario"))
    const acao = searchParams.get("acao")
    if (!id || acao !== "confirmar") return

    const encontrado = estagiarios.find((e) => e.id === id)
    if (encontrado?.confirmacaoSupervisor?.status === "pendente") {
      setEstagiarioConfirmando(encontrado)
    }
    /* Limpa a URL para não reabrir se ele fechar o dialog */
    setSearchParams({}, { replace: true })
  }, [searchParams, estagiarios, setSearchParams])

  /* ─── Modo questionário: substitui o painel inteiro ─── */
  if (estagiarioAvaliando) {
    return (
      <QuestionarioAvaliacao
        estagiario={estagiarioAvaliando}
        onVoltar={() => setEstagiarioAvaliando(null)}
        onSalvar={(id, respostas) => {
          marcarQuestionarioRespondido(id, respostas)
          setEstagiarioAvaliando(null)
        }}
      />
    )
  }

  /* Estágios concluídos aguardando confirmação do supervisor */
  const confirmacoesPendentes = estagiarios.filter(
    (e) => e.confirmacaoSupervisor?.status === "pendente"
  )

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Meus Estagiários</h1>
        <p className="text-sm text-slate-500">
          Acompanhe a presença e o desempenho dos estagiários da sua empresa.
        </p>
      </div>

      {/* Cards de resumo */}
      <CardsEstatisticas estagiarios={estagiarios} />

      {/* ═══════════ CONFIRMAÇÕES PENDENTES ═══════════ */}
      {confirmacoesPendentes.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
          <CardHeader className="border-b border-blue-100 pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2 text-blue-900">
                <Mail className="size-4" />
                Confirmações de estágio concluído
              </span>
              <Badge className="border-none bg-blue-600 text-white">
                {confirmacoesPendentes.length} pendente(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            {confirmacoesPendentes.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-lg border border-blue-100 bg-white px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {e.nome}
                  </p>
                  <p className="text-xs text-slate-500">
                    {e.horasCumpridas}h concluídas • "e-mail" enviado em{" "}
                    {formatarDataHora(e.confirmacaoSupervisor.enviadoEm)}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setEstagiarioConfirmando(e)}
                >
                  <Mail className="mr-1 size-3.5" /> Abrir e-mail
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ═══════════ TABELA DE ESTAGIÁRIOS ═══════════ */}
      <TabelaEstagiarios
        dados={estagiarios}
        onVerPerfil={(e) => setEstagiarioDetalhe(e)}
        onVerFrequencias={(e) => setEstagiarioFrequencias(e)}
        onAvaliar={(e) => setEstagiarioAvaliando(e)}
      />

      {/* ═══════════ DIALOGS ═══════════ */}

      {/* Sheet lateral de perfil */}
      <DetalhesEstagiario
        estagiario={estagiarioDetalhe}
        open={!!estagiarioDetalhe}
        onOpenChange={(o) => !o && setEstagiarioDetalhe(null)}
        onVerFrequencias={(e) => setEstagiarioFrequencias(e)}
        onAvaliar={(e) => setEstagiarioAvaliando(e)}
      />

      {/* Dialog de frequências */}
      <DialogoFrequencias
        estagiario={estagiarioFrequencias}
        open={!!estagiarioFrequencias}
        onOpenChange={(o) => !o && setEstagiarioFrequencias(null)}
      />

      {/* Dialog de confirmação ("e-mail" com token) */}
      <DialogoConfirmacao
        estagiario={estagiarioConfirmando}
        open={!!estagiarioConfirmando}
        onOpenChange={(o) => !o && setEstagiarioConfirmando(null)}
        onConfirmar={confirmarFrequencias}
      />
    </div>
  )
}