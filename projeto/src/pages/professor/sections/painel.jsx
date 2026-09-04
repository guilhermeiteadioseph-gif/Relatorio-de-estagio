import React, { useState } from 'react';
import TabelaAlunos from '@/components/tabelaalunos';
import AvaliacaoRelatorio from '@/components/avaliacaorelatorio';

export default function PainelGeral() {
  // ESTADO: Banco de dados simulado
  const [orientandos, setOrientandos] = useState([
    {
      id: 1,
      nome: "João Carlos Silva",
      curso: "Técnico em Informática",
      horas: "187/400h",
      statusRelatorio: "Pendente de Avaliação",
      nota: "",
      feedback: ""
    },
    {
      id: 2,
      nome: "Maria Fernanda Santos",
      curso: "Técnico em Informática",
      horas: "400/400h",
      statusRelatorio: "Enviado ao Vice-Diretor",
      nota: "9.5",
      feedback: "Excelente projeto final."
    }
  ]);

  // ESTADO: Aluno selecionado para avaliação
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  // Função para salvar a avaliação vinda do componente filho
  const handleSalvarAvaliacao = (id, nota, feedback) => {
    setOrientandos(orientandos.map(aluno => 
      aluno.id === id 
        ? { ...aluno, nota, feedback, statusRelatorio: "Enviado ao Vice-Diretor" } 
        : aluno
    ));
    setAlunoSelecionado(null); // Volta para a tabela
    alert("Avaliação enviada com sucesso!");
  };

  return (
    <div className="space-y-6">
      {!alunoSelecionado ? (
        <TabelaAlunos 
          dados={orientandos} 
          onSelecionarAluno={(aluno) => setAlunoSelecionado(aluno)} 
        />
      ) : (
        <AvaliacaoRelatorio 
          aluno={alunoSelecionado}
          onVoltar={() => setAlunoSelecionado(null)}
          onSalvar={handleSalvarAvaliacao}
        />
      )}
    </div>
  );
}