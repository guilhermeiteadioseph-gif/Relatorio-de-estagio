import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatarDataHora } from "@/utils/datetime"
import {
  Mail, Phone, Building2, CalendarDays, Clock, Hash, Briefcase,
  UserCircle2, AlertTriangle, History,
} from "lucide-react"

/**
 * Sheet lateral com dados completos do estagiário (visão do assistente).
 * Somente leitura — edição é feita pelo vice-diretor.
 */
export default function DetalhesEstagiario({ estagiario, open, onOpenChange }) {
  if (!estagiario) return null

  const percentual = Math.round(
    (estagiario.horasCumpridas / estagiario.horasTotais) * 100
  )

  const statusBadge =
    estagiario.status === "ativo"
      ? { label: "Ativo", cor: "bg-emerald-100 text-emerald-800" }
      : { label: "Finalizado", cor: "bg-slate-100 text-slate-600" }

  const ocorrencias = estagiario.ocorrencias || []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-white p-0 sm:max-w-md">
        {/* Header fixo */}
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
            <Badge className={`${statusBadge.cor} border-none`}>{statusBadge.label}</Badge>
            <Badge variant="outline" className="gap-1 bg-white">
              <Hash className="size-3" /> {estagiario.matricula}
            </Badge>
          </div>
        </SheetHeader>

        {/* Corpo */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Contato */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contato
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-600">
                <Mail className="size-4 shrink-0 text-slate-400" />
                <a href={`mailto:${estagiario.email}`} className="truncate hover:text-blue-600 hover:underline">
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
                <span>{estagiario.empresa}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <Briefcase className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>Supervisor: {estagiario.supervisor}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>{estagiario.periodoEstagio}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <UserCircle2 className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>Curso: {estagiario.curso} — {estagiario.turno}</span>
              </li>
            </ul>

            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Clock className="size-3" />
                  {estagiario.horasCumpridas}h de {estagiario.horasTotais}h
                </span>
                <span className="text-slate-500">{percentual}%</span>
              </div>
              <Progress value={percentual} className="h-2" />
              {estagiario.faltas > 0 && (
                <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle className="size-3" />
                  {estagiario.faltas} falta{estagiario.faltas > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </section>

          {/* Ocorrências */}
          {ocorrencias.length > 0 && (
            <>
              <Separator />
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Ocorrências
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {ocorrencias.length}
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {ocorrencias.map((oc) => (
                    <li
                      key={oc.id}
                      className="rounded-lg border border-amber-200 bg-amber-50 p-3"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <AlertTriangle className="size-3.5 text-amber-600" />
                        <span className="text-xs font-semibold capitalize text-amber-900">
                          {oc.tipo}
                        </span>
                        <Badge variant="outline" className="border-amber-300 bg-white text-[10px] capitalize">
                          {oc.gravidade}
                        </Badge>
                      </div>
                      <p className="text-xs leading-relaxed text-amber-800">{oc.descricao}</p>
                      <p className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-700/70">
                        <History className="size-2.5" />
                        {formatarDataHora(oc.registradoEm)} • {oc.registradoPor}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}