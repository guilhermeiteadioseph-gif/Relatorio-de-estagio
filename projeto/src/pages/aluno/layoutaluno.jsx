import { useParams, Navigate } from "react-router"
import { Sidebar } from "@/components/Sidebar"

// Importação das abas
import PainelGeral from "./tabs/PainelGeral"
import Frequencias from "./tabs/Frequencias"
import Documentos from "./tabs/Documentos"
import Autoavaliacao from "./tabs/Autoavaliacao"

export default function StudentLayout() {
  // O React Router lê a URL (ex: /aluno/frequencias) e extrai a palavra "frequencias"
  const { tab } = useParams()

  // Função roteadora inteligente
  const renderTab = () => {
    switch (tab) {
      case "painel": return <PainelGeral />
      case "frequencias": return <Frequencias />
      case "documentos": return <Documentos />
      case "autoavaliacao": return <Autoavaliacao />
      case undefined: 
        // Se a pessoa acessar só "/aluno", redireciona para "/aluno/geral"
        return <Navigate to="/aluno/geral" replace />
      default:
        // Se a pessoa digitar uma URL louca (ex: /aluno/batata), manda pro geral
        return <Navigate to="/aluno/geral" replace />
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* A Sidebar agora recebe a aba atual da URL para acender o botão correto */}
      <Sidebar currentTab={tab || "painel"} />
      
      <main className="flex-1 overflow-y-auto p-8">
        {renderTab()}
      </main>
    </div>
  )
}