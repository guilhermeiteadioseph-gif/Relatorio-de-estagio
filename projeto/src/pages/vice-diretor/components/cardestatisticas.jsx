import { Card, CardContent } from "@/components/ui/card"
import { Users, Building2, GraduationCap, ClipboardCheck } from "lucide-react"

/** Cards de resumo no topo do painel. */
export default function CardsEstatisticas({ usuarios, empresas, estagiarios, cursos }) {
  const solicitacoesPendentes = usuarios.filter((u) => u.status === "pendente").length
  const empresasPendentes = empresas.filter((e) => e.status === "pendente").length
  const estagiariosAtivos = estagiarios.filter((e) => e.status === "ativo").length

  const cards = [
    {
      titulo: "Usuários Ativos",
      valor: usuarios.filter((u) => u.status === "ativo").length,
      descricao: `${solicitacoesPendentes} pendentes`,
      icone: Users,
      cor: "text-blue-600",
      bgCor: "bg-blue-50",
    },
    {
      titulo: "Empresas Parceiras",
      valor: empresas.filter((e) => e.status === "ativa").length,
      descricao: `${empresasPendentes} aguardando aprovação`,
      icone: Building2,
      cor: "text-emerald-600",
      bgCor: "bg-emerald-50",
    },
    {
      titulo: "Estagiários Ativos",
      valor: estagiariosAtivos,
      descricao: `${estagiarios.length} no total`,
      icone: GraduationCap,
      cor: "text-violet-600",
      bgCor: "bg-violet-50",
    },
    {
      titulo: "Cursos Técnicos",
      valor: cursos.length,
      descricao: "ativos na instituição",
      icone: ClipboardCheck,
      cor: "text-amber-600",
      bgCor: "bg-amber-50",
    },
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
                <p className="truncate text-[11px] text-slate-400">{c.descricao}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}