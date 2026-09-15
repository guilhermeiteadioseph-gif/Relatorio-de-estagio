import { createContext, useContext, useState } from "react"
import { estagiariosMock } from "../data/estagiariosmock"
import { useNotifications } from "@/contexts/NotificationContext"

const SupervisorDataContext = createContext(null)

export function SupervisorDataProvider({ children }) {
  const [estagiarios, setEstagiarios] = useState(estagiariosMock)
  const { buscarPorEstagiario, marcarComoLida } = useNotifications()

  const marcarQuestionarioRespondido = (id, respostas) => {
    setEstagiarios((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              questionario: {
                status: "respondido",
                respondidoEm: new Date().toISOString(),
                respostas,
              },
            }
          : e
      )
    )
  }

  /**
   * Registra a confirmação do supervisor E marca a notificação
   * relacionada como lida (some do sino).
   */
  const confirmarFrequencias = (id, { status, observacoes }) => {
    setEstagiarios((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              confirmacaoSupervisor: {
                ...e.confirmacaoSupervisor,
                status,
                observacoes,
                confirmadoEm: new Date().toISOString(),
              },
            }
          : e
      )
    )

    const notif = buscarPorEstagiario(id)
    if (notif) marcarComoLida(notif.id)
  }

  return (
    <SupervisorDataContext.Provider
      value={{ estagiarios, marcarQuestionarioRespondido, confirmarFrequencias }}
    >
      {children}
    </SupervisorDataContext.Provider>
  )
}

export function useSupervisorData() {
  const ctx = useContext(SupervisorDataContext)
  if (!ctx) {
    throw new Error("useSupervisorData deve ser usado dentro de <SupervisorDataProvider>")
  }
  return ctx
}