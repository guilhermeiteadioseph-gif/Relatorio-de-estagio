import { useState } from "react"
import { useViceDiretor } from "../contexts/vicediretorcontext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DetalhesCurso from "../components/detalhescurso"
import DetalhesUsuario from "../components/detalhesusuario"
import { GraduationCap, Users, UserCheck, ArrowRight } from "lucide-react"

export default function CursosSection() {
  const { cursos, usuarios, estagiarios } = useViceDiretor()
  const [cursoSelecionado, setCursoSelecionado] = useState(null)

  /* ⬇️ Estados que faltavam para abrir o perfil a partir do Dialog */
  const [pessoaSel, setPessoaSel] = useState(null)
  const [tipoPessoa, setTipoPessoa] = useState("usuario")

  const professores = usuarios.filter((u) => u.role === "professor")

  const CORES = {
    blue:    { bg: "bg-blue-50",    text: "text-blue-600",    icon: "bg-blue-100" },
    violet:  { bg: "bg-violet-50",  text: "text-violet-600",  icon: "bg-violet-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-100" },
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Cursos Técnicos</h1>
        <p className="text-sm text-slate-500">
          Veja estagiários e professores vinculados a cada curso.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cursos.map((c) => {
          const cores = CORES[c.cor] || CORES.blue
          const estagiariosDoCurso = estagiarios.filter((e) => e.curso === c.nome).length
          const professoresDoCurso = professores.filter((p) => (p.cursos || []).includes(c.nome)).length

          return (
            <Card key={c.id} className="border-slate-200/70 shadow-sm transition hover:shadow-md">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex size-11 items-center justify-center rounded-lg ${cores.icon}`}>
                    <GraduationCap className={`size-5 ${cores.text}`} />
                  </div>
                  <Badge variant="outline" className="bg-white text-xs">{c.codigo}</Badge>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-800">{c.nome}</h3>
                  <p className="text-xs text-slate-500">{c.duracao} • Coord. {c.coordenador}</p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge className={`border-none ${cores.bg} ${cores.text}`}>
                    <Users className="mr-1 size-3" /> {estagiariosDoCurso} estagiários
                  </Badge>
                  <Badge className="border-none bg-slate-100 text-slate-700">
                    <UserCheck className="mr-1 size-3" /> {professoresDoCurso} professores
                  </Badge>
                </div>

                <Button variant="outline" size="sm"
                  className="w-full justify-between border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  onClick={() => setCursoSelecionado(c)}>
                  Ver detalhes
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ⬇️ onVerPerfil agora definido — resolve o botão que não funcionava */}
      <DetalhesCurso
        curso={cursoSelecionado}
        estagiarios={estagiarios}
        professores={professores}
        open={!!cursoSelecionado}
        onOpenChange={(o) => !o && setCursoSelecionado(null)}
        onVerPerfil={(pessoa, tipo) => {
          setCursoSelecionado(null) // fecha o Dialog do curso
          setPessoaSel(pessoa)
          setTipoPessoa(tipo)
        }}
      />

      {/* Sheet de perfil aberto a partir do Dialog de curso */}
      <DetalhesUsuario
        pessoa={pessoaSel}
        tipo={tipoPessoa}
        open={!!pessoaSel}
        onOpenChange={(o) => !o && setPessoaSel(null)}
      />
    </div>
  )
}