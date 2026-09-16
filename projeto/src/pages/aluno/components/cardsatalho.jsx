import { Card, CardContent } from "@/components/ui/card"
import {
  CalendarPlus,
  FileText,
  ClipboardCheck,
  Users,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

/**
 * Grid de cards de atalho — agem como "botões grandes".
 *
 * Cada card recebe:
 *   - icon:    componente Lucide
 *   - titulo:  título principal
 *   - desc:    subtítulo curto
 *   - cor:     classes de cor do ícone (bg + text)
 *   - onClick: função a executar
 *   - badge:   texto opcional (ex.: "Pendente")
 *   - badgeVariant: "default" | "warning" | "success" | "outline"
 *   - desabilitado: boolean
 */
export default function CardsAtalho({
  onAbrirFrequencia,
  onAbrirRelatorio,
  onAbrirAutoavaliacao,
  onAbrirContatos,
  autoavaliacaoDisponivel,
  relatorioStatus,
}) {
  /* -------------------------------------------------------------- */
  /*  Badge do relatório por status                                  */
  /* -------------------------------------------------------------- */
  const badgeRelatorio = () => {
    switch (relatorioStatus) {
      case "devolvido":
        return { texto: "Correções pendentes", variant: "warning" }
      case "aprovado":
        return { texto: "Aprovado", variant: "success" }
      case "nota-atribuida":
        return { texto: "Nota atribuída", variant: "success" }
      case "em-analise":
        return { texto: "Em análise", variant: "default" }
      default:
        return { texto: "Não enviado", variant: "outline" }
    }
  }

  const cards = [
    {
      id: "frequencia",
      icon: CalendarPlus,
      titulo: "Registrar Frequência",
      desc: "Lance a presença do dia",
      cor: "bg-blue-50 text-blue-600",
      onClick: onAbrirFrequencia,
    },
    {
      id: "relatorio",
      icon: FileText,
      titulo: "Relatório Final",
      desc: "Envie e acompanhe o status",
      cor: "bg-violet-50 text-violet-600",
      onClick: onAbrirRelatorio,
      badge: badgeRelatorio(),
    },
    {
      id: "autoavaliacao",
      icon: ClipboardCheck,
      titulo: "Autoavaliação",
      desc: autoavaliacaoDisponivel
        ? "Avalie seu próprio desempenho"
        : "Disponível ao final do estágio",
      cor: autoavaliacaoDisponivel
        ? "bg-emerald-50 text-emerald-600"
        : "bg-slate-100 text-slate-400",
      onClick: onAbrirAutoavaliacao,
      desabilitado: !autoavaliacaoDisponivel,
    },
    {
      id: "contatos",
      icon: Users,
      titulo: "Contatos e Empresa",
      desc: "Orientador, supervisor e empresa",
      cor: "bg-amber-50 text-amber-600",
      onClick: onAbrirContatos,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((c) => {
        const Icone = c.icon
        return (
          <Card
            key={c.id}
            onClick={c.desabilitado ? undefined : c.onClick}
            className={cn(
              "group cursor-pointer border-slate-200 shadow-sm transition-all",
              !c.desabilitado && "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md",
              c.desabilitado && "cursor-not-allowed opacity-70"
            )}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl",
                  c.cor
                )}
              >
                <Icone className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-slate-800">
                    {c.titulo}
                  </p>
                  {c.badge && (
                    <Badge
                      className={cn(
                        "shrink-0 border-none text-[10px]",
                        c.badge.variant === "warning" &&
                          "bg-amber-100 text-amber-800",
                        c.badge.variant === "success" &&
                          "bg-emerald-100 text-emerald-800",
                        c.badge.variant === "default" &&
                          "bg-blue-100 text-blue-800",
                        c.badge.variant === "outline" &&
                          "bg-slate-100 text-slate-600"
                      )}
                    >
                      {c.badge.texto}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{c.desc}</p>
              </div>

              <ChevronRight
                className={cn(
                  "size-5 shrink-0 text-slate-300 transition-transform",
                  !c.desabilitado && "group-hover:translate-x-0.5 group-hover:text-blue-500"
                )}
              />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}