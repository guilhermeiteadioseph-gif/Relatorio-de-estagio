import { useState } from "react"
import { useAssistente } from "../contexts/assistentecontext"

import CardsEstatisticas from "../components/cardestatisticas"
import TabelaEstagiarios from "../components/tabelaestagiarios"
import DetalhesEstagiario from "../components/detalhesestagiario"
import DialogoOcorrencia from "../components/dialogoocorrencia"

/* Reaproveitado do vice-diretor (mesmo componente) */
import DialogoFrequencias from "@/pages/vice-diretor/components/dialogofrequencias"

/**
 * Painel geral do assistente.
 *   - KPIs do topo
 *   - Tabela de estagiários com dropdown (detalhes, frequências, ocorrência)
 *   - Todos os dialogs controlados por estado local (sem navegação)
 */
export default function PainelAssistente() {
  const { estagiarios, registrarOcorrencia } = useAssistente()

  const [detalhes, setDetalhes] = useState(null)
  const [frequencias, setFrequencias] = useState(null)
  const [ocorrencia, setOcorrencia] = useState(null)

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Painel do Assistente</h1>
        <p className="text-sm text-slate-500">
          Acompanhe os estagiários e registre ocorrências quando necessário.
        </p>
      </div>

      {/* Cards de resumo */}
      <CardsEstatisticas estagiarios={estagiarios} />

      {/* Tabela */}
      <TabelaEstagiarios
        dados={estagiarios}
        onVerDetalhes={(e) => setDetalhes(e)}
        onVerFrequencias={(e) => setFrequencias(e)}
        onRegistrarOcorrencia={(e) => setOcorrencia(e)}
      />

      {/* Sheet lateral de detalhes */}
      <DetalhesEstagiario
        estagiario={detalhes}
        open={!!detalhes}
        onOpenChange={(o) => !o && setDetalhes(null)}
      />

      {/* Dialog de frequências (reaproveitado do vice) */}
      <DialogoFrequencias
        estagiario={frequencias}
        open={!!frequencias}
        onOpenChange={(o) => !o && setFrequencias(null)}
      />

      {/* Dialog de ocorrência */}
      <DialogoOcorrencia
        estagiario={ocorrencia}
        open={!!ocorrencia}
        onOpenChange={(o) => !o && setOcorrencia(null)}
        onSalvar={registrarOcorrencia}
      />
    </div>
  )
}