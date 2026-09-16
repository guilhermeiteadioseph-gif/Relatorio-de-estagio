import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/sonner"
import { formatarDataHora } from "@/utils/datetime"
import {
  FileText,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Mapa de etapas do relatório (para o stepper visual).
 */
const ETAPAS = [
  { id: "nao-enviado", label: "Enviar" },
  { id: "em-analise", label: "Em análise" },
  { id: "devolvido", label: "Corrigir" },
  { id: "aprovado", label: "Aprovado" },
  { id: "nota-atribuida", label: "Nota final" },
]

/**
 * Retorna o índice da etapa atual no stepper.
 * Trata "devolvido" como etapa 2 e "aprovado" como 3.
 */
function indiceEtapa(status) {
  const map = {
    "nao-enviado": 0,
    "em-analise": 1,
    "devolvido": 2,
    "aprovado": 3,
    "nota-atribuida": 4,
  }
  return map[status] ?? 0
}

/**
 * Dialog do Relatório Final.
 *
 * Fluxo:
 *   - "nao-enviado"    → mostra uploader
 *   - "em-analise"     → mostra arquivo + aguardando professor
 *   - "devolvido"      → mostra feedback do professor + uploader de reenvio
 *   - "aprovado"       → mostra feedback positivo
 *   - "nota-atribuida" → mostra nota final destacada
 */
export default function DialogoRelatorio({
  open,
  onOpenChange,
  relatorio = {},
  onEnviar,
}) {
  const inputRef = useRef(null)
  const [arquivo, setArquivo] = useState(null)

  const status = relatorio.status || "nao-enviado"
  const etapaAtual = indiceEtapa(status)
  const podeEnviar = status === "nao-enviado" || status === "devolvido"

  /* -------------------------------------------------------------- */
  /*  Handlers                                                       */
  /* -------------------------------------------------------------- */
  const handleSelecionarArquivo = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Formato inválido", "Envie um arquivo PDF.")
      return
    }
    setArquivo(f)
  }

  const handleEnviar = () => {
    if (!arquivo) {
      toast.warning("Selecione um arquivo", "Escolha o PDF do relatório.")
      return
    }
    onEnviar(arquivo.name)
    toast.success(
      "Relatório enviado!",
      "Seu orientador será notificado para avaliar."
    )
    setArquivo(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const limparArquivo = (e) => {
    e.stopPropagation()
    setArquivo(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  /* -------------------------------------------------------------- */
  /*  Render                                                         */
  /* -------------------------------------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-violet-600" />
            Relatório Final de Estágio
          </DialogTitle>
          <DialogDescription>
            Envie o relatório, acompanhe o status e veja o parecer do
            orientador.
          </DialogDescription>
        </DialogHeader>

        {/* --------------------------------------------------------- */}
        {/*  Stepper de progresso                                       */}
        {/* --------------------------------------------------------- */}
        <div className="flex items-center gap-1">
          {ETAPAS.map((etapa, i) => {
            const ativa = i === etapaAtual
            const concluida = i < etapaAtual
            // "devolvido" só considera concluído até "em-analise"
            const isDevolvido = status === "devolvido"

            let estado = "pendente"
            if (concluida) estado = "concluida"
            if (ativa) estado = "ativa"
            if (isDevolvido && etapa.id === "devolvido") estado = "erro"

            return (
              <div key={etapa.id} className="flex flex-1 items-center gap-1">
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                      estado === "concluida" &&
                        "bg-emerald-500 text-white",
                      estado === "ativa" && "bg-blue-600 text-white",
                      estado === "erro" && "bg-amber-500 text-white",
                      estado === "pendente" &&
                        "bg-slate-100 text-slate-400"
                    )}
                  >
                    {estado === "concluida" ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden text-[10px] font-medium sm:block",
                      estado === "pendente"
                        ? "text-slate-400"
                        : "text-slate-700"
                    )}
                  >
                    {etapa.label}
                  </span>
                </div>
                {i < ETAPAS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      concluida ? "bg-emerald-500" : "bg-slate-200"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        {/* --------------------------------------------------------- */}
        {/*  Alertas contextuais por status                             */}
        {/* --------------------------------------------------------- */}
        {status === "devolvido" && (
          <Alert variant="warning">
            <AlertTriangle />
            <AlertTitle>Correções solicitadas pelo orientador</AlertTitle>
            <AlertDescription>{relatorio.feedbackProfessor}</AlertDescription>
          </Alert>
        )}

        {status === "em-analise" && (
          <Alert variant="info">
            <Clock />
            <AlertTitle>Em análise</AlertTitle>
            <AlertDescription>
              Seu relatório foi enviado em{" "}
              {formatarDataHora(relatorio.dataEnvio)} e está aguardando o
              parecer do orientador.
            </AlertDescription>
          </Alert>
        )}

        {status === "aprovado" && (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertTitle>Aprovado pelo orientador</AlertTitle>
            <AlertDescription>
              {relatorio.feedbackProfessor ||
                "Seu relatório foi aprovado e encaminhado ao vice-diretor."}
            </AlertDescription>
          </Alert>
        )}

        {status === "nota-atribuida" && (
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 p-5 text-center ring-1 ring-emerald-200">
            <Award className="mx-auto mb-2 size-8 text-emerald-600" />
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
              Nota final atribuída
            </p>
            <p className="mt-1 text-4xl font-bold text-emerald-700">
              {relatorio.notaFinal?.toFixed(1) ?? "—"}
            </p>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/*  Arquivo atual                                              */}
        {/* --------------------------------------------------------- */}
        {relatorio.arquivoNome && status !== "nao-enviado" && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="rounded-lg bg-red-100 p-2 text-red-600">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {relatorio.arquivoNome}
              </p>
              <p className="text-xs text-slate-500">
                {relatorio.dataEnvio
                  ? `Enviado em ${formatarDataHora(relatorio.dataEnvio)}`
                  : "PDF"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => toast.info("Download", "Baixando PDF...")}
            >
              <Download className="mr-1.5 size-3.5" /> Baixar
            </Button>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/*  Zona de upload (quando aplicável)                          */}
        {/* --------------------------------------------------------- */}
        {podeEnviar && (
          <div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleSelecionarArquivo}
            />
            <div
              onClick={() => inputRef.current?.click()}
              className={cn(
                "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                arquivo
                  ? "border-blue-300 bg-blue-50/50"
                  : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
              )}
            >
              {!arquivo ? (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="size-8 text-slate-400" />
                  <p className="text-sm font-medium text-slate-700">
                    {status === "devolvido"
                      ? "Enviar versão corrigida"
                      : "Enviar relatório em PDF"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Arraste o arquivo ou clique para selecionar
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="size-5 shrink-0 text-blue-500" />
                    <span className="truncate text-sm font-medium text-slate-800">
                      {arquivo.name}
                    </span>
                    <span className="shrink-0 text-xs text-slate-500">
                      ({(arquivo.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    onClick={limparArquivo}
                    className="shrink-0 text-slate-400 transition hover:text-slate-700"
                    aria-label="Remover arquivo"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
            </div>

            {arquivo && (
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={handleEnviar}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UploadCloud className="mr-2 size-4" />
                  {status === "devolvido"
                    ? "Enviar versão corrigida"
                    : "Enviar relatório"}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}