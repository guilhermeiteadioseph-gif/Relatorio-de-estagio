import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { useSupervisorData } from "../contexts/supervisorcontext"

import TabelaEstagiarios from "../components/tabelaestagiarios"
import DialogoFrequencias from "../components/dialogofrequencias"
import QuestionarioAvaliacao from "../components/questionarioavaliacao"

/**
 * Aba "Avaliação do Estágio".
 *   - Lista os estagiários e abre o questionário ao clicar em "Avaliar Estágio".
 *   - Aceita ?estagiario=<id> para abrir direto (vindo do painel).
 *   - Também permite abrir as frequências via dropdown.
 */
export default function AvaliacoesPage() {
  const { estagiarios, marcarQuestionarioRespondido } = useSupervisorData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [estagiarioAvaliando, setEstagiarioAvaliando] = useState(null)
  const [estagiarioFrequencias, setEstagiarioFrequencias] = useState(null)

  /* Abre direto se vier com ?estagiario=<id> na URL */
  useEffect(() => {
    const id = Number(searchParams.get("estagiario"))
    if (!id) return
    const encontrado = estagiarios.find((e) => e.id === id)
    if (encontrado) setEstagiarioAvaliando(encontrado)
  }, [searchParams, estagiarios])

  const handleSalvar = (id, respostas) => {
    marcarQuestionarioRespondido(id, respostas)
    setSearchParams({})
    setEstagiarioAvaliando(null)
  }

  const handleVoltar = () => {
    setSearchParams({})
    setEstagiarioAvaliando(null)
  }

  /* Modo questionário */
  if (estagiarioAvaliando) {
    return (
      <QuestionarioAvaliacao
        estagiario={estagiarioAvaliando}
        onVoltar={handleVoltar}
        onSalvar={handleSalvar}
      />
    )
  }

  /* Modo listagem */
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Avaliação de Desempenho
        </h1>
        <p className="text-sm text-slate-500">
          Responda o questionário de desempenho ao final do período de estágio.
        </p>
      </div>

      <TabelaEstagiarios
        dados={estagiarios}
        onVerFrequencias={(e) => setEstagiarioFrequencias(e)}
        onAvaliar={(e) => setEstagiarioAvaliando(e)}
      />

      {/* Dialog de frequências */}
      <DialogoFrequencias
        estagiario={estagiarioFrequencias}
        open={!!estagiarioFrequencias}
        onOpenChange={(o) => !o && setEstagiarioFrequencias(null)}
      />
    </div>
  )
}