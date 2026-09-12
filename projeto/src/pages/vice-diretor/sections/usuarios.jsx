import { useMemo, useState } from "react"
import { useViceDiretor } from "../contexts/vicediretorcontext"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"
import DropdownAcoes from "../components/dropdownacoes"
import BadgePerfil from "../components/badgeperfil"
import FormularioUsuario from "../components/formulariousuario"
import FormularioEstagiario from "../components/formularioestagiario"
import FormularioEstagiariosEmLote from "../components/formularioestagiariosemlote"
import EscolhaModoEstagiario from "../components/escolhamodoestagiario"
import DetalhesUsuario from "../components/detalhesusuario"
import DialogoAvaliacaoSupervisor from "../components/dialogoavaliacaosupervisor"
import DialogoRelatorioFinal from "../components/dialogorelatoriofinal"
import {
  Search, Plus, Check, X, Edit, Eye, Trash2, ShieldCheck, Star,
  AlertTriangle, RotateCcw, UserPlus, FileText, ArrowRightLeft,
  ChevronDown, ChevronRight,
} from "lucide-react"

/** ID do vice-diretor "logado" (num app real viria do AuthContext). */
const VICE_LOGADO_ID = "u4"

export default function UsuariosSection() {
  const {
    usuarios, estagiarios, empresas, cursos,
    criarUsuario, atualizarUsuario,
    aprovarSolicitacao, rejeitarSolicitacao,
    desativarUsuario, ativarUsuario, promoverViceDiretor, passarBastao,
    criarEstagiario, criarEstagiariosEmLote, atualizarEstagiario,
  } = useViceDiretor()

  const [aba, setAba] = useState("todos")
  const [busca, setBusca] = useState("")
  const [formUserOpen, setFormUserOpen] = useState(false)
  const [formEstOpen, setFormEstOpen] = useState(false)          // individual
  const [formEstLoteOpen, setFormEstLoteOpen] = useState(false)  // em massa
  const [escolhaModoOpen, setEscolhaModoOpen] = useState(false)  // escolha inicial
  const [userEdit, setUserEdit] = useState(null)
  const [estEdit, setEstEdit] = useState(null)
  const [detalhes, setDetalhes] = useState(null)
  const [tipoDetalhes, setTipoDetalhes] = useState("usuario")
  const [avaliacao, setAvaliacao] = useState(null)
  const [relatorio, setRelatorio] = useState(null)

  const [colapsadoUsuarios, setColapsadoUsuarios] = useState(false)
  const [colapsadoEstagiarios, setColapsadoEstagiarios] = useState(false)

  const usuariosVisiveis = useMemo(() => usuarios.filter((u) => !u.oculto), [usuarios])

  /* ─────── Lista de usuários filtrados por aba + busca ─────── */
  const listaUsuarios = useMemo(() => {
    let base = usuariosVisiveis
    if (aba === "pendentes") base = base.filter((u) => u.status === "pendente")
    else if (aba === "professores") base = base.filter((u) => u.role === "professor")
    else if (aba === "supervisores") base = base.filter((u) => u.role === "supervisor")
    else if (aba === "assistentes") base = base.filter((u) => u.role === "assistente")
    else if (aba === "vice") base = base.filter((u) => u.role === "vice_diretor")
    else if (aba === "diretor") base = base.filter((u) => u.role === "diretor")
    else if (aba === "estagiarios") base = []
    return base.filter(
      (u) =>
        u.nome.toLowerCase().includes(busca.toLowerCase()) ||
        u.email.toLowerCase().includes(busca.toLowerCase())
    )
  }, [usuariosVisiveis, aba, busca])

  /* ─────── Lista de estagiários filtrados por busca ─────── */
  const listaEstagiarios = useMemo(() => {
    if (aba !== "todos" && aba !== "estagiarios") return []
    return estagiarios.filter(
      (e) =>
        e.nome.toLowerCase().includes(busca.toLowerCase()) ||
        e.matricula.includes(busca) ||
        (e.email && e.email.toLowerCase().includes(busca.toLowerCase()))
    )
  }, [estagiarios, aba, busca])

  const totalRegistros =
    aba === "todos"
      ? listaUsuarios.length + listaEstagiarios.length
      : aba === "estagiarios"
      ? listaEstagiarios.length
      : listaUsuarios.length

  /* ─────── Ações para usuários comuns ─────── */
  const acoesParaUsuario = (u) => {
    const acoes = [
      { label: "Ver detalhes", icon: Eye, onClick: () => { setDetalhes(u); setTipoDetalhes("usuario") } },
    ]

    if (u.role !== "diretor") {
      acoes.push({ label: "Editar", icon: Edit, onClick: () => { setUserEdit(u); setFormUserOpen(true) } })
    }

    if (u.status === "pendente") {
      acoes.unshift(
        { label: "Aprovar solicitação", icon: Check, onClick: () => {
          aprovarSolicitacao(u.id)
          toast.success("Solicitação aprovada", `${u.nome} agora tem acesso ao sistema.`)
        }},
        { label: "Rejeitar solicitação", icon: X, variant: "destructive", onClick: () => {
          rejeitarSolicitacao(u.id)
          toast.info("Solicitação rejeitada")
        }},
        { separator: true }
      )
    }

    if (u.role !== "vice_diretor" && u.role !== "diretor" && u.status === "ativo") {
      acoes.push({
        label: "Promover a Vice-Diretor",
        icon: ShieldCheck,
        onClick: () => {
          if (confirm(`Promover ${u.nome} a Vice-Diretor? A sua conta continua ativa.`)) {
            promoverViceDiretor(u.id)
            toast.success("Promoção concluída", `${u.nome} agora é Vice-Diretor.`)
          }
        },
      })
    }

    if (
      u.id !== VICE_LOGADO_ID &&
      u.role !== "diretor" &&
      u.role !== "admin" &&
      u.status === "ativo"
    ) {
      acoes.push({
        label: "Passar o bastão (transferir funções)",
        icon: ArrowRightLeft,
        onClick: () => {
          if (
            confirm(
              `Transferir as funções de Vice-Diretor para ${u.nome}?\n\n` +
              `Sua conta será desativada após a transferência. Você poderá reativá-la ` +
              `depois apenas por outro administrador.`
            )
          ) {
            passarBastao(u.id, VICE_LOGADO_ID)
            toast.success("Transferência concluída", `${u.nome} agora é Vice-Diretor.`)
          }
        },
      })
    }

    if (u.status === "ativo" && u.role !== "diretor" && u.id !== VICE_LOGADO_ID) {
      acoes.push({ separator: true })
      acoes.push({
        label: "Desativar conta",
        icon: Trash2,
        variant: "destructive",
        onClick: () => {
          if (confirm(`Desativar a conta de ${u.nome}? (não será deletada)`)) {
            desativarUsuario(u.id)
            toast.info("Conta desativada")
          }
        },
      })
    }

    if (u.status === "inativo") {
      acoes.push({ separator: true })
      acoes.push({
        label: "Ativar conta novamente",
        icon: RotateCcw,
        onClick: () => {
          ativarUsuario(u.id)
          toast.success("Conta reativada")
        },
      })
    }

    return acoes
  }

  /* ─────── Decide o que renderizar dentro do TabsContent ─────── */
  const renderConteudo = () => {
    if (aba === "estagiarios") {
      return (
        <TabelaEstagiarios
          estagiarios={listaEstagiarios}
          onVerDetalhes={(e) => { setDetalhes(e); setTipoDetalhes("estagiario") }}
          onEditar={(e) => { setEstEdit(e); setFormEstOpen(true) }}
          onVerAvaliacao={(e) => setAvaliacao(e)}
          onVerRelatorio={(e) => setRelatorio(e)}
        />
      )
    }

    if (aba === "todos") {
      return (
        <div className="space-y-6">
          {/* Bloco 1 — Usuários */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setColapsadoUsuarios((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:text-slate-800"
              >
                {colapsadoUsuarios ? (
                  <ChevronRight className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
                Usuários ({listaUsuarios.length})
              </button>
            </div>
            {!colapsadoUsuarios && (
              <TabelaUsuarios usuarios={listaUsuarios} acoesPara={acoesParaUsuario} />
            )}
          </div>

          {/* Bloco 2 — Estagiários */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setColapsadoEstagiarios((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:text-slate-800"
              >
                {colapsadoEstagiarios ? (
                  <ChevronRight className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
                Estagiários ({listaEstagiarios.length})
              </button>
            </div>
            {!colapsadoEstagiarios && (
              <TabelaEstagiarios
                estagiarios={listaEstagiarios}
                onVerDetalhes={(e) => { setDetalhes(e); setTipoDetalhes("estagiario") }}
                onEditar={(e) => { setEstEdit(e); setFormEstOpen(true) }}
                onVerAvaliacao={(e) => setAvaliacao(e)}
                onVerRelatorio={(e) => setRelatorio(e)}
              />
            )}
          </div>
        </div>
      )
    }

    return <TabelaUsuarios usuarios={listaUsuarios} acoesPara={acoesParaUsuario} />
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gerenciar Usuários</h1>
          <p className="text-sm text-slate-500">
            Crie contas, aprove solicitações e gerencie perfis de acesso.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={() => { setUserEdit(null); setFormUserOpen(true) }}>
            <UserPlus className="mr-2 size-4" /> Novo usuário
          </Button>
          {/* ⬇️ Botão agora abre o Dialog de ESCOLHA */}
          <Button className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setEscolhaModoOpen(true)}>
            <Plus className="mr-2 size-4" /> Novo estagiário
          </Button>
        </div>
      </div>

      <Tabs value={aba} onValueChange={setAba}>
        <TabsList className="flex flex-wrap bg-white">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="estagiarios">Estagiários</TabsTrigger>
          <TabsTrigger value="supervisores">Supervisores</TabsTrigger>
          <TabsTrigger value="professores">Professores</TabsTrigger>
          <TabsTrigger value="assistentes">Assistentes</TabsTrigger>
          <TabsTrigger value="vice">Vice-Diretores</TabsTrigger>
          <TabsTrigger value="diretor">Diretor</TabsTrigger>
          <TabsTrigger value="pendentes">
            Pendentes
            {usuariosVisiveis.filter((u) => u.status === "pendente").length > 0 && (
              <Badge className="ml-1 h-4 border-none bg-amber-500 px-1 text-[10px] text-white">
                {usuariosVisiveis.filter((u) => u.status === "pendente").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={aba} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Buscar por nome ou e-mail..." value={busca}
                onChange={(e) => setBusca(e.target.value)} className="pl-8" />
            </div>
            <Badge variant="outline" className="bg-white text-sm">
              {totalRegistros} registro(s)
            </Badge>
          </div>

          {renderConteudo()}
        </TabsContent>
      </Tabs>

      {/* ─────── Dialogs ─────── */}

      {/* Dialog de ESCOLHA (individual vs em massa) */}
      <EscolhaModoEstagiario
        open={escolhaModoOpen}
        onOpenChange={setEscolhaModoOpen}
        onIndividual={() => {
          setEscolhaModoOpen(false)
          setEstEdit(null)
          setFormEstOpen(true)
        }}
        onLote={() => {
          setEscolhaModoOpen(false)
          setFormEstLoteOpen(true)
        }}
      />

      <FormularioUsuario open={formUserOpen} onOpenChange={setFormUserOpen} usuario={userEdit}
        onSubmit={(dados) => {
          if (userEdit) { atualizarUsuario(userEdit.id, dados); toast.success("Usuário atualizado") }
          else { criarUsuario(dados); toast.success("Usuário criado") }
        }} />

      {/* Formulário individual — recebe `cursos` para o dropdown */}
      <FormularioEstagiario
        open={formEstOpen}
        onOpenChange={setFormEstOpen}
        estagiario={estEdit}
        empresas={empresas}
        cursos={cursos}
        usuarios={usuarios}
        onSubmit={(dados) => {
          if (estEdit) { atualizarEstagiario(estEdit.id, dados); toast.success("Estagiário atualizado") }
          else { criarEstagiario(dados); toast.success("Estagiário cadastrado") }
        }}
      />

      {/* Formulário em massa */}
      <FormularioEstagiariosEmLote
        open={formEstLoteOpen}
        onOpenChange={setFormEstLoteOpen}
        cursos={cursos}
        empresas={empresas}
        usuarios={usuarios}
        onSubmit={(novos) => {
          criarEstagiariosEmLote(novos)
          toast.success(
            "Cadastro em massa concluído",
            `${novos.length} estagiário(s) cadastrado(s) com sucesso.`
          )
        }}
      />

      <DetalhesUsuario pessoa={detalhes} tipo={tipoDetalhes} open={!!detalhes}
        onOpenChange={(o) => !o && setDetalhes(null)}
        onVerAvaliacao={(p) => { setAvaliacao(p); setDetalhes(null) }} />

      <DialogoAvaliacaoSupervisor estagiario={avaliacao} open={!!avaliacao}
        onOpenChange={(o) => !o && setAvaliacao(null)} />

      <DialogoRelatorioFinal estagiario={relatorio} open={!!relatorio}
        onOpenChange={(o) => !o && setRelatorio(null)}
        onSalvar={(id, dados) => {
          atualizarEstagiario(id, { relatorioFinal: { ...estagiarioAtual(estagiarios, id).relatorioFinal, ...dados } })
          toast.success("Avaliação salva", "Parecer final registrado com sucesso.")
        }} />
    </div>
  )
}

/** Helper interno — pega o estagiário atual pelo id. */
function estagiarioAtual(lista, id) {
  return lista.find((e) => e.id === id) || {}
}

/* ─────────────── Tabela de usuários ─────────────── */
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

/* ─────────────── Tabela de estagiários ─────────────── */
function TabelaEstagiarios({ estagiarios, onVerDetalhes, onEditar, onVerAvaliacao, onVerRelatorio }) {
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-600">Estagiário</TableHead>
            <TableHead className="font-semibold text-slate-600">Curso</TableHead>
            <TableHead className="font-semibold text-slate-600">Empresa / Supervisor</TableHead>
            <TableHead className="font-semibold text-slate-600">Relatório</TableHead>
            <TableHead className="w-16 text-right font-semibold text-slate-600">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estagiarios.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-slate-500">
                Nenhum estagiário encontrado.
              </TableCell>
            </TableRow>
          )}
          {estagiarios.map((e) => {
            const rel = e.relatorioFinal
            const statusRel = !rel
              ? { label: "Não enviado", classe: "bg-slate-100 text-slate-600" }
              : rel.avaliacaoViceDiretor?.aprovado
              ? { label: "Aprovado", classe: "bg-emerald-100 text-emerald-800" }
              : rel.avaliacaoViceDiretor?.rejeitado
              ? { label: "Rejeitado", classe: "bg-red-100 text-red-800" }
              : { label: "Aguardando", classe: "bg-amber-100 text-amber-800" }

            return (
              <TableRow key={e.id} className="hover:bg-slate-50/70">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                      {e.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{e.nome}</p>
                      <p className="text-xs text-slate-500">Mat. {e.matricula}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-700">{e.curso}</TableCell>
                <TableCell>
                  <p className="text-xs text-slate-600">{e.empresa}</p>
                  <p className="text-xs text-slate-500">Sup. {e.supervisor}</p>
                </TableCell>
                <TableCell>
                  <Badge className={`border-none ${statusRel.classe}`}>{statusRel.label}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownAcoes
                    label={`Ações · ${e.nome}`}
                    items={[
                      { label: "Ver perfil completo", icon: Eye, onClick: () => onVerDetalhes(e) },
                      { label: "Editar informações", icon: Edit, onClick: () => onEditar(e) },
                      { separator: true },
                      {
                        label: "Ver relatório final do estágio",
                        icon: FileText,
                        onClick: () => onVerRelatorio?.(e),
                      },
                      {
                        label: e.avaliacaoSupervisor ? "Ver ficha do supervisor" : "Sem avaliação do supervisor",
                        icon: Star,
                        disabled: !e.avaliacaoSupervisor,
                        onClick: () => onVerAvaliacao?.(e),
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
  )
}