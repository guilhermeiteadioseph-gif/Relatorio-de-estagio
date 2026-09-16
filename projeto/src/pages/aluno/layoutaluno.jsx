import { useParams, Navigate } from "react-router"
import { Layout } from "@/components/Layout"
import { Toaster } from "@/components/ui/sonner"
import { AlunoDataProvider } from "./contexts/alunocontext"

// Seções
import PainelAluno from "./sections/painel"

/**
 * Layout do aluno.
 * Provê o contexto de dados (frequências, relatório, autoavaliação)
 * e roteia entre as abas via `useParams()`.
 *
 * Por ora, só temos a aba "painel". As demais entram no switch abaixo.
 */
export default function LayoutAluno() {
  const { tab } = useParams()

  const renderTab = () => {
    switch (tab ?? "painel") {
      case "painel":
        return <PainelAluno />
      default:
        return <Navigate to="/aluno/painel" replace />
    }
  }

  return (
    <AlunoDataProvider>
      <Layout>
        {renderTab()}
        <Toaster />
      </Layout>
    </AlunoDataProvider>
  )
}