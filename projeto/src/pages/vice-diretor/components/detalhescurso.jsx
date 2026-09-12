import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { GraduationCap, Users, Building2, Eye } from "lucide-react"

/**
 * Dialog com informações de um curso técnico.
 * Cores agora usam `text-slate-900` (visível) em vez de herdar o tema.
 * Cada linha (estagiário/professor) tem botão "Ver perfil".
 */
export default function DetalhesCurso({
  curso, estagiarios, professores, open, onOpenChange, onVerPerfil,
}) {
  if (!curso) return null

  const estagiariosDoCurso = estagiarios.filter((e) => e.curso === curso.nome)
  const professoresDoCurso = professores.filter((p) => (p.cursos || []).includes(curso.nome))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <GraduationCap className="size-5 text-slate-400" />
            {curso.nome}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Código {curso.codigo} • {curso.duracao} • Coordenador: {curso.coordenador}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
          {/* Estagiários */}
          <section>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Users className="size-4 text-slate-400" />
              Estagiários ({estagiariosDoCurso.length})
            </h4>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="text-xs font-semibold text-slate-600">Nome</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Matrícula</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Empresa</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Status</TableHead>
                    <TableHead className="w-20 text-right text-xs font-semibold text-slate-600">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estagiariosDoCurso.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center text-sm text-slate-500">
                        Nenhum estagiário matriculado.
                      </TableCell>
                    </TableRow>
                  )}
                  {estagiariosDoCurso.map((e) => (
                    <TableRow key={e.id} className="hover:bg-slate-50/70">
                      <TableCell className="text-sm text-slate-800">{e.nome}</TableCell>
                      <TableCell className="text-xs text-slate-500">{e.matricula}</TableCell>
                      <TableCell className="text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="size-3 text-slate-400" />
                          {e.empresa}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border-none ${
                          e.status === "ativo" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}>
                          {e.status === "ativo" ? "Ativo" : e.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => onVerPerfil?.(e, "estagiario")}
                          className="text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          title="Ver perfil completo"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Professores */}
          <section>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <GraduationCap className="size-4 text-slate-400" />
              Professores ({professoresDoCurso.length})
            </h4>
            {professoresDoCurso.length === 0 && (
              <p className="text-sm text-slate-500">Nenhum professor vinculado.</p>
            )}
            <div className="space-y-1.5">
              {professoresDoCurso.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {p.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{p.nome}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onVerPerfil?.(p, "usuario")}
                    className="text-slate-500 hover:text-blue-600"
                  >
                    <Eye className="mr-1 size-3.5" /> Ver perfil
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}