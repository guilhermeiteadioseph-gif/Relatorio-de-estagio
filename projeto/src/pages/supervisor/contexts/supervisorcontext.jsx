import { createContext, useContext, useState } from "react"
import { estagiariosMock } from "../data/estagiariosmock"

const SupervisorDataContext = createContext(null)

export function SupervisorDataProvider({ children }) {
  const [estagiarios, setEstagiarios] = useState(estagiariosMock)

  /**
   * Marca o questionário de um estagiário como respondido
   * e guarda as respostas preenchidas.
   */
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

  return (
    <SupervisorDataContext.Provider
      value={{ estagiarios, marcarQuestionarioRespondido }}
    >
      {children}
    </SupervisorDataContext.Provider>
  )
}

export function useSupervisorData() {
  const ctx = useContext(SupervisorDataContext)
  if (!ctx) {
    throw new Error(
      "useSupervisorData deve ser usado dentro de <SupervisorDataProvider>"
    )
  }
  return ctx
}