import { useParams, Navigate } from "react-router"
import { Layout } from "@/components/Layout"

// Abas
import AvaliacaoEstagiario from "./components/avaliacaoestag"

// Toast global do painel do professor
import { Toaster } from "@/components/ui/sonner"

export default function LayoutSupervisor() {
  const { tab } = useParams()

  const renderTab = () => {
    switch (tab ?? "painel") {
      case "avaliacao": return <AvaliacaoEstagiario />
      default: return <Navigate to="/supervisor/painel" replace />
    }
  }

  return (
    <Layout>
      {renderTab()}
      {/* Toaster global — disparado por qualquer componente filho */}
      <Toaster />
    </Layout>
  )
}