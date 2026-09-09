import { useParams, Navigate } from "react-router"
import { Layout } from "@/components/Layout"

// Importação das abas
import PainelGeral from "./sections/painel"
import AvaliacaoEstagiario from "./sections/avaliacaoestag"

export default function LayoutProfessor() {
  const { tab } = useParams()

  const renderTab = () => {
    switch (tab ?? "orientandos") {
      case "orientandos": return <PainelGeral />
      case "avaliacao-estagio": return <AvaliacaoEstagiario />
      case undefined: return <Navigate to="/professor/orientandos" replace />
    }
  }

  return (
    <Layout>
      {renderTab()}
    </Layout>
  )
}