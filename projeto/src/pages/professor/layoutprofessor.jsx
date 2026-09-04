import { useParams, Navigate } from "react-router"
import { Layout } from "@/components/Layout"

// Importação das abas
import PainelGeral from "./sections/painel"

export default function LayoutProfessor() {
  const { tab } = useParams()

  const renderTab = () => {
    switch (tab ?? "orientandos") {
      case "orientandos": return <PainelGeral />
      default:
        return <Navigate to="/professor/orientandos" replace />
    }
  }

  return (
    <Layout>
      {renderTab()}
    </Layout>
  )
}