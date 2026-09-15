import { createContext, useContext, useState } from "react"
import { usuariosMock, estagiariosMock, cursosMock } from "../data/mockData"

const AssistenteContext = createContext(null)

/**
 * Provider do assistente.
 *
 * Diferenças chave em relação ao vice-diretor:
 *   - NÃO promove usuários
 *   - NÃO desativa contas
 *   - NÃO passa o bastão
 *   - PODE aprovar/rejeitar solicitações
 *   - PODE editar dados não-críticos
 *   - PODE registrar ocorrências
 */
export function AssistenteProvider({ children }) {
  const [usuarios, setUsuarios] = useState(usuariosMock)
  const [estagiarios, setEstagiarios] = useState(estagiariosMock)
  const [cursos] = useState(cursosMock)

  /* ----------------------- USUÁRIOS ----------------------- */
  const atualizarUsuario = (id, patch) =>
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))

  const aprovarSolicitacao = (id) =>
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: "ativo",
              dataCadastro: new Date().toISOString(),
              aprovadoPor: "Assistente",
              dataSolicitacao: undefined,
            }
          : u
      )
    )

  const rejeitarSolicitacao = (id) =>
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: "inativo", dataInativacao: new Date().toISOString() } : u
      )
    )

  /* ----------------------- ESTAGIÁRIOS ----------------------- */
  const atualizarEstagiario = (id, patch) =>
    setEstagiarios((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  /* ----------------------- OCORRÊNCIAS ----------------------- */
  /**
   * Registra uma ocorrência num estagiário.
   * @param {string} estagiarioId
   * @param {Object} ocorrencia - { tipo, gravidade, descricao, data }
   */
  const registrarOcorrencia = (estagiarioId, ocorrencia) => {
    setEstagiarios((prev) =>
      prev.map((e) =>
        e.id === estagiarioId
          ? {
              ...e,
              ocorrencias: [
                ...(e.ocorrencias || []),
                {
                  ...ocorrencia,
                  id: `oc_${Date.now()}`,
                  registradoEm: new Date().toISOString(),
                  registradoPor: "Assistente",
                },
              ],
            }
          : e
      )
    )
  }

  return (
    <AssistenteContext.Provider
      value={{
        usuarios, estagiarios, cursos,
        atualizarUsuario, aprovarSolicitacao, rejeitarSolicitacao,
        atualizarEstagiario, registrarOcorrencia,
      }}
    >
      {children}
    </AssistenteContext.Provider>
  )
}

export function useAssistente() {
  const ctx = useContext(AssistenteContext)
  if (!ctx) throw new Error("useAssistente deve ser usado dentro de <AssistenteProvider>")
  return ctx
}