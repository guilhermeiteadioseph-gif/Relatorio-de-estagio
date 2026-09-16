import { useParams, Navigate } from "react-router"
import { Layout } from "@/components/Layout"
import { Toaster } from "@/components/ui/sonner"
import { ViceDiretorProvider } from "./contexts/vicediretorcontext"

import PainelViceDiretor from "./sections/painel"
import UsuariosSection from "./sections/usuarios"
import EmpresasSection from "./sections/empresas"
import CursosSection from "./sections/cursos"
import FrequenciasSection from "./sections/frequencias"

export default function LayoutViceDiretor() {
  const { tab } = useParams()

  const renderTab = () => {
    switch (tab ?? "painel") {
      case "painel":                return <PainelViceDiretor />
      case "usuarios":              return <UsuariosSection />
      case "empresas":              return <EmpresasSection />
      case "cursos":                return <CursosSection />
      case "frequencias":           return <FrequenciasSection />
    }
  }

  return (
    <ViceDiretorProvider>
      <Layout>
        {renderTab()}
        <Toaster />
      </Layout>
    </ViceDiretorProvider>
  )
}