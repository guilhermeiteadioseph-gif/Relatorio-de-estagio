import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFrequencia } from "../../contexts/FrequenciaContext";
import { Layout } from "../../components/Layout";

export function DashboardAluno() {
  const { user } = useAuth();
  const { frequencias, marcarFrequencia } = useFrequencia();
  const [justificativa, setJustificativa] = useState("");
  
  const handleMarcarFrequencia = () => {
    marcarFrequencia(justificativa);
    setJustificativa("");
  };

  return (
    <Layout>
      {/* TODO: Conteúdo da página aqui */}
    </Layout>
  );
};