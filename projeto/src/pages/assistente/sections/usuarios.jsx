import { useMemo, useState } from "react"
import { useAssistente } from "../contexts/assistentecontext"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"

/* Reaproveitados do vice-diretor */
import DropdownAcoes from "@/pages/vice-diretor/components/dropdownacoes"
import BadgePerfil from "@/pages/vice-diretor/components/badgeperfil"
import FormularioUsuario from "@/pages/vice-diretor/components/formulariousuario"
import DetalhesUsuario from "@/pages/vice-diretor/components/detalhesusuario"

import {
  Search, Check, X, Edit, Eye,
} from "lucide-react"

/**
 * Aba de usuários do assistente.
 *
 * Ações disponíveis (não-críticas):
 *   - Ver detalhes
 *   - Editar dados cadastrais (exceto diretor)
 *   - Aprovar / rejeitar solicitações pendentes
 *
 * Ações NÃO disponíveis (só o vice-diretor):
 *   - Promover a vice
 *   - Passar o bastão
 *   - Desativar / ativar contas
 */
export default function UsuariosAssistente() {
  const {
    usuarios, atualizarUsuario,
    aprovarSolicitacao, rejeitarSolicitacao,
  } = useAssistente()

  const [aba, setAba] = useState("todos")
  const [busca, setBusca] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [userEdit, setUserEdit] = useState(null)
  const [detalhes, setDetalhes] = useState(null)

  /* Filtra por aba + busca */
  const lista = useMemo(() => {
    let base = usuarios
    if (aba === "pendentes") base = base.filter((u) => u.status === "pendente")
    else if (aba === "professores") base = base.filter((u) => u.role === "professor")
    else if (aba === "supervisores") base = base.filter((u) => u.role === "supervisor")
    else if (aba === "assistentes") base = base.filter((u) => u.role === "assistente")
    else if (aba === "vice") base = base.filter((u) => u.role === "vice_diretor")
    else if (aba === "diretor") base = base.filter((u) => u.role === "diretor")
    return base.filter(
      (u) =>
        u.nome.toLowerCase().includes(busca.toLowerCase()) ||
        u.email.toLowerCase().includes(busca.toLowerCase())
    )
  }, [usuarios, aba, busca])

  /* Ações por linha — apenas as permitidas */
  const acoesPara = (u) => {
    const acoes = [
      { label: "Ver detalhes", icon: Eye, onClick: () => setDetalhes(u) },
    ]

    // Não pode editar o diretor (cargo superior)
    if (u.role !== "diretor") {
      acoes.push({
        label: "Editar dados",
        icon: Edit,
        onClick: () => { setUserEdit(u); setFormOpen(true) },
      })
    }

    // Aprovação de solicitações pendentes
    if (u.status === "pendente") {
      acoes.unshift(
        {
          label: "Aprovar solicitação",
          icon: Check,
          onClick: () => {
            aprovarSolicitacao(u.id)
            toast.success("Solicitação aprovada", `${u.nome} agora tem acesso.`)
          },
        },
        {
          label: "Rejeitar solicitação",
          icon: X,
          variant: "destructive",
          onClick: () => {
            rejeitarSolicitacao(u.id)
            toast.info("Solicitação rejeitada")
          },
        },
        { separator: true }
      )
    }

    return acoes
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Gerenciar Usuários</h1>
        <p className="text-sm text-slate-500">
          Visualize, aprove solicitações e edite dados cadastrais.
          Ações críticas ficam com o Vice-Diretor.
        </p>
      </div>

      <Tabs value={aba} onValueChange={setAba}>
        <TabsList className="flex flex-wrap bg-white">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendentes">
            Pendentes
            {usuarios.filter((u) => u.status === "pendente").length > 0 && (
              <Badge className="ml-1 h-4 border-none bg-amber-500 px-1 text-[10px] text-white">
                {usuarios.filter((u) => u.status === "pendente").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="professores">Professores</TabsTrigger>
          <TabsTrigger value="supervisores">Supervisores</TabsTrigger>
          <TabsTrigger value="assistentes">Assistentes</TabsTrigger>
          <TabsTrigger value="vice">Vice-Diretores</TabsTrigger>
          <TabsTrigger value="diretor">Diretor</TabsTrigger>
        </TabsList>

        <TabsContent value={aba} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-8"
              />
            </div>
            <Badge variant="outline" className="bg-white text-sm">
              {lista.length} registro(s)
            </Badge>
          </div>

          <TabelaUsuarios usuarios={lista} acoesPara={acoesPara} />
        </TabsContent>
      </Tabs>

      {/* Formulário de edição (reaproveitado do vice) */}
      <FormularioUsuario
        open={formOpen}
        onOpenChange={setFormOpen}
        usuario={userEdit}
        onSubmit={(dados) => {
          atualizarUsuario(userEdit.id, dados)
          toast.success("Dados atualizados")
        }}
      />

      {/* Sheet de detalhes (reaproveitado do vice) */}
      <DetalhesUsuario
        pessoa={detalhes}
        tipo="usuario"
        open={!!detalhes}
        onOpenChange={(o) => !o && setDetalhes(null)}
      />
    </div>
  )
}

/* ─────────────── Subcomponente: tabela ─────────────── */
function TabelaUsuarios({ usuarios, acoesPara }) {
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-600">Usuário</TableHead>
            <TableHead className="font-semibold text-slate-600">Contato</TableHead>
            <TableHead className="font-semibold text-slate-600">Perfil</TableHead>
            <TableHead className="font-semibold text-slate-600">Status</TableHead>
            <TableHead className="w-16 text-right font-semibold text-slate-600">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-slate-500">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          )}
          {usuarios.map((u) => (
            <TableRow key={u.id} className="hover:bg-slate-50/70">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {u.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{u.nome}</p>
                    {u.empresa && <p className="truncate text-xs text-slate-500">{u.empresa}</p>}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="truncate text-xs text-slate-600">{u.email}</p>
                <p className="text-xs text-slate-500">{u.telefone || "—"}</p>
              </TableCell>
              <TableCell>
                <BadgePerfil role={u.role} />
              </TableCell>
              <TableCell>
                {u.status === "ativo" && <Badge className="border-none bg-emerald-100 text-emerald-800">Ativo</Badge>}
                {u.status === "pendente" && <Badge className="border-none bg-amber-100 text-amber-800">Pendente</Badge>}
                {u.status === "inativo" && <Badge className="border-none bg-slate-100 text-slate-600">Inativo</Badge>}
              </TableCell>
              <TableCell className="text-right">
                <DropdownAcoes label={`Ações · ${u.nome}`} items={acoesPara(u)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}