import { useState } from "react"
import { useNavigate } from "react-router"
import { useSupervisorData } from "../contexts/supervisorcontext"

import CardsEstatisticas from "../components/cardestatisticas"
import TabelaEstagiarios from "../components/tabelaestagiarios"
import DialogoFrequencias from "../components/dialogofrequencias"

/**
 * Painel principal do supervisor.
 *   - Resumo + tabela de estagiários
 *   - Dropdown em cada linha: "Ver Frequências" (abre Dialog) e "Avaliar Estágio"
 */
export default function PainelGeral() {
  const navigate = useNavigate()
  const { estagiarios } = useSupervisorData()

  /* Estado do Dialog de frequências */
  const [estagiarioFrequencias, setEstagiarioFrequencias] = useState(null)

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Meus Estagiários</h1>
        <p className="text-sm text-slate-500">
          Acompanhe a presença e o desempenho dos estagiários da sua empresa.
        </p>
      </div>

      {/* Cards de resumo */}
      <CardsEstatisticas estagiarios={estagiarios} />

      {/* Tabela */}
      <TabelaEstagiarios
        dados={estagiarios}
        onVerFrequencias={(e) => setEstagiarioFrequencias(e)}
        onAvaliar={(e) => navigate(`/supervisor/avaliacao?estagiario=${e.id}`)}
      />

      {/* Dialog de frequências */}
      <DialogoFrequencias
        estagiario={estagiarioFrequencias}
        open={!!estagiarioFrequencias}
        onOpenChange={(o) => !o && setEstagiarioFrequencias(null)}
      />
    </div>
  )
}