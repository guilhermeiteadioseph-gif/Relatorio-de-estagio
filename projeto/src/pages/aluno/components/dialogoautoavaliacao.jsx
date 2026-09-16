import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/sonner"
import { formatarDataHora } from "@/utils/datetime"
import { cn } from "@/lib/utils"
import {
  ClipboardCheck,
  CheckCircle2,
  Send,
  Lock,
  Info,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Estrutura do formulário — extraída da ficha oficial                */
/* ------------------------------------------------------------------ */

const ESCALA = [
  { value: "raramente", label: "Raramente" },
  { value: "as-vezes", label: "Às vezes" },
  { value: "sempre", label: "Sempre" },
]

const ITENS = [
  "Fui assíduo(a) e compareci pontualmente ao local de estágio.",
  "Procurei aprofundar meu conhecimento técnico e consegui aplicá-lo em diferentes situações.",
  "Demonstrei iniciativa, segurança e interesse pelas atividades do estágio.",
  "Procurei realizar meu trabalho da melhor maneira possível, dedicando-me a todas as atividades propostas.",
  "Colaborei com novas ideias e propostas para o serviço de estágio.",
  "Fui organizado e respeitei os compromissos assumidos e cumpri prazos.",
  "Aceitei críticas, tentei corrigir meus erros e melhorar minha atuação durante todo o período de estágio.",
  "Fui cordial com as pessoas e procurei um bom relacionamento com a equipe.",
  "Fui transparente em minhas ações. Respeitei e cumpri as regras do estágio.",
  "Demonstrei zelo com o patrimônio.",
  "Desenvolvi habilidades profissionais relacionadas à minha área de formação.",
  "Adquiri conhecimentos técnicos relacionados à minha área de formação.",
  "Colaborei na resolução de problemas durante meu estágio.",
  "Adaptei-me com facilidade a organizações e suas rotinas.",
  "Desenvolvi minha capacidade de trabalhar em grupo.",
  "Evitei causar problemas e/ou embaraços que pudessem prejudicar o desenvolvimento das atividades do estágio.",
  "Colaborei com a limpeza e organização do espaço de estágio.",
  "Indicaria o estágio nesta instituição.",
]

/**
 * Dialog de Autoavaliação Final.
 *
 * Regras:
 *   - Só fica disponível quando o estágio é finalizado
 *     (controlado pelo contexto/painel; aqui apenas renderiza).
 *   - Após enviada, os campos viram somente-leitura.
 */
export default function DialogoAutoavaliacao({
  open,
  onOpenChange,
  disponivel,
  autoavaliacao = {},
  aluno = {},
  estagio = {},
  onSalvar,
}) {
  const respondida = autoavaliacao.status === "respondida"
  const respostasExistentes = autoavaliacao.respostas || {}

  /* -------------------------------------------------------------- */
  /*  Estado local                                                   */
  /* -------------------------------------------------------------- */
  const [respostas, setRespostas] = useState(() =>
    ITENS.reduce((acc, _, i) => {
      acc[`item${i + 1}`] = respostasExistentes[`item${i + 1}`] || ""
      return acc
    }, {})
  )
  const [futuro, setFuturo] = useState(respostasExistentes.futuro || "")
  const [observacoes, setObservacoes] = useState(
    respostasExistentes.observacoes || ""
  )

  const setItem = (key, valor) =>
    setRespostas((prev) => ({ ...prev, [key]: valor }))

  /* -------------------------------------------------------------- */
  /*  Validação e envio                                              */
  /* -------------------------------------------------------------- */
  const handleEnviar = () => {
    const faltando = Object.entries(respostas).filter(([, v]) => !v)
    if (faltando.length > 0) {
      toast.warning(
        "Formulário incompleto",
        `Responda todos os ${ITENS.length} itens (faltam ${faltando.length}).`
      )
      return
    }
    onSalvar({ ...respostas, futuro, observacoes })
    toast.success(
      "Autoavaliação enviada!",
      "Sua resposta foi registrada com sucesso."
    )
  }

  const respondidos = Object.values(respostas).filter(Boolean).length
  const progresso = Math.round((respondidos / ITENS.length) * 100)
  const dataResposta = formatarDataHora(autoavaliacao.respondidaEm)

  /* -------------------------------------------------------------- */
  /*  Render                                                         */
  /* -------------------------------------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl gap-5 overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardCheck className="size-5 text-emerald-600" />
                Autoavaliação de Desempenho
              </DialogTitle>
              <DialogDescription>
                Avalie seu próprio desempenho durante o período de estágio.
              </DialogDescription>
            </div>
            {respondida && (
              <Badge className="shrink-0 gap-1 bg-emerald-500 text-white">
                <CheckCircle2 className="size-3.5" /> Enviada
                {dataResposta && ` em ${dataResposta}`}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* --------------------------------------------------------- */}
        {/*  Bloqueio se ainda não estiver disponível                    */}
        {/* --------------------------------------------------------- */}
        {!disponivel && !respondida && (
          <Alert variant="warning">
            <Lock />
            <AlertTitle>Autoavaliação bloqueada</AlertTitle>
            <AlertDescription>
              Este formulário fica disponível apenas ao final do período de
              estágio.
            </AlertDescription>
          </Alert>
        )}

        {/* --------------------------------------------------------- */}
        {/*  Conteúdo do formulário                                      */}
        {/* --------------------------------------------------------- */}
        {disponivel || respondida ? (
          <div className="flex-1 space-y-5 overflow-y-auto pr-1">
            {/* Cabeçalho com dados pré-preenchidos */}
            <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <InfoCampo label="Nome do estagiário" valor={aluno.nome} />
              <InfoCampo label="Curso" valor={aluno.curso} />
              <InfoCampo
                label="Instituição concedente"
                valor={estagio.empresa?.nome}
              />
              <InfoCampo label="Setor de estágio" valor={estagio.setor} />
              <InfoCampo
                label="Período de realização"
                valor={estagio.periodo}
              />
            </div>

            {/* Progresso */}
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${progresso}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500">
                {respondidos} / {ITENS.length} ({progresso}%)
              </span>
            </div>

            {/* Itens de avaliação */}
            <div className="space-y-4">
              {ITENS.map((texto, i) => {
                const key = `item${i + 1}`
                return (
                  <div
                    key={key}
                    className="rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <Label className="text-sm font-medium text-slate-700">
                      {i + 1}. {texto}
                    </Label>
                    <RadioGroup
                      value={respostas[key]}
                      onValueChange={(v) => setItem(key, v)}
                      disabled={respondida}
                      className="mt-2 flex flex-wrap gap-4"
                    >
                      {ESCALA.map((op) => (
                        <label
                          key={op.value}
                          htmlFor={`${key}-${op.value}`}
                          className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
                        >
                          <RadioGroupItem
                            id={`${key}-${op.value}`}
                            value={op.value}
                          />
                          {op.label}
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                )
              })}
            </div>

            <Separator />

            {/* Pergunta dissertativa — profissão futura */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Como você se enxerga no futuro? Qual profissão pretende exercer
                e de qual forma?
              </Label>
              <Textarea
                placeholder="Escreva sua resposta..."
                value={futuro}
                onChange={(e) => setFuturo(e.target.value)}
                disabled={respondida}
                className={cn("min-h-24 resize-none")}
              />
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Observações — use o espaço abaixo para críticas e/ou sugestões
                de melhoramento.
              </Label>
              <Textarea
                placeholder="Comentários adicionais..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                disabled={respondida}
                className="min-h-24 resize-none"
              />
            </div>
          </div>
        ) : null}

        {/* --------------------------------------------------------- */}
        {/*  Rodapé com ação principal                                   */}
        {/* --------------------------------------------------------- */}
        {disponivel && !respondida && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Após o envio, não será possível editar as respostas.
            </p>
            <Button
              onClick={handleEnviar}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="mr-2 size-4" /> Enviar Autoavaliação
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/* ------------------------------------------------------------------ */
/*  Subcomponente: campo de informação somente-leitura                 */
/* ------------------------------------------------------------------ */
function InfoCampo({ label, valor }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-sm text-slate-800">{valor || "—"}</p>
    </div>
  )
}