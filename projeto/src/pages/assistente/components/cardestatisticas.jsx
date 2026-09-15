import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, Clock, AlertTriangle } from "lucide-react"

/** Cards de resumo no topo do painel do assistente. */
export default function CardsEstatisticas({ estagiarios = [] }) {
  const total = estagiarios.length
  const ativos = estagiarios.filter((e) => e.status === "ativo").length
  const horasRegistradas = estagiarios.reduce(
    (acc, e) => acc + (e.horasCumpridas || 0),
    0
  )
  const comOcorrencias = estagiarios.filter(
    (e) => (e.ocorrencias || []).length > 0
  ).length

  const cards = [
    { titulo: "Total de Estagiários", valor: total, icone: Users, cor: "text-blue-600", bgCor: "bg-blue-50" },
    { titulo: "Estagiários Ativos", valor: ativos, icone: UserCheck, cor: "text-emerald-600", bgCor: "bg-emerald-50" },
    { titulo: "Horas Registradas", valor: `${horasRegistradas}h`, icone: Clock, cor: "text-violet-600", bgCor: "bg-violet-50" },
    { titulo: "Com Ocorrências", valor: comOcorrencias, icone: AlertTriangle, cor: "text-amber-600", bgCor: "bg-amber-50" },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icone = c.icone
        return (
          <Card key={c.titulo} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${c.bgCor}`}>
                <Icone className={`size-5 ${c.cor}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-500">{c.titulo}</p>
                <p className="text-xl font-bold leading-tight text-slate-800">{c.valor}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}