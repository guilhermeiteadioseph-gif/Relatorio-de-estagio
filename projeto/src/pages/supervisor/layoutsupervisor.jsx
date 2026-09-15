import { useParams, Navigate } from "react-router"
import { Layout } from "@/components/Layout"
import { Toaster } from "@/components/ui/sonner"
import { SupervisorDataProvider } from "./contexts/supervisorcontext"

// Abas
import PainelGeral from "./sections/painel"
import AvaliacoesPage from "./sections/avaliacoes"

export default function LayoutSupervisor() {
  const { tab } = useParams()

  const renderTab = () => {
    switch (tab ?? "painel") {
      case "painel":     return <PainelGeral />
    }
  }

  return (
    <SupervisorDataProvider>
      <Layout>
        {renderTab()}
        {/* Toaster global — disparado por qualquer componente filho */}
        <Toaster />
      </Layout>
    </SupervisorDataProvider>
  )
}