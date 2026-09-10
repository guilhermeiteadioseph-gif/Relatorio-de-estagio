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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatarDataHora } from "@/utils/datetime"
import {
  Mail,
  Phone,
  Building2,
  CalendarDays,
  Clock,
  Hash,
  Briefcase,
  UserCircle2,
  ClipboardList,
  CheckCircle2,
  CalendarClock,
} from "lucide-react"

/**
 * Sheet lateral com dados do estagiário:
 *   - Contato
 *   - Dados do estágio / empresa
 *   - Frequências (com scroll interno)
 *   - Ação rápida para abrir o questionário
 */
export default function DetalhesEstagiario({
  estagiario,
  open,
  onOpenChange,
  onAvaliar,
}) {
  if (!estagiario) return null

  const percentual = Math.round(
    (estagiario.horasCumpridas / estagiario.horasTotais) * 100
  )

  const statusBadge =
    estagiario.status === "Ativo"
      ? { label: "Ativo", cor: "bg-emerald-100 text-emerald-800" }
      : { label: "Finalizado", cor: "bg-slate-100 text-slate-600" }

  const questionarioRespondido = estagiario.questionario.status === "respondido"
  const dataQuestionario = formatarDataHora(estagiario.questionario.respondidoEm)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-white p-0 sm:max-w-lg"
      >
        {/* ─────────── HEADER FIXO ─────────── */}
        <SheetHeader className="shrink-0 border-b border-slate-200 bg-slate-50 p-5 pr-12">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {estagiario.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-base font-semibold text-slate-800">
                {estagiario.nome}
              </SheetTitle>
              <SheetDescription className="truncate text-xs text-slate-500">
                {estagiario.curso}
              </SheetDescription>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className={`${statusBadge.cor} border-none`}>
              {statusBadge.label}
            </Badge>
            <Badge variant="outline" className="gap-1 bg-white">
              <Hash className="size-3" /> {estagiario.matricula}
            </Badge>
            <Badge variant="outline" className="gap-1 bg-white">
              <Briefcase className="size-3" /> {estagiario.setor}
            </Badge>
          </div>
        </SheetHeader>

        {/* ─────────── CORPO ROLÁVEL ─────────── */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Contato */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contato do Estagiário
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-600">
                <Mail className="size-4 shrink-0 text-slate-400" />
                <a
                  href={`mailto:${estagiario.email}`}
                  className="truncate hover:text-blue-600 hover:underline"
                >
                  {estagiario.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <Phone className="size-4 shrink-0 text-slate-400" />
                <span>{estagiario.telefone}</span>
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
                <span>{estagiario.empresa.nome}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <Briefcase className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>Setor: {estagiario.setor}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>{estagiario.periodoEstagio}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <UserCircle2 className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>Supervisor: {estagiario.supervisor}</span>
              </li>
            </ul>

            {/* Progresso da carga horária */}
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Clock className="size-3" />
                  {estagiario.horasCumpridas}h de {estagiario.horasTotais}h
                </span>
                <span className="text-slate-500">{percentual}%</span>
              </div>
              <Progress value={percentual} className="h-2" />
            </div>
          </section>

          <Separator />

          {/* Frequências */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Frequências
              </h4>
              <Badge variant="outline" className="text-xs">
                {estagiario.frequencias.length} registros
              </Badge>
            </div>

            {/*
              Lista de frequências com scroll interno (equivalente a ScrollArea):
              max-h-64 define a altura máxima visível; overflow-y-auto habilita o scroll.
            */}
            <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="text-xs font-semibold text-slate-600">
                      Data
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">
                      Entrada
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">
                      Saída
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold text-slate-600">
                      Horas
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estagiario.frequencias.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="text-xs text-slate-700">
                        {f.data}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {f.entrada}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {f.saida}
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium text-slate-700">
                        {f.horas}h
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Última avaliação (se já respondida) */}
          {questionarioRespondido && (
            <>
              <Separator />
              <section>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Questionário Respondido
                </h4>
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>
                    Avaliação enviada
                    {dataQuestionario && ` em ${dataQuestionario}`}
                  </span>
                </div>
              </section>
            </>
          )}
        </div>

        {/* ─────────── FOOTER FIXO ─────────── */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onOpenChange(false)
              onAvaliar(estagiario)
            }}
          >
            <ClipboardList className="mr-2 size-4" />
            {questionarioRespondido
              ? "Ver Questionário Respondido"
              : "Responder Questionário de Desempenho"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}