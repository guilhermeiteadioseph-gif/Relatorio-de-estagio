import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { formatarDataHora } from "@/utils/datetime"
import {
  Mail,
  Phone,
  Building2,
  CalendarDays,
  Clock,
  Hash,
  BookOpen,
  FileText,
  CalendarClock,
} from "lucide-react"

export default function DetalhesAluno({ aluno, open, onOpenChange, onAvaliar }) {
  if (!aluno) return null

  const percentual = Math.round((aluno.horasCumpridas / aluno.horasTotais) * 100)

  const statusInfo =
    {
      "Pendente":                { label: "Pendente de Avaliação", cor: "bg-amber-100 text-amber-800" },
      "Devolvido para Correção": { label: "Devolvido p/ Correção",  cor: "bg-red-100 text-red-800" },
      "Enviado ao Vice-Diretor": { label: "Aprovado",               cor: "bg-emerald-100 text-emerald-800" },
    }[aluno.statusRelatorio] || {
      label: aluno.statusRelatorio,
      cor: "bg-slate-100 text-slate-700",
    }

  const precisaAvaliar = aluno.statusRelatorio !== "Enviado ao Vice-Diretor"
  const dataParecer = formatarDataHora(aluno.dataAvaliacao)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-white p-0 sm:max-w-md"
      >
        {/* ─────────── HEADER FIXO ─────────── */}
        <SheetHeader className="shrink-0 border-b border-slate-200 bg-slate-50 p-5 pr-12">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {aluno.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-base font-semibold text-slate-800">
                {aluno.nome}
              </SheetTitle>
              <SheetDescription className="truncate text-xs text-slate-500">
                {aluno.curso} • {aluno.turno}
              </SheetDescription>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className={`${statusInfo.cor} border-none`}>{statusInfo.label}</Badge>
            <Badge variant="outline" className="gap-1 bg-white">
              <Hash className="size-3" /> {aluno.matricula}
            </Badge>
          </div>
        </SheetHeader>

        {/* ─────────── CORPO ROLÁVEL ─────────── */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Carga horária */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Carga Horária
            </h4>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  {aluno.horasCumpridas}h de {aluno.horasTotais}h
                </span>
                <span className="text-slate-500">{percentual}%</span>
              </div>
              <Progress value={percentual} className="h-2" />
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <Clock className="size-3" />
                {aluno.diasRestantes > 0
                  ? `Faltam ${aluno.diasRestantes} dias para finalizar`
                  : "Estágio concluído"}
              </p>
            </div>
          </section>

          <Separator />

          {/* Contato */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Informações para Contato
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-600">
                <Mail className="size-4 shrink-0 text-slate-400" />
                <a
                  href={`mailto:${aluno.email}`}
                  className="truncate hover:text-blue-600 hover:underline"
                >
                  {aluno.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <Phone className="size-4 shrink-0 text-slate-400" />
                <span>{aluno.telefone}</span>
              </li>
            </ul>
          </section>

          <Separator />

          {/* Dados do estágio */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Dados do Estágio
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-slate-600">
                <Building2 className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>{aluno.empresa}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>{aluno.periodoEstagio}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <BookOpen className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>{aluno.curso} — {aluno.turno}</span>
              </li>
              {aluno.dataEnvio && (
                <li className="flex items-start gap-2 text-slate-600">
                  <FileText className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  <span>Relatório enviado em {aluno.dataEnvio}</span>
                </li>
              )}
            </ul>
          </section>

          {/* Último parecer — com data */}
          {aluno.feedback && (
            <>
              <Separator />
              <section>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Último Parecer
                </h4>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {aluno.feedback}
                  </p>

                  {/* Rodapé com data + nota */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2 text-xs">
                    {dataParecer ? (
                      <span className="flex items-center gap-1 text-slate-500">
                        <CalendarClock className="size-3" />
                        {dataParecer}
                      </span>
                    ) : (
                      <span className="text-slate-400">Sem data registrada</span>
                    )}

                    {aluno.nota && (
                      <span className="text-slate-500">
                        Nota:{" "}
                        <span className="font-semibold text-blue-600">
                          {aluno.nota}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {/* ─────────── FOOTER FIXO ─────────── */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!precisaAvaliar}
            onClick={() => {
              onOpenChange(false)
              onAvaliar(aluno)
            }}
          >
            <FileText className="mr-2 size-4" />
            {aluno.statusRelatorio === "Pendente"
              ? "Avaliar Relatório"
              : aluno.statusRelatorio === "Devolvido para Correção"
              ? "Reavaliar Relatório"
              : "Ver Avaliação"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}