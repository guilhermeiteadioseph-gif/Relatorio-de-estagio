import { useState } from "react"
import { useViceDiretor } from "../contexts/vicediretorcontext"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"
import DropdownAcoes from "../components/dropdownacoes"
import FormularioEmpresa from "../components/formularioempresa"
import DialogoEmpresa from "../components/dialogoempresa"
import { Search, Plus, Check, X, Edit, Eye, Users, Building2 } from "lucide-react"

export default function EmpresasSection() {
  const {
    empresas, usuarios, estagiarios,
    criarEmpresa, atualizarEmpresa, aprovarEmpresa, rejeitarEmpresa,
  } = useViceDiretor()

  const [busca, setBusca] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [empEdit, setEmpEdit] = useState(null)
  const [detalhesEmp, setDetalhesEmp] = useState(null)

  const filtradas = empresas.filter(
    (e) => e.nome.toLowerCase().includes(busca.toLowerCase()) || e.cnpj.includes(busca)
  )

  const acoesPara = (emp) => {
    const acoes = [
      { label: "Ver detalhes", icon: Eye, onClick: () => setDetalhesEmp(emp) },
      { label: "Editar", icon: Edit, onClick: () => { setEmpEdit(emp); setFormOpen(true) } },
    ]

    if (emp.status === "pendente") {
      acoes.unshift(
        {
          label: "Aprovar empresa",
          icon: Check,
          onClick: () => {
            aprovarEmpresa(emp.id)
            toast.success("Empresa aprovada", `${emp.nome} agora é parceira oficial.`)
          },
        },
        {
          label: "Rejeitar",
          icon: X,
          variant: "destructive",
          onClick: () => {
            rejeitarEmpresa(emp.id)
            toast.info("Empresa rejeitada")
          },
        },
        { separator: true }
      )
    }
    return acoes
  }

  const contarVinculados = (emp) =>
    usuarios.filter((u) => u.empresa === emp.nome).length +
    estagiarios.filter((e) => e.empresa === emp.nome).length

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gerenciar Empresas</h1>
          <p className="text-sm text-slate-500">
            Aprove novas empresas concedentes e acompanhe as parceiras.
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => { setEmpEdit(null); setFormOpen(true) }}
        >
          <Plus className="mr-2 size-4" /> Nova empresa
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="outline" className="bg-white text-sm">
          {filtradas.length} de {empresas.length}
        </Badge>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-600">Empresa</TableHead>
              <TableHead className="font-semibold text-slate-600">Contato</TableHead>
              <TableHead className="font-semibold text-slate-600">Endereço</TableHead>
              <TableHead className="font-semibold text-slate-600">Vinculados</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="w-16 text-right font-semibold text-slate-600">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                  Nenhuma empresa encontrada.
                </TableCell>
              </TableRow>
            )}
            {filtradas.map((emp) => (
              <TableRow key={emp.id} className="hover:bg-slate-50/70">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Building2 className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{emp.nome}</p>
                      <p className="text-xs text-slate-500">CNPJ {emp.cnpj}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="truncate text-xs text-slate-600">{emp.email}</p>
                  <p className="text-xs text-slate-500">{emp.telefone}</p>
                </TableCell>
                <TableCell>
                  <p className="truncate text-xs text-slate-600">{emp.endereco}</p>
                  <p className="text-xs text-slate-500">{emp.cidade}/{emp.uf}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-white text-xs">
                    <Users className="mr-1 size-3" />
                    {contarVinculados(emp)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {emp.status === "ativa" && <Badge className="border-none bg-emerald-100 text-emerald-800">Ativa</Badge>}
                  {emp.status === "pendente" && <Badge className="border-none bg-amber-100 text-amber-800">Pendente</Badge>}
                  {emp.status === "inativa" && <Badge className="border-none bg-slate-100 text-slate-600">Inativa</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownAcoes label={`Ações · ${emp.nome}`} items={acoesPara(emp)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FormularioEmpresa
        open={formOpen}
        onOpenChange={setFormOpen}
        empresa={empEdit}
        onSubmit={(dados) => {
          if (empEdit) { atualizarEmpresa(empEdit.id, dados); toast.success("Empresa atualizada") }
          else { criarEmpresa(dados); toast.success("Empresa cadastrada") }
        }}
      />

      <DialogoEmpresa
        empresa={detalhesEmp}
        open={!!detalhesEmp}
        onOpenChange={(o) => !o && setDetalhesEmp(null)}
        estagiarios={estagiarios}
        usuarios={usuarios}
      />
    </div>
  )
}