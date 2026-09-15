import { useState } from "react"
import { useAssistente } from "../contexts/assistentecontext"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import DialogoFrequencias from "@/pages/vice-diretor/components/dialogofrequencias"
import { Search, CalendarClock, AlertTriangle, Building2 } from "lucide-react"

/** Aba de Fichas de Frequência — mesma estrutura do vice-diretor. */
export default function FrequenciasAssistente() {
  const { estagiarios } = useAssistente()
  const [busca, setBusca] = useState("")
  const [estagiarioSel, setEstagiarioSel] = useState(null)

  const filtrados = estagiarios.filter(
    (e) =>
      e.nome.toLowerCase().includes(busca.toLowerCase()) ||
      e.matricula.includes(busca) ||
      e.empresa.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Fichas de Frequência</h1>
        <p className="text-sm text-slate-500">
          Acompanhe presenças, faltas e progresso de carga horária de cada estagiário.
        </p>
      </div>

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
          {filtrados.length} estagiário(s)
        </Badge>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-600">Estagiário</TableHead>
              <TableHead className="font-semibold text-slate-600">Empresa</TableHead>
              <TableHead className="w-56 font-semibold text-slate-600">Progresso</TableHead>
              <TableHead className="font-semibold text-slate-600">Faltas</TableHead>
              <TableHead className="w-40 text-right font-semibold text-slate-600">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-slate-500">
                  Nenhum estagiário encontrado.
                </TableCell>
              </TableRow>
            )}
            {filtrados.map((e) => {
              const pct = Math.round((e.horasCumpridas / e.horasTotais) * 100)
              return (
                <TableRow key={e.id} className="hover:bg-slate-50/70">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {e.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{e.nome}</p>
                        <p className="text-xs text-slate-500">Mat. {e.matricula}</p>
                      </div>
                    </div>
                  </TableCell>
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
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {e.faltas > 0 ? (
                      <Badge className="border-none bg-red-100 text-red-800 gap-1">
                        <AlertTriangle className="size-3" /> {e.faltas}
                      </Badge>
                    ) : (
                      <Badge className="border-none bg-emerald-100 text-emerald-800">0</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => setEstagiarioSel(e)}
                    >
                      <CalendarClock className="mr-1 size-3.5" />
                      Ver Frequências
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <DialogoFrequencias
        estagiario={estagiarioSel}
        open={!!estagiarioSel}
        onOpenChange={(o) => !o && setEstagiarioSel(null)}
      />
    </div>
  )
}