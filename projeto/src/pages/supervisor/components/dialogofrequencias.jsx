import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatarDataHora } from "@/utils/datetime"
import {
  Clock, CalendarDays, TrendingUp, Target, Calendar, Building2, Briefcase, History,
} from "lucide-react"

/**
 * Dialog de frequências com resumo + tabela completa.
 *
 * Visual 100% claro (o Dialog já força bg-white). Timestamps de registro
 * aparecem abaixo de cada data — visíveis apenas para supervisor e vice-diretor.
 */
export default function DialogoFrequencias({ estagiario, open, onOpenChange }) {
  if (!estagiario) return null

  const frequencias = estagiario.frequencias || []
  const horasRegistradas = frequencias.reduce((a, f) => a + (f.horas || 0), 0)
  const totalDias = frequencias.length
  const mediaDiaria = totalDias ? (horasRegistradas / totalDias).toFixed(1) : "0.0"
  const percentual = Math.min(
    100,
    Math.round((estagiario.horasCumpridas / estagiario.horasTotais) * 100)
  )

  const cards = [
    { titulo: "Horas registradas", valor: `${horasRegistradas}h`, icone: Clock, cor: "text-blue-600", bg: "bg-blue-50" },
    { titulo: "Dias com registro", valor: totalDias, icone: CalendarDays, cor: "text-emerald-600", bg: "bg-emerald-50" },
    { titulo: "Média diária", valor: `${mediaDiaria}h`, icone: TrendingUp, cor: "text-violet-600", bg: "bg-violet-50" },
    { titulo: "Progresso", valor: `${percentual}%`, icone: Target, cor: "text-amber-600", bg: "bg-amber-50" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-5 p-0">
        <DialogHeader className="border-b border-slate-100 px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <Calendar className="size-5 text-slate-400" />
            Frequências — {estagiario.nome}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Matrícula {estagiario.matricula} • {estagiario.curso}
          </DialogDescription>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1 bg-white">
              <Briefcase className="size-3" /> {estagiario.setor}
            </Badge>
            <Badge variant="outline" className="gap-1 bg-white">
              <Building2 className="size-3" /> {estagiario.empresa.nome}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-6 pb-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cards.map((c) => {
              const Icone = c.icone
              return (
                <div key={c.titulo} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${c.bg}`}>
                    <Icone className={`size-4 ${c.cor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-slate-500">{c.titulo}</p>
                    <p className="text-base font-bold leading-tight text-slate-800">{c.valor}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Clock className="size-3" />
                Carga horária: {estagiario.horasCumpridas}h de {estagiario.horasTotais}h
              </span>
              <span className="text-slate-500">{percentual}%</span>
            </div>
            <Progress value={percentual} className="h-2" />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <h4 className="text-sm font-semibold text-slate-700">Registro de Presenças</h4>
              <Badge variant="outline" className="bg-white text-xs">
                {totalDias} {totalDias === 1 ? "registro" : "registros"}
              </Badge>
            </div>
            <div className="max-h-[340px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-slate-600">Data</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Entrada</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Saída</TableHead>
                    <TableHead className="text-right text-xs font-semibold text-slate-600">Horas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {frequencias.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-500">
                        Nenhuma frequência registrada.
                      </TableCell>
                    </TableRow>
                  )}
                  {frequencias.map((f) => (
                    <TableRow key={f.id} className="hover:bg-slate-50/70">
                      <TableCell className="text-sm text-slate-700">
                        <div>{f.data}</div>
                        {/* ⬇️ Timestamp de registro — visível para supervisor/vice */}
                        {f.registradoEm && (
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                            <History className="size-2.5" />
                            Registrado em {formatarDataHora(f.registradoEm)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{f.entrada}</TableCell>
                      <TableCell className="text-sm text-slate-600">{f.saida}</TableCell>
                      <TableCell className="text-right text-sm font-medium text-slate-700">
                        {f.horas}h
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}