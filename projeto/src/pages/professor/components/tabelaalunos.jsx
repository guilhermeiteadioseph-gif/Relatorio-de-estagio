import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Eye, FileText, Search, RefreshCw } from "lucide-react"

/**
 * Tabela principal de alunos orientandos.
 * Colunas: Aluno | Curso/Turno | Empresa | Carga Horária | Status | Ações
 */
export default function TabelaAlunos({ dados = [], onVerDetalhes, onAvaliar }) {
  const [busca, setBusca] = useState("")

  const filtrados = dados.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
    a.matricula.includes(busca) ||
    a.empresa.toLowerCase().includes(busca.toLowerCase())
  )

  /* Mapeia status do relatório → aparência do Badge */
  const badgeStatus = (status) => {
    switch (status) {
      case "Enviado ao Vice-Diretor":
        return { classe: "bg-emerald-100 text-emerald-800 border-none", label: "Aprovado" }
      case "Devolvido para Correção":
        return { classe: "bg-red-100 text-red-800 border-none", label: "Correção" }
      case "Pendente":
      default:
        return { classe: "bg-amber-100 text-amber-800 border-none", label: "Pendente" }
    }
  }

  return (
    <div className="space-y-3">
      {/* Barra de busca */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por nome, matrícula ou empresa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="outline" className="bg-white text-sm">
          {filtrados.length} de {dados.length}
        </Badge>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-600">Aluno</TableHead>
              <TableHead className="font-semibold text-slate-600">Curso / Turno</TableHead>
              <TableHead className="font-semibold text-slate-600">Empresa</TableHead>
              <TableHead className="font-semibold text-slate-600 w-56">Carga Horária</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            )}

            {filtrados.map((aluno) => {
              const percentual = Math.round((aluno.horasCumpridas / aluno.horasTotais) * 100)
              const badge = badgeStatus(aluno.statusRelatorio)

              return (
                <TableRow key={aluno.id} className="hover:bg-slate-50/70">
                  {/* Aluno (avatar + nome + matrícula) */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {aluno.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{aluno.nome}</p>
                        <p className="text-xs text-slate-500">Mat. {aluno.matricula}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Curso / Turno */}
                  <TableCell>
                    <p className="text-sm text-slate-700">{aluno.curso}</p>
                    <p className="text-xs text-slate-500">{aluno.turno}</p>
                  </TableCell>

                  {/* Empresa */}
                  <TableCell>
                    <p className="text-sm text-slate-700">{aluno.empresa}</p>
                    <p className="text-xs text-slate-500">{aluno.periodoEstagio}</p>
                  </TableCell>

                  {/* Carga horária com progress */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">
                          {aluno.horasCumpridas}h / {aluno.horasTotais}h
                        </span>
                        <span className="text-slate-500">{percentual}%</span>
                      </div>
                      <Progress value={percentual} className="h-1.5" />
                      <p className="text-[11px] text-slate-400">
                        {aluno.diasRestantes > 0
                          ? `Faltam ${aluno.diasRestantes} dias`
                          : "Concluído"}
                      </p>
                    </div>
                  </TableCell>

                  {/* Status do relatório */}
                  <TableCell>
                    <Badge className={badge.classe}>{badge.label}</Badge>
                  </TableCell>

                  {/* Ações */}
                  <TableCell className="text-right">
                    <TooltipProvider delayDuration={200}>
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onVerDetalhes(aluno)}
                                className="text-slate-500 hover:text-blue-600"
                              >
                                <Eye />
                              </Button>
                            }
                          />
                          <TooltipContent>Ver detalhes</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant={
                                  aluno.statusRelatorio === "Enviado ao Vice-Diretor"
                                    ? "outline"
                                    : "default"
                                }
                                size="sm"
                                className={
                                  aluno.statusRelatorio === "Enviado ao Vice-Diretor"
                                    ? "text-blue-600 border-blue-200 hover:bg-blue-50"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }
                                onClick={() => onAvaliar(aluno)}
                              >
                                {aluno.statusRelatorio === "Devolvido para Correção" ? (
                                  <><RefreshCw className="mr-1 size-3.5" /> Reavaliar</>
                                ) : aluno.statusRelatorio === "Enviado ao Vice-Diretor" ? (
                                  <><FileText className="mr-1 size-3.5" /> Ver Avaliação</>
                                ) : (
                                  <><FileText className="mr-1 size-3.5" /> Avaliar</>
                                )}
                              </Button>
                            }
                          />
                          <TooltipContent>Abrir relatório para avaliação</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}