import { useNavigate } from "react-router"
import { useViceDiretor } from "../contexts/vicediretorcontext"
import CardsEstatisticas from "../components/cardestatisticas"
import { Users, Building2, GraduationCap, ClipboardCheck, ArrowRight } from "lucide-react"

/**
 * Painel geral do vice-diretor.
 *
 * Ajustes:
 *   - Removidos os dois cards de "pendências" — a checagem é feita
 *     diretamente nas abas Usuários/Empresas.
 *   - Atalhos em 2 colunas (grid-cols-1 sm:grid-cols-2).
 *   - Ordem segue a sidebar: Usuários → Frequências → Empresas → Cursos.
 */
export default function PainelViceDiretor() {
  const navigate = useNavigate()
  const { usuarios, empresas, estagiarios, cursos } = useViceDiretor()

  const atalhos = [
    {
      titulo: "Gerenciar Usuários",
      desc: "Criar, aprovar e editar perfis de acesso.",
      icone: Users,
      cor: "text-blue-600",
      bg: "bg-blue-50",
      href: "/vice-diretor/gerenciar-usuarios",
    },
    {
      titulo: "Fichas de Frequência",
      desc: "Acompanhar presenças, faltas e carga horária.",
      icone: ClipboardCheck,
      cor: "text-amber-600",
      bg: "bg-amber-50",
      href: "/vice-diretor/fichas-frequencia",
    },
    {
      titulo: "Gerenciar Empresas",
      desc: "Aprovar e acompanhar empresas parceiras.",
      icone: Building2,
      cor: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/vice-diretor/gerenciar-empresas",
    },
    {
      titulo: "Cursos Técnicos",
      desc: "Ver estagiários e professores por curso.",
      icone: GraduationCap,
      cor: "text-violet-600",
      bg: "bg-violet-50",
      href: "/vice-diretor/gerenciar-cursos",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Painel do Vice-Diretor</h1>
        <p className="text-sm text-slate-500">
          Visão geral das atividades administrativas e atalhos rápidos.
        </p>
      </div>

      <CardsEstatisticas
        usuarios={usuarios}
        empresas={empresas}
        estagiarios={estagiarios}
        cursos={cursos}
      />

      {/* ─────────── ACESSO RÁPIDO (2 colunas) ─────────── */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {atalhos.map((a) => {
            const Icone = a.icone
            return (
              <button
                key={a.titulo}
                onClick={() => navigate(a.href)}
                className="group flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white p-5 text-left transition hover:border-blue-300 hover:shadow-md"
              >
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${a.bg}`}>
                  <Icone className={`size-6 ${a.cor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-slate-800">{a.titulo}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{a.desc}</p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}