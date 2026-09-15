import { useParams, Navigate } from "react-router"
import { Layout } from "@/components/Layout"
import { Toaster } from "@/components/ui/sonner"
import { AssistenteProvider } from "./contexts/assistentecontext"

import PainelAssistente from "./sections/painel"
import UsuariosAssistente from "./sections/usuarios"
import FrequenciasAssistente from "./sections/frequencias"

/** Layout do assistente — resolve a aba pela URL. */
export default function LayoutAssistente() {
  const { tab } = useParams()

  const renderTab = () => {
    switch (tab ?? "painel") {
      case "painel":      return <PainelAssistente />
      case "usuarios":    return <UsuariosAssistente />
      case "frequencias": return <FrequenciasAssistente />
      default:            return <Navigate to="/assistente/painel" replace />
    }
  }

  return (
    <AssistenteProvider>
      <Layout>
        {renderTab()}
        <Toaster />
      </Layout>
    </AssistenteProvider>
  )
}