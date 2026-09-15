import { useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import DropdownAcoes from "@/pages/vice-diretor/components/dropdownacoes"
import {
  Search, Eye, CalendarClock, AlertTriangle, Building2, Hash,
} from "lucide-react"

/**
 * Tabela de estagiários do painel do assistente.
 * Colunas: Estagiário | Curso | Empresa | Progresso | Status | Ações
 *
 * Ações disponíveis:
 *   - Ver detalhes    → abre Sheet lateral (onVerDetalhes)
 *   - Ver frequências → abre Dialog (onVerFrequencias)
 *   - Registrar ocorrência → abre Dialog (onRegistrarOcorrencia)
 */
export default function TabelaEstagiarios({
  dados = [],
  onVerDetalhes,
  onVerFrequencias,
  onRegistrarOcorrencia,
}) {
  const [busca, setBusca] = useState("")

  const filtrados = dados.filter(
    (e) =>
      e.nome.toLowerCase().includes(busca.toLowerCase()) ||
      e.matricula.includes(busca) ||
      e.curso.toLowerCase().includes(busca.toLowerCase())
  )

  const badgeStatus = (status) => {
    if (status === "ativo")
      return { classe: "bg-emerald-100 text-emerald-800 border-none", label: "Ativo" }
    if (status === "finalizado")
      return { classe: "bg-slate-100 text-slate-600 border-none", label: "Finalizado" }
    return { classe: "bg-slate-100 text-slate-600 border-none", label: status }
  }

  return (
    <div className="space-y-3">
      {/* Busca */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por nome, matrícula ou curso..."
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
              <TableHead className="font-semibold text-slate-600">Curso</TableHead>
              <TableHead className="font-semibold text-slate-600">Empresa</TableHead>
              <TableHead className="font-semibold text-slate-600">Progresso</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="w-16 text-right font-semibold text-slate-600">Ações</TableHead>
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
              const pct = Math.round((e.horasCumpridas / e.horasTotais) * 100)
              const temOcorrencia = (e.ocorrencias || []).length > 0

              return (
                <TableRow key={e.id} className="hover:bg-slate-50/70">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {e.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{e.nome}</p>
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Hash className="size-3" /> {e.matricula}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-slate-700">{e.curso}</TableCell>

                  <TableCell>
                    <p className="flex items-center gap-1 text-xs text-slate-600">
                      <Building2 className="size-3 text-slate-400" />
                      {e.empresa}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">
                          {e.horasCumpridas}h / {e.horasTotais}h
                        </span>
                        <span className="text-slate-500">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full bg-blue-600" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge className={badge.classe}>{badge.label}</Badge>
                      {temOcorrencia && (
                        <span
                          title={`${e.ocorrencias.length} ocorrência(s)`}
                          className="inline-flex size-5 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                        >
                          <AlertTriangle className="size-3" />
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownAcoes
                      label={`Ações · ${e.nome}`}
                      items={[
                        { label: "Ver detalhes", icon: Eye, onClick: () => onVerDetalhes?.(e) },
                        { label: "Ver frequências", icon: CalendarClock, onClick: () => onVerFrequencias?.(e) },
                        { separator: true },
                        {
                          label: "Registrar ocorrência",
                          icon: AlertTriangle,
                          variant: "destructive",
                          onClick: () => onRegistrarOcorrencia?.(e),
                        },
                      ]}
                    />
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