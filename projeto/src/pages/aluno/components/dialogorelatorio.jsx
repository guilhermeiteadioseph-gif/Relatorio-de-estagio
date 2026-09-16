import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/sonner"
import { formatarDataHora } from "@/utils/datetime"
import { cn } from "@/lib/utils"
import {
  FileText,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  X,
  FileCheck2,
  RotateCcw,
  BookOpen,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Constantes                                                         */
/* ------------------------------------------------------------------ */

/** Tamanho máximo do PDF em bytes (20 MB). */
const TAMANHO_MAXIMO = 20 * 1024 * 1024

/** Mapa de etapas do relatório para o stepper visual. */
const ETAPAS = [
  { id: "nao-enviado",    label: "Enviar" },
  { id: "em-analise",     label: "Em análise" },
  { id: "devolvido",      label: "Corrigir" },
  { id: "aprovado",       label: "Aprovado" },
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
 * Formata bytes para exibição amigável (KB/MB).
 */
function formatarBytes(bytes) {
  if (!bytes) return "0 KB"
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/* ------------------------------------------------------------------ */
/*  Componente principal                                               */
/* ------------------------------------------------------------------ */
/**
 * Dialog do Relatório Final.
 *
 * Fluxo por status:
 *   - "nao-enviado"    → uploader + botão "Confirmar envio"
 *   - "em-analise"     → arquivo + aguardando professor
 *   - "devolvido"      → feedback do professor + uploader de reenvio
 *   - "aprovado"       → feedback positivo
 *   - "nota-atribuida" → nota final destacada
 *
 * @param {Object}   props
 * @param {boolean}  props.open
 * @param {Function} props.onOpenChange
 * @param {Object}   props.relatorio      - { status, arquivoNome, dataEnvio, feedbackProfessor, notaFinal }
 * @param {Function} props.onEnviar       - (nomeArquivo) => void
 */
export default function DialogoRelatorio({
  open,
  onOpenChange,
  relatorio = {},
  onEnviar,
}) {
  const inputRef = useRef(null)

  /* Arquivo escolhido (ainda não confirmado) */
  const [arquivo, setArquivo] = useState(null)
  /* Estado do drag-and-drop */
  const [arrastando, setArrastando] = useState(false)

  const status = relatorio.status || "nao-enviado"
  const etapaAtual = indiceEtapa(status)
  const podeEnviar = status === "nao-enviado" || status === "devolvido"

  /**
  * Mostra o modelo quando o relatório NÃO está aprovado/avaliado.
  * Assim o aluno sempre tem acesso ao template durante o processo.
  */
  const mostrarModelo =
    status === "nao-enviado" ||
    status === "em-analise" ||
    status === "devolvido"

  /* Reseta o arquivo escolhido sempre que o dialog abrir/fechar.
     Evita que o usuário feche o modal e reabra com arquivo antigo. */
  useEffect(() => {
    if (!open) {
      setArquivo(null)
      setArrastando(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }, [open])

  /* -------------------------------------------------------------- */
  /*  Validação + seleção                                            */
  /* -------------------------------------------------------------- */
  const validar = (f) => {
    if (!f) return "Nenhum arquivo selecionado."
    const isPDF =
      f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    if (!isPDF) return "Formato inválido. Envie um arquivo PDF."
    if (f.size > TAMANHO_MAXIMO)
      return `Arquivo muito grande (máx. ${formatarBytes(TAMANHO_MAXIMO)}).`
    return null
  }

  const aceitarArquivo = (f) => {
    const erro = validar(f)
    if (erro) {
      toast.error("Arquivo rejeitado", erro)
      return
    }
    setArquivo(f)
    toast.success("Arquivo pronto", "Revise e confirme o envio abaixo.")
  }

  const handleInputChange = (e) => {
    const f = e.target.files?.[0]
    if (f) aceitarArquivo(f)
  }

  /* -------------------------------------------------------------- */
  /*  Drag & Drop                                                    */
  /* -------------------------------------------------------------- */
  const handleDragOver = (e) => {
    e.preventDefault()
    setArrastando(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    setArrastando(false)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    setArrastando(false)
    const f = e.dataTransfer.files?.[0]
    if (f) aceitarArquivo(f)
  }

  /* -------------------------------------------------------------- */
  /*  Confirmar envio                                                */
  /* -------------------------------------------------------------- */
  const handleConfirmarEnvio = () => {
    if (!arquivo) return
    onEnviar(arquivo.name)
    toast.success(
      "Relatório enviado!",
      "Seu orientador será notificado para avaliar."
    )
    // Limpa o estado interno; o status do `relatorio` será atualizado pelo pai
    setArquivo(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const limparArquivo = (e) => {
    e?.stopPropagation?.()
    setArquivo(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  /** Download do modelo — toast amigável + abre o link. */
  const handleBaixarModelo = () => {
    toast.info("Download iniciado", "Baixando o modelo do relatório…")
    // Cria um link temporário para forçar o download (mantém o nome do arquivo)
    const a = document.createElement("a")
    a.href = 'https://docs.google.com/document/d/1rBehj4Cr36_fKj3-m3fB1_FvMJNauC3Z044_3zIBT7M/export?format=docx'
    a.download = 'Modelo_Relatorio_Final_CETEP_Araci.docx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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
                      estado === "concluida" && "bg-emerald-500 text-white",
                      estado === "ativa" && "bg-blue-600 text-white",
                      estado === "erro" && "bg-amber-500 text-white",
                      estado === "pendente" && "bg-slate-100 text-slate-400"
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
        {/*  Alertas por status                                       */}
        {/* --------------------------------------------------------- */}
        {status === "nao-enviado" && (
          <Alert variant="info">
            <AlertTriangle />
            <AlertTitle>Relatório não enviado</AlertTitle>
            <AlertDescription>Aguardando envio do relatório final de estágio. Escreva o relatório conforme as orientações presentes no modelo abaixo e segundo as normas da ABNT.</AlertDescription>
          </Alert>
        )}

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
        {/*  MODELO PARA DOWNLOAD — visível até ser aprovado            */}
        {/* --------------------------------------------------------- */}
        {mostrarModelo && (
          <div className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-4 sm:flex-row sm:items-center">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <BookOpen className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">
                Modelo oficial do relatório
              </p>
              <p className="text-xs text-slate-600">
                Baixe o template com a estrutura e formatação exigidas pelo
                CETEP Araci. Use-o como base para o seu relatório final.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleBaixarModelo}
              className="shrink-0 gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              size="sm"
            >
              <Download className="size-3.5" />
              Baixar modelo
            </Button>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/*  Arquivo já enviado (modo leitura)                          */}
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
        {/*  Zona de upload (apenas quando pode enviar)                 */}
        {/* --------------------------------------------------------- */}
        {podeEnviar && (
          <div className="space-y-3">
            {/*
              Input escondido — abre ao clicar na dropzone ou no botão
              "Trocar arquivo".
            */}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleInputChange}
            />

            {/* Dropzone OU cartão de arquivo pronto */}
            {!arquivo ? (
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                className={cn(
                  "cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all",
                  arrastando
                    ? "border-blue-500 bg-blue-50 scale-[1.01]"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full transition-colors",
                      arrastando ? "bg-blue-100" : "bg-slate-100"
                    )}
                  >
                    <UploadCloud
                      className={cn(
                        "size-6 transition-colors",
                        arrastando ? "text-blue-600" : "text-slate-400"
                      )}
                    />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {status === "devolvido"
                      ? "Enviar versão corrigida"
                      : "Enviar relatório em PDF"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Arraste o arquivo até aqui ou{" "}
                    <span className="font-medium text-blue-600 underline-offset-2 hover:underline">
                      clique para selecionar
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Somente PDF • até {formatarBytes(TAMANHO_MAXIMO)}
                  </p>
                </div>
              </div>
            ) : (
              /* -------- Arquivo pronto para envio -------- */
              <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <FileCheck2 className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      <CheckCircle2 className="size-3.5" /> Arquivo pronto
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-slate-800">
                      {arquivo.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatarBytes(arquivo.size)} • PDF
                    </p>
                  </div>
                  <button
                    onClick={limparArquivo}
                    className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
                    aria-label="Remover arquivo"
                    title="Remover e escolher outro"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Ações secundárias */}
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-emerald-200 pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                    className="gap-1.5 text-slate-500 hover:text-slate-800"
                  >
                    <RotateCcw className="size-3.5" /> Trocar arquivo
                  </Button>
                </div>
              </div>
            )}

            {/* --------------------------------------------------- */}
            {/*  Botão principal de confirmação                     */}
            {/*  Só aparece quando há arquivo escolhido             */}
            {/* --------------------------------------------------- */}
            {arquivo && (
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  {status === "devolvido"
                    ? "Ao confirmar, o orientador será notificado da correção."
                    : "Após o envio, o orientador será notificado para avaliar."}
                </p>
                <Button
                  onClick={handleConfirmarEnvio}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <UploadCloud className="mr-2 size-4" />
                  {status === "devolvido"
                    ? "Confirmar reenvio"
                    : "Confirmar envio"}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}