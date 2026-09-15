import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/sonner"
import { formatarDataHora } from "@/utils/datetime"
import {
  Mail, CheckCircle2, AlertTriangle, User, Building2,
  CalendarDays, Clock, Hash, Shield,
} from "lucide-react"

/**
 * Dialog de confirmação mensal de frequência.
 *
 * Simula o "e-mail com token único" que o supervisor recebe quando a
 * carga horária do estagiário é concluída. Apresenta:
 *   - Resumo do estágio
 *   - Total de horas
 *   - Ações: "Confirmo as horas" / "Tenho observações"
 */
export default function DialogoConfirmacao({ estagiario, open, onOpenChange, onConfirmar }) {
  const [modo, setModo] = useState("resumo") // "resumo" | "observacoes"
  const [observacoes, setObservacoes] = useState("")
  if (!estagiario || !estagiario.confirmacaoSupervisor) return null

  const conf = estagiario.confirmacaoSupervisor
  const totalHoras = estagiario.frequencias.reduce((a, f) => a + (f.horas || 0), 0)

  const reset = () => {
    setModo("resumo")
    setObservacoes("")
  }

  const handleConfirmar = () => {
    onConfirmar(estagiario.id, { status: "confirmado", observacoes: "" })
    toast.success(
      "Confirmação enviada",
      "Obrigado! As horas foram confirmadas com sucesso."
    )
    onOpenChange(false)
    reset()
  }

  const handleObservacoes = () => {
    if (observacoes.trim().length < 10) {
      toast.warning(
        "Escreva sua observação",
        "Descreva com pelo menos 10 caracteres o que precisa ser ajustado."
      )
      return
    }
    onConfirmar(estagiario.id, { status: "com-observacoes", observacoes })
    toast.info(
      "Observações enviadas",
      "A coordenação irá revisar a sua mensagem."
    )
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset() }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <Mail className="size-5 text-slate-400" />
            Confirmação de Frequência — Estágio Concluído
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Revise o resumo abaixo e confirme as horas ou registre observações.
          </DialogDescription>
        </DialogHeader>

        {/* Banner tipo "e-mail" */}
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
          <Shield className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-semibold">
              Este link é único e pessoal — token <span className="font-mono">{conf.token}</span>
            </p>
            <p className="mt-0.5 text-blue-700">
              Enviado em {formatarDataHora(conf.enviadoEm)}
            </p>
          </div>
        </div>

        {modo === "resumo" ? (
          <>
            {/* Resumo do estagiário */}
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2 text-slate-700">
                  <User className="size-4 text-slate-400" />
                  <span className="font-semibold">{estagiario.nome}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Hash className="size-4 text-slate-400" />
                  Mat. {estagiario.matricula}
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Building2 className="size-4 text-slate-400" />
                  {estagiario.empresa.nome}
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <CalendarDays className="size-4 text-slate-400" />
                  {estagiario.periodoEstagio}
                </p>
              </div>

              <Separator className="my-3" />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] text-slate-500">Total de horas</p>
                  <p className="text-lg font-bold text-slate-800">{totalHoras}h</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Dias registrados</p>
                  <p className="text-lg font-bold text-slate-800">{estagiario.frequencias.length}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Carga prevista</p>
                  <p className="text-lg font-bold text-slate-800">{estagiario.horasTotais}h</p>
                </div>
              </div>
            </section>

            {/* Aviso */}
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                Ao confirmar, você atesta que as horas registradas correspondem
                às atividades efetivamente realizadas pelo estagiário.
              </span>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <Label className="text-slate-700">
              Descreva suas observações sobre as horas registradas
            </Label>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: O dia 04/10/2026 não deveria contar como presença, pois o estagiário faltou."
              className="min-h-32 resize-none"
            />
            <p className="text-[11px] text-slate-400">
              As observações serão enviadas para a coordenação de estágios.
            </p>
          </div>
        )}

        <DialogFooter>
          {modo === "resumo" ? (
            <>
              <Button
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => setModo("observacoes")}
              >
                <AlertTriangle className="mr-2 size-4" /> Tenho observações
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleConfirmar}
              >
                <CheckCircle2 className="mr-2 size-4" /> Confirmo as horas
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setModo("resumo")}>
                Voltar
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700"
                onClick={handleObservacoes}
              >
                <AlertTriangle className="mr-2 size-4" /> Enviar observações
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}