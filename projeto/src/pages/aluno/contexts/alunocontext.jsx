import { createContext, useContext, useState } from "react"
import { alunoMock } from "../data/alunomock"

const AlunoDataContext = createContext(null)

export function AlunoDataProvider({ children }) {
  const [dados, setDados] = useState(alunoMock)

  /* -------------------------------------------------------------- */
  /*  FREQUÊNCIAS                                                    */
  /* -------------------------------------------------------------- */

  /** Adiciona um novo registro de frequência. */
  const adicionarFrequencia = (registro) => {
    setDados((prev) => {
      const novoId = (prev.frequencias[prev.frequencias.length - 1]?.id || 0) + 1
      const nova = {
        id: novoId,
        ...registro,
      }

      // Recalcula horas cumpridas a partir das frequências
      const totalHoras = [...prev.frequencias, nova].reduce(
        (acc, f) => acc + calcularHoras(f.entrada, f.saida),
        0
      )

      return {
        ...prev,
        frequencias: [...prev.frequencias, nova],
        estagio: {
          ...prev.estagio,
          horasCumpridas: totalHoras,
        },
      }
    })
  }

  /* -------------------------------------------------------------- */
  /*  RELATÓRIO                                                      */
  /* -------------------------------------------------------------- */

  /** Envia o relatório (simula upload + muda status para "em-analise"). */
  const enviarRelatorio = (arquivoNome) => {
    setDados((prev) => ({
      ...prev,
      relatorio: {
        ...prev.relatorio,
        status: "em-analise",
        arquivoNome,
        dataEnvio: new Date().toISOString(),
        feedbackProfessor: null,
        dataFeedback: null,
      },
    }))
  }

  /* -------------------------------------------------------------- */
  /*  AUTOAVALIAÇÃO                                                  */
  /* -------------------------------------------------------------- */

  /** Salva as respostas da autoavaliação. */
  const salvarAutoavaliacao = (respostas) => {
    setDados((prev) => ({
      ...prev,
      autoavaliacao: {
        ...prev.autoavaliacao,
        status: "respondida",
        respondidaEm: new Date().toISOString(),
        respostas,
      },
    }))
  }

  /* -------------------------------------------------------------- */
  /*  HELPERS                                                        */
  /* -------------------------------------------------------------- */

  /** Calcula horas trabalhadas a partir de "HH:MM" de entrada/saída. */
  function calcularHoras(entrada, saida) {
    const [h1, m1] = entrada.split(":").map(Number)
    const [h2, m2] = saida.split(":").map(Number)
    return (h2 * 60 + m2 - (h1 * 60 + m1)) / 60
  }

  return (
    <AlunoDataContext.Provider
      value={{
        ...dados,
        adicionarFrequencia,
        enviarRelatorio,
        salvarAutoavaliacao,
      }}
    >
      {children}
    </AlunoDataContext.Provider>
  )
}

export function useAlunoData() {
  const ctx = useContext(AlunoDataContext)
  if (!ctx) {
    throw new Error("useAlunoData deve ser usado dentro de <AlunoDataProvider>")
  }
  return ctx
}