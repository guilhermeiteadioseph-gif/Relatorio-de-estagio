import { createContext, useContext, useState } from "react"
import { usuariosMock, estagiariosMock, empresasMock, cursosMock } from "../data/mockdata"

const ViceDiretorContext = createContext(null)

export function ViceDiretorProvider({ children }) {
  const [usuarios, setUsuarios] = useState(usuariosMock)
  const [estagiarios, setEstagiarios] = useState(estagiariosMock)
  const [empresas, setEmpresas] = useState(empresasMock)
  const [cursos] = useState(cursosMock)

  /* ----------------------- USUÁRIOS ----------------------- */
  const criarUsuario = (novo) => {
    const id = `u${Date.now()}`
    setUsuarios((prev) => [
      ...prev,
      { ...novo, id, status: novo.status ?? "ativo", dataCadastro: new Date().toISOString(), criadoPor: "Vice-Diretor" },
    ])
  }

  const atualizarUsuario = (id, patch) =>
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))

  const aprovarSolicitacao = (id) =>
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: "ativo", dataCadastro: new Date().toISOString(), aprovadoPor: "Vice-Diretor", dataSolicitacao: undefined }
          : u
      )
    )

  const rejeitarSolicitacao = (id) =>
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "inativo", dataInativacao: new Date().toISOString() } : u))
    )

  const desativarUsuario = (id) =>
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: "inativo", dataInativacao: new Date().toISOString(), inativadoPor: "Vice-Diretor" } : u
      )
    )

  const ativarUsuario = (id) =>
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: "ativo", dataInativacao: undefined, inativadoPor: undefined, dataReativacao: new Date().toISOString() }
          : u
      )
    )

  const promoverViceDiretor = (id) =>
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, role: "vice_diretor", status: "ativo", dataPromocao: new Date().toISOString(), promovidoPor: "Vice-Diretor" }
          : u
      )
    )

  /** Passar o bastão — transfere funções e desativa o atual. */
  const passarBastao = (novoViceId, atualViceId) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === novoViceId) {
          return {
            ...u,
            role: "vice_diretor",
            status: "ativo",
            dataPromocao: new Date().toISOString(),
            promovidoPor: `Vice-diretor anterior (${atualViceId})`,
          }
        }
        if (u.id === atualViceId) {
          return {
            ...u,
            status: "inativo",
            dataInativacao: new Date().toISOString(),
            inativadoPor: `Transferência de funções para ${novoViceId}`,
          }
        }
        return u
      })
    )
  }

  /* ----------------------- ESTAGIÁRIOS ----------------------- */
  const criarEstagiario = (novo) => {
    const id = `e${Date.now()}`
    setEstagiarios((prev) => [
      ...prev,
      {
        ...novo,
        id,
        status: novo.status ?? "ativo",
        horasCumpridas: novo.horasCumpridas ?? 0,
        horasTotais: novo.horasTotais ?? 400,
        faltas: 0,
        frequencias: [],
        avaliacaoSupervisor: null,
        relatorioFinal: null,
      },
    ])
  }

  /**
   * Cadastro em massa — recebe um array de estagiários (já filtrados
   * como válidos pelo formulário). Cada um recebe um id único e os
   * valores-padrão (horas, faltas, avaliações, etc.).
   */
  const criarEstagiariosEmLote = (novos) => {
    const base = Date.now()
    setEstagiarios((prev) => [
      ...prev,
      ...novos.map((n, i) => ({
        ...n,
        id: `e${base}-${i}`,
        status: n.status ?? "ativo",
        horasCumpridas: 0,
        horasTotais: n.horasTotais ?? 400,
        faltas: 0,
        frequencias: [],
        avaliacaoSupervisor: null,
        relatorioFinal: null,
      })),
    ])
  }

  const atualizarEstagiario = (id, patch) =>
    setEstagiarios((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  /* ----------------------- EMPRESAS ----------------------- */
  const criarEmpresa = (nova) => {
    const id = `emp${Date.now()}`
    setEmpresas((prev) => [
      ...prev,
      { ...nova, id, status: nova.status ?? "pendente", dataCadastro: new Date().toISOString(), criadoPor: "Vice-Diretor" },
    ])
  }

  const atualizarEmpresa = (id, patch) =>
    setEmpresas((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  const aprovarEmpresa = (id) =>
    setEmpresas((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "ativa", aprovadoPor: "Vice-Diretor", dataAprovacao: new Date().toISOString() } : e))
    )

  const rejeitarEmpresa = (id) =>
    setEmpresas((prev) => prev.map((e) => (e.id === id ? { ...e, status: "inativa" } : e)))

  return (
    <ViceDiretorContext.Provider
      value={{
        usuarios, estagiarios, empresas, cursos,
        criarUsuario, atualizarUsuario, aprovarSolicitacao, rejeitarSolicitacao,
        desativarUsuario, ativarUsuario, promoverViceDiretor, passarBastao,
        criarEstagiario, criarEstagiariosEmLote, atualizarEstagiario,
        criarEmpresa, atualizarEmpresa, aprovarEmpresa, rejeitarEmpresa,
      }}
    >
      {children}
    </ViceDiretorContext.Provider>
  )
}

export function useViceDiretor() {
  const ctx = useContext(ViceDiretorContext)
  if (!ctx) throw new Error("useViceDiretor deve ser usado dentro de <ViceDiretorProvider>")
  return ctx
}