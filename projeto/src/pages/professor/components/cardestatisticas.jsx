import { Card, CardContent } from "@/components/ui/card"
import { Users, FileCheck2, FileClock, FileWarning } from "lucide-react"

/**
 * Cards de resumo no topo do painel.
 * Recebe a lista de alunos e calcula contadores automaticamente.
 */
export default function CardsEstatisticas({ alunos = [] }) {
  const total = alunos.length
  const aprovados = alunos.filter(a => a.statusRelatorio === "Enviado ao Vice-Diretor").length
  const pendentes = alunos.filter(a => a.statusRelatorio === "Pendente").length
  const correcao  = alunos.filter(a => a.statusRelatorio === "Devolvido para Correção").length

  const cards = [
    {
      titulo: "Total de Orientandos",
      valor: total,
      icone: Users,
      cor: "text-blue-600",
      bgCor: "bg-blue-50",
    },
    {
      titulo: "Relatórios Aprovados",
      valor: aprovados,
      icone: FileCheck2,
      cor: "text-emerald-600",
      bgCor: "bg-emerald-50",
    },
    {
      titulo: "Pendentes de Avaliação",
      valor: pendentes,
      icone: FileClock,
      cor: "text-amber-600",
      bgCor: "bg-amber-50",
    },
    {
      titulo: "Devolvidos p/ Correção",
      valor: correcao,
      icone: FileWarning,
      cor: "text-red-600",
      bgCor: "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icone = c.icone
        return (
          <Card key={c.titulo} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex size-10 items-center justify-center rounded-lg ${c.bgCor}`}>
                <Icone className={`size-5 ${c.cor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 truncate">{c.titulo}</p>
                <p className="text-xl font-bold text-slate-800 leading-tight">{c.valor}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}