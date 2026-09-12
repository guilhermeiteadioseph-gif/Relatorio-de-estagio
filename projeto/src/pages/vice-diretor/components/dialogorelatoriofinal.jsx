import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/sonner"
import { formatarDataHora } from "@/utils/datetime"
import {
  FileText, Download, CheckCircle2, XCircle, AlertTriangle, User, CalendarDays, Star,
} from "lucide-react"

/**
 * Dialog de visualização e avaliação FINAL do relatório de estágio.
 *
 * Estrutura:
 *   1. Cabeçalho com aluno, empresa, arquivo e data de envio.
 *   2. Bloco "Parecer do Professor Orientador" (somente leitura, se houver).
 *   3. Formulário do Vice-Diretor: nota final + feedback + aprovar/rejeitar.
 */
export default function DialogoRelatorioFinal({ estagiario, open, onOpenChange, onSalvar }) {
  const [nota, setNota] = useState("")
  const [feedback, setFeedback] = useState("")
  const [erro, setErro] = useState("")

  // Sincroniza com os dados do estagiário ao abrir
  useEffect(() => {
    if (!open || !estagiario) return
    const av = estagiario.relatorioFinal?.avaliacaoViceDiretor
    setNota(av?.nota || "")
    setFeedback(av?.feedback || "")
    setErro("")
  }, [open, estagiario])

  if (!estagiario) return null

  const rel = estagiario.relatorioFinal
  const av = rel?.avaliacaoViceDiretor
  const jaAvaliado = !!av
  const aprovado = av?.aprovado

  const handleBaixar = () => {
    toast.info("Download iniciado", `Baixando ${rel?.arquivo || "relatório"}.pdf...`)
  }

  const validar = () => {
    const n = parseFloat(nota)
    if (!nota || isNaN(n) || n < 0 || n > 10) return "Informe uma nota entre 0 e 10."
    if (!feedback || feedback.trim().length < 10) return "Escreva um parecer com pelo menos 10 caracteres."
    return null
  }

  const handleAprovar = () => {
    const err = validar()
    if (err) { setErro(err); return }
    onSalvar?.(estagiario.id, {
      ...(rel || {}),
      avaliacaoViceDiretor: {
        nota, feedback, aprovado: true, justificativa: null,
        data: new Date().toISOString(),
      },
    })
    onOpenChange(false)
  }

  const handleRejeitar = () => {
    const err = validar()
    if (err) { setErro(err); return }
    if (!confirm("Confirma rejeição do relatório? O aluno será notificado com a justificativa.")) return
    onSalvar?.(estagiario.id, {
      ...(rel || {}),
      avaliacaoViceDiretor: {
        nota, feedback, aprovado: false, justificativa: feedback,
        data: new Date().toISOString(),
      },
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <FileText className="size-5 text-slate-400" />
            Relatório Final — {estagiario.nome}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Matrícula {estagiario.matricula} • {estagiario.curso}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
          {/* Aluno / arquivo */}
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2 text-slate-700">
                <User className="size-4 text-slate-400" />
                <span className="font-semibold">{estagiario.nome}</span>
              </p>
              <p className="text-slate-600">{estagiario.empresa}</p>
              <p className="flex items-center gap-2 text-slate-600">
                <CalendarDays className="size-4 text-slate-400" />
                Enviado em {rel?.dataEnvio || "—"}
              </p>
              <p className="text-slate-600">
                Supervisor: {estagiario.supervisor}
              </p>
            </div>

            {rel?.arquivo && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 text-red-600">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{rel.arquivo}</p>
                    <p className="text-xs text-slate-500">Documento PDF</p>
                  </div>
                </div>
                <Button variant="outline" size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={handleBaixar}>
                  <Download className="mr-2 size-4" /> Baixar
                </Button>
              </div>
            )}
          </section>

          {/* Parecer do professor */}
          {rel?.avaliacaoProfessor && (
            <section>
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                Parecer do Professor Orientador
              </h4>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Star className="size-4 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-800">
                    Nota: {rel.avaliacaoProfessor.nota}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">
                  {rel.avaliacaoProfessor.feedback}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  Registrado em {formatarDataHora(rel.avaliacaoProfessor.data)}
                </p>
              </div>
            </section>
          )}

          <Separator />

          {/* Avaliação final do vice-diretor */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Avaliação Final do Vice-Diretor
              </h4>
              {jaAvaliado && (
                <Badge className={`border-none ${aprovado ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {aprovado ? "Aprovado" : "Rejeitado"} em {formatarDataHora(av.data)}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="md:col-span-1">
                <Label className="text-slate-700">Nota Final (0 a 10)</Label>
                <Input type="number" min="0" max="10" step="0.1"
                  value={nota} onChange={(e) => setNota(e.target.value)}
                  placeholder="Ex: 9.5" />
              </div>
              <div className="md:col-span-3">
                <Label className="text-slate-700">Parecer / Comentários</Label>
                <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Escreva seu parecer final sobre o estágio. Se rejeitar, explique o motivo."
                  className="min-h-24 resize-none" />
              </div>
            </div>

            {erro && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertTriangle className="size-4 shrink-0" />
                {erro}
              </div>
            )}
          </section>
        </div>

        <DialogFooter>
          <Button className="border-slate-200 hover:bg-slate-50" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleRejeitar}
          >
            <XCircle className="mr-2 size-4" /> Rejeitar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAprovar}>
            <CheckCircle2 className="mr-2 size-4 text-white" /> Aprovar e Finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}