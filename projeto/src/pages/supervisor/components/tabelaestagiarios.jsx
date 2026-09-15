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
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreVertical,
  CalendarClock,
  ClipboardList,
  CheckCircle2,
  Search,
  Eye,
} from "lucide-react"

/**
 * Tabela principal de estagiários.
 * Colunas: Aluno | Contato | Setor | Período | Status | Ações (dropdown)
 *
 * Ações no dropdown:
 *   - Ver Frequências  → abre DialogoFrequencias (onVerFrequencias)
 *   - Avaliar Estágio  → navega/abre o questionário (onAvaliar)
 */
export default function TabelaEstagiarios({
  dados = [],
  onVerFrequencias,
  onAvaliar,
  onVerPerfil,
}) {
  const [busca, setBusca] = useState("")

  const filtrados = dados.filter(
    (e) =>
      e.nome.toLowerCase().includes(busca.toLowerCase()) ||
      e.matricula.includes(busca) ||
      e.setor.toLowerCase().includes(busca.toLowerCase())
  )

  const badgeStatus = (status) => {
    if (status === "Ativo") {
      return {
        classe: "bg-emerald-100 text-emerald-800 border-none",
        label: "Ativo",
      }
    }
    return {
      classe: "bg-slate-100 text-slate-600 border-none",
      label: "Finalizado",
    }
  }

  return (
    <div className="space-y-3">
      {/* Busca */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por nome, matrícula ou setor..."
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
              <TableHead className="font-semibold text-slate-600">Estagiário</TableHead>
              <TableHead className="font-semibold text-slate-600">Contato</TableHead>
              <TableHead className="font-semibold text-slate-600">Setor</TableHead>
              <TableHead className="font-semibold text-slate-600">Período</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="w-16 text-right font-semibold text-slate-600">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                  Nenhum estagiário encontrado.
                </TableCell>
              </TableRow>
            )}

            {filtrados.map((e) => {
              const badge = badgeStatus(e.status)
              const questionarioPendente = e.questionario.status === "pendente"

              return (
                <TableRow key={e.id} className="hover:bg-slate-50/70">
                  {/* Estagiário */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {e.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {e.nome}
                        </p>
                        <p className="text-xs text-slate-500">Mat. {e.matricula}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contato */}
                  <TableCell>
                    <p className="truncate text-xs text-slate-600">{e.email}</p>
                    <p className="text-xs text-slate-500">{e.telefone}</p>
                  </TableCell>

                  {/* Setor */}
                  <TableCell>
                    <p className="text-sm text-slate-700">{e.setor}</p>
                  </TableCell>

                  {/* Período */}
                  <TableCell>
                    <p className="text-xs text-slate-600">{e.periodoEstagio}</p>
                    <p className="text-[11px] text-slate-400">
                      {e.horasCumpridas}h / {e.horasTotais}h
                    </p>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge className={badge.classe}>{badge.label}</Badge>
                  </TableCell>

                  {/* Ações — dropdown único */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 outline-hidden data-[state=open]:bg-slate-100"
                        aria-label="Ações do estagiário"
                      >
                        <MoreVertical className="size-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        sideOffset={4}
                        className="w-52 bg-white"
                      >
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Ver Informações do Perfil */}
                        <DropdownMenuItem
                          onClick={() => onVerPerfil?.(e)}
                          className="cursor-pointer gap-2"
                        >
                          <Eye className="size-4 text-slate-500" />
                          <span>Ver perfil</span>
                        </DropdownMenuItem>

                        {/* Ver Frequências */}
                        <DropdownMenuItem
                          onClick={() => onVerFrequencias?.(e)}
                          className="cursor-pointer gap-2"
                        >
                          <CalendarClock className="size-4 text-slate-500" />
                          <span>Ver Frequências</span>
                        </DropdownMenuItem>

                        {/* Avaliar Estágio */}
                        <DropdownMenuItem
                          onClick={() => onAvaliar?.(e)}
                          className="cursor-pointer gap-2"
                        >
                          {questionarioPendente ? (
                            <>
                              <ClipboardList className="size-4 text-blue-600" />
                              <span>Avaliar Estágio</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="size-4 text-emerald-600" />
                              <span>Ver Avaliação</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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