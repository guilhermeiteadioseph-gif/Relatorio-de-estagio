import { useState } from "react"
import { alunosMock } from "../data/alunosmock"
import { agoraFormatado } from "@/utils/datetime"

import CardsEstatisticas from "../components/cardestatisticas"
import TabelaAlunos from "../components/tabelaalunos"
import DetalhesAluno from "../components/detalhesaluno"
import AvaliacaoRelatorio from "../components/avaliacaorelatorio"

export default function PainelGeral() {
  const [alunos, setAlunos] = useState(alunosMock)
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [alunoDetalhe, setAlunoDetalhe] = useState(null)

  /**
   * Salva a avaliação do professor no estado local.
   * Registra automaticamente o timestamp do parecer em `dataAvaliacao`.
   */
  const handleSalvarAvaliacao = (id, nota, feedback, novoStatus) => {
    const dataAvaliacao = new Date().toISOString()

    const patch = { nota, feedback, statusRelatorio: novoStatus, dataAvaliacao }

    setAlunos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    )
    setAlunoSelecionado((prev) =>
      prev && prev.id === id ? { ...prev, ...patch } : prev
    )
  }

  if (alunoSelecionado) {
    return (
      <AvaliacaoRelatorio
        aluno={alunoSelecionado}
        onVoltar={() => setAlunoSelecionado(null)}
        onSalvar={handleSalvarAvaliacao}
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Meus Orientandos</h1>
        <p className="text-sm text-slate-500">
          Acompanhe o andamento do estágio e avalie os relatórios finais.
        </p>
      </div>

      <CardsEstatisticas alunos={alunos} />

      <TabelaAlunos
        dados={alunos}
        onVerDetalhes={(aluno) => setAlunoDetalhe(aluno)}
        onAvaliar={(aluno) => setAlunoSelecionado(aluno)}
      />

      <DetalhesAluno
        aluno={alunoDetalhe}
        open={!!alunoDetalhe}
        onOpenChange={(o) => !o && setAlunoDetalhe(null)}
        onAvaliar={(aluno) => setAlunoSelecionado(aluno)}
      />
    </div>
  )
}