import { useParams, Navigate } from "react-router"
import { Layout } from "@/components/Layout"

// Importação das abas
import PainelGeral from "./sections/painelgeral"
import Frequencias from "./sections/frequencias"
import Relatorio from "./sections/relatorio"
import Autoavaliacao from "./sections/autoavaliacao"

export default function LayoutEstagiario() {
  const { tab } = useParams()

  const renderTab = () => {
    switch (tab ?? "painel") {
      case "painel": return <PainelGeral />
      case "frequencias": return <Frequencias />
      case "relatorio": return <Relatorio />
      case "autoavaliacao": return <Autoavaliacao />
      default:
        return <Navigate to="/aluno/painel" replace />
    }
  }

  return (
    <Layout>
      {renderTab()}
    </Layout>
  )
}