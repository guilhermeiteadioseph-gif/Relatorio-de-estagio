import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/** Cores por role — dá "vida" à tabela e facilita a leitura rápida. */
const CORES = {
  professor:    "bg-blue-100 text-blue-800",
  supervisor:   "bg-emerald-100 text-emerald-800",
  assistente:   "bg-violet-100 text-violet-800",
  vice_diretor: "bg-amber-100 text-amber-800",
  diretor:      "bg-rose-100 text-rose-800",
  admin:        "bg-slate-200 text-slate-700",
  estagiario:   "bg-cyan-100 text-cyan-800",
}

const LABEL = {
  professor: "Professor",
  supervisor: "Supervisor",
  assistente: "Assistente",
  vice_diretor: "Vice-Diretor",
  diretor: "Diretor",
  admin: "Administrador",
  estagiario: "Estagiário",
}

export default function BadgePerfil({ role, className }) {
  return (
    <Badge className={cn(CORES[role] || "bg-slate-100 text-slate-700", "border-none font-medium", className)}>
      {LABEL[role] || role}
    </Badge>
  )
}