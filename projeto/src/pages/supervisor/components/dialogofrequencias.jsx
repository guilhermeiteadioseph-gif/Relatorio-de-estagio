import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  CalendarDays,
  TrendingUp,
  Target,
  Calendar,
  Building2,
  Briefcase,
} from "lucide-react"

/**
 * Dialog de frequências do estagiário.
 *
 * Visão preparada com:
 *   1. Cabeçalho com identificação (nome, matrícula, setor, empresa)
 *   2. Cards de resumo (horas totais, dias, média/dia, progresso)
 *   3. Barra de progresso da carga horária
 *   4. Tabela completa de frequências (com scroll interno)
 */
export default function DialogoFrequencias({ estagiario, open, onOpenChange }) {
  if (!estagiario) return null

  /* ---------- Cálculos de resumo ---------- */
  const frequencias = estagiario.frequencias || []
  const horasRegistradas = frequencias.reduce((acc, f) => acc + (f.horas || 0), 0)
  const totalDias = frequencias.length
  const mediaDiaria = totalDias ? (horasRegistradas / totalDias).toFixed(1) : "0.0"
  const percentual = Math.min(
    100,
    Math.round((estagiario.horasCumpridas / estagiario.horasTotais) * 100)
  )

  const cards = [
    {
      titulo: "Horas registradas",
      valor: `${horasRegistradas}h`,
      icone: Clock,
      cor: "text-blue-600",
      bgCor: "bg-blue-50",
    },
    {
      titulo: "Dias com registro",
      valor: totalDias,
      icone: CalendarDays,
      cor: "text-emerald-600",
      bgCor: "bg-emerald-50",
    },
    {
      titulo: "Média diária",
      valor: `${mediaDiaria}h`,
      icone: TrendingUp,
      cor: "text-violet-600",
      bgCor: "bg-violet-50",
    },
    {
      titulo: "Progresso",
      valor: `${percentual}%`,
      icone: Target,
      cor: "text-amber-600",
      bgCor: "bg-amber-50",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-5 p-0">
        {/* ─────────── Cabeçalho ─────────── */}
        <DialogHeader className="border-b border-slate-100 px-6 pt-6 pb-4 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-slate-400" />
            Frequências — {estagiario.nome}
          </DialogTitle>
          <DialogDescription>
            Matrícula {estagiario.matricula} • {estagiario.curso}
          </DialogDescription>

          {/* Chips com setor e empresa */}
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1 bg-white">
              <Briefcase className="size-3" /> {estagiario.setor}
            </Badge>
            <Badge variant="outline" className="gap-1 bg-white">
              <Building2 className="size-3" /> {estagiario.empresa.nome}
            </Badge>
          </div>
        </DialogHeader>

        {/* ─────────── Corpo ─────────── */}
        <div className="space-y-5 px-6">
          {/* Cards de resumo */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cards.map((c) => {
              const Icone = c.icone
              return (
                <div
                  key={c.titulo}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${c.bgCor}`}>
                    <Icone className={`size-4 ${c.cor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-slate-500">
                      {c.titulo}
                    </p>
                    <p className="text-base font-bold leading-tight text-slate-800 dark:text-slate-100">
                      {c.valor}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progresso da carga horária */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <Clock className="size-3" />
                Carga horária: {estagiario.horasCumpridas}h de{" "}
                {estagiario.horasTotais}h
              </span>
              <span className="text-slate-500">{percentual}%</span>
            </div>
            <Progress value={percentual} className="h-2" />
          </div>

          {/* Tabela de frequências */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Registro de Presenças
              </h4>
              <Badge variant="outline" className="bg-white text-xs">
                {totalDias} {totalDias === 1 ? "registro" : "registros"}
              </Badge>
            </div>

            {/* Scroll interno com altura confortável */}
            <div className="max-h-[340px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white dark:bg-slate-900">
                  <TableRow className="hover:bg-transparent">
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
                  {frequencias.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-sm text-slate-500"
                      >
                        Nenhuma frequência registrada.
                      </TableCell>
                    </TableRow>
                  )}
                  {frequencias.map((f) => (
                    <TableRow key={f.id} className="hover:bg-slate-50/70">
                      <TableCell className="text-sm text-slate-700 dark:text-slate-200">
                        {f.data}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {f.entrada}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {f.saida}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-slate-700 dark:text-slate-200">
                        {f.horas}h
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Espaçador inferior (o Dialog já tem padding lateral, mas
            queremos um respiro antes de fechar) */}
        <div className="h-2" />
      </DialogContent>
    </Dialog>
  )
}