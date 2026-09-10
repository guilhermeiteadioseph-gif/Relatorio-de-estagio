import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/sonner"
import { Progress } from "@/components/ui/progress"
import { formatarDataHora } from "@/utils/datetime"
import {
  ArrowLeft, FileText, Download, CheckCircle2, Send,
  AlertTriangle, Hash, Mail, Phone, Building2, CalendarDays, Clock,
  CalendarClock,
} from "lucide-react"

export default function AvaliacaoRelatorio({ aluno, onVoltar, onSalvar }) {
  const [nota, setNota] = useState(aluno.nota || "")
  const [feedback, setFeedback] = useState(aluno.feedback || "")

  const isAprovado  = aluno.statusRelatorio === "Enviado ao Vice-Diretor"
  const isDevolvido = aluno.statusRelatorio === "Devolvido para Correção"
  const bloqueado   = isAprovado

  // Data do último parecer salvo (se houver)
  const dataParecer = formatarDataHora(aluno.dataAvaliacao)

  /* ---------------- Handlers ---------------- */

  const handleBaixarPDF = () => {
    toast.info("Download iniciado", `Baixando ${aluno.relatorioNome}...`)
  }

  const handleAprovar = () => {
    const notaNum = parseFloat(nota)
    if (!nota || isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
      toast.error("Nota inválida", "Informe uma nota entre 0 e 10 antes de aprovar.")
      return
    }
    if (!feedback || feedback.trim().length < 10) {
      toast.warning("Feedback curto", "Escreva um parecer com pelo menos 10 caracteres.")
      return
    }
    onSalvar(aluno.id, nota, feedback, "Enviado ao Vice-Diretor")
    toast.success("Relatório aprovado!", "Encaminhado ao Vice-Diretor com sucesso.")
  }

  const handleSolicitarCorrecao = () => {
    if (isDevolvido) return
    if (!feedback || feedback.trim().length < 10) {
      toast.warning(
        "Explique as correções",
        "Descreva com pelo menos 10 caracteres o que o aluno precisa corrigir."
      )
      return
    }
    onSalvar(aluno.id, nota, feedback, "Devolvido para Correção")
    toast.success("Correções solicitadas", "O aluno foi notificado para ajustar o relatório.")
  }

  const percentual = Math.round((aluno.horasCumpridas / aluno.horasTotais) * 100)

  /* ---------------- Render ---------------- */
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="-ml-2 text-slate-500 hover:text-slate-800"
          onClick={onVoltar}
        >
          <ArrowLeft className="mr-2 size-4" /> Voltar para a lista
        </Button>

        {isAprovado && (
          <Badge className="gap-1 bg-emerald-500 py-1 px-3 text-white">
            <CheckCircle2 className="size-3.5" /> Aprovado e Enviado
          </Badge>
        )}
        {isDevolvido && (
          <Badge className="gap-1 bg-red-500 py-1 px-3 text-white">
            <AlertTriangle className="size-3.5" /> Devolvido para Correção
          </Badge>
        )}
        {!isAprovado && !isDevolvido && (
          <Badge variant="outline" className="py-1 px-3 text-slate-500">
            Pendente de Avaliação
          </Badge>
        )}
      </div>

      {/* Card 1: dados do aluno (inalterado) */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
              {aluno.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-xl font-bold text-slate-800">
                {aluno.nome}
              </CardTitle>
              <p className="mt-0.5 text-sm text-slate-500">
                {aluno.curso} • {aluno.turno}
              </p>
              <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Hash className="size-3" /> {aluno.matricula}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="size-3" /> {aluno.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="size-3" /> {aluno.telefone}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2">
          <div className="space-y-1 text-sm">
            <p className="flex items-center gap-2 text-slate-600">
              <Building2 className="size-4 text-slate-400" />
              {aluno.empresa}
            </p>
            <p className="flex items-center gap-2 text-slate-600">
              <CalendarDays className="size-4 text-slate-400" />
              {aluno.periodoEstagio}
            </p>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <Clock className="size-3" />
                {aluno.horasCumpridas}h de {aluno.horasTotais}h
              </span>
              <span className="text-slate-500">{percentual}%</span>
            </div>
            <Progress value={percentual} className="h-2" />
            <p className="mt-1 text-xs text-slate-500">
              {aluno.diasRestantes > 0
                ? `Faltam ${aluno.diasRestantes} dias para finalizar`
                : "Estágio concluído"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: avaliação */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Avaliação do Relatório Final
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Alertas contextuais — agora exibindo a data do parecer */}
          {isAprovado && (
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>Avaliação concluída</AlertTitle>
              <AlertDescription>
                Este relatório foi aprovado e encaminhado ao Vice-Diretor
                {dataParecer && ` em ${dataParecer}`}.
              </AlertDescription>
            </Alert>
          )}
          {isDevolvido && (
            <Alert variant="warning">
              <AlertTriangle />
              <AlertTitle>Aguardando correções</AlertTitle>
              <AlertDescription>
                Correções solicitadas
                {dataParecer && ` em ${dataParecer}`}. Reabra a avaliação quando
                o aluno reenviar o relatório corrigido.
              </AlertDescription>
            </Alert>
          )}

          {/* Arquivo submetido */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <FileText className="size-4 text-blue-600" /> Arquivo Submetido
            </h3>
            <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2.5 text-red-600">
                  <FileText className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {aluno.relatorioNome}
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF • Enviado em {aluno.dataEnvio}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={handleBaixarPDF}
              >
                <Download className="mr-2 size-4" /> Baixar PDF
              </Button>
            </div>
          </section>

          {/* Parecer técnico */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                Parecer Técnico do Orientador
              </h3>

              {/* Mostra a data do parecer registrado (somente se já existir) */}
              {dataParecer && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <CalendarClock className="size-3" />
                  Registrado em {dataParecer}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div className="md:col-span-1">
                <Label htmlFor="nota" className="mb-2 block">
                  Nota Final (0 a 10)
                </Label>
                <Input
                  id="nota"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Ex: 9.5"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  disabled={bloqueado}
                  className="text-lg"
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="feedback" className="mb-2 block">
                  Comentários / Observações
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Descreva sua avaliação. Se solicitar alterações, detalhe o que precisa ser corrigido..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={bloqueado}
                  className="h-32 resize-none"
                />
              </div>
            </div>
          </section>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-between gap-3 rounded-b-xl border-t border-slate-100 bg-slate-50 p-5 sm:flex-row">
          {!bloqueado ? (
            <>
              <p className="text-center text-xs text-slate-500 sm:text-left">
                {isDevolvido
                  ? "Aguarde o reenvio do aluno para registrar um novo parecer."
                  : "A aprovação encaminha automaticamente o relatório ao Vice-Diretor."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleSolicitarCorrecao}
                  disabled={isDevolvido}
                  title={
                    isDevolvido
                      ? "Correções já solicitadas — aguardando reenvio do aluno"
                      : undefined
                  }
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <AlertTriangle className="mr-2 size-4" /> Solicitar Correções
                </Button>

                <Button
                  onClick={handleAprovar}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="mr-2 size-4" /> Aprovar e Enviar
                </Button>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="size-5" />
              Avaliação finalizada
              {dataParecer && ` em ${dataParecer}`} — encaminhada ao Vice-Diretor.
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}