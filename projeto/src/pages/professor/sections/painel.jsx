// PainelGeral.jsx
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle, Send, ArrowLeft, AlertTriangle, User, Clock, Building2, Eye, RefreshCw, XCircle } from "lucide-react";

// ============================================================
// COMPONENTE DE AVALIAÇÃO (unificado, com validação inline)
// ============================================================
function AvaliacaoRelatorio({ aluno, onVoltar, onSalvar }) {
  const [nota, setNota] = useState(aluno.nota || "");
  const [feedback, setFeedback] = useState(aluno.feedback || "");
  const [statusAvaliacao, setStatusAvaliacao] = useState(aluno.statusRelatorio || "Pendente");
  
  // Estados de erro
  const [erroNota, setErroNota] = useState("");
  const [erroFeedback, setErroFeedback] = useState("");
  
  // Refs para scroll
  const notaRef = useRef(null);
  const feedbackRef = useRef(null);
  
  const isAprovado = statusAvaliacao === "Enviado ao Vice-Diretor";
  const isDevolvido = statusAvaliacao === "Devolvido para Correção";
  const bloqueado = isAprovado || isDevolvido;

  const handleAprovar = () => {
    // Limpa erros anteriores
    setErroNota("");
    setErroFeedback("");
    
    let hasError = false;
    if (!nota) {
      setErroNota("A nota é obrigatória.");
      hasError = true;
      notaRef.current?.focus();
    } else {
      const notaNum = parseFloat(nota);
      if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
        setErroNota("A nota deve ser um número entre 0 e 10.");
        hasError = true;
        notaRef.current?.focus();
      }
    }
    
    if (!feedback || feedback.length < 10) {
      setErroFeedback("Por favor, escreva um feedback com pelo menos 10 caracteres.");
      if (!hasError) {
        feedbackRef.current?.focus();
      }
      hasError = true;
    }
    
    if (hasError) {
      // Rola até o primeiro erro
      const firstError = notaRef.current || feedbackRef.current;
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Salvar
    onSalvar(aluno.id, nota, feedback, "Enviado ao Vice-Diretor");
    setStatusAvaliacao("Enviado ao Vice-Diretor");
  };

  const handleSolicitarAlteracao = () => {
    setErroNota("");
    setErroFeedback("");
    
    if (!feedback || feedback.length < 10) {
      setErroFeedback("Para solicitar alterações, explique o que o aluno precisa corrigir (mínimo 10 caracteres).");
      feedbackRef.current?.focus();
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onSalvar(aluno.id, nota, feedback, "Devolvido para Correção");
    setStatusAvaliacao("Devolvido para Correção");
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" className="-ml-4 text-slate-500 hover:text-slate-800" onClick={onVoltar}>
          <ArrowLeft size={16} className="mr-2" /> Voltar para a lista
        </Button>
        <div className="flex gap-2">
          {isAprovado && <Badge className="bg-emerald-500 text-white">Aprovado e Enviado</Badge>}
          {isDevolvido && <Badge className="bg-amber-500 text-white">Devolvido para Correção</Badge>}
          {!isAprovado && !isDevolvido && <Badge variant="outline" className="text-slate-500">Pendente</Badge>}
        </div>
      </div>

      <Card className="shadow-md border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-xl font-bold text-slate-800 mb-2">Avaliação: Relatório Final</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-800">Aluno:</span> {aluno.nome}</p>
            <p><span className="font-semibold text-slate-800">Curso:</span> {aluno.curso}</p>
            <p><span className="font-semibold text-slate-800">Empresa:</span> {aluno.empresa || "—"}</p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 space-y-8 bg-white">
          {/* Documento */}
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center">
              <FileText className="mr-2 text-blue-600" size={18} /> Arquivo Submetido
            </h3>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-medium text-slate-800">relatorio_final_abnt.pdf</p>
                  <p className="text-xs text-slate-500">PDF • {aluno.dataEnvio || "—"}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Download size={16} className="mr-2" /> Baixar
              </Button>
            </div>
          </div>

          <hr />

          {/* Formulário */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-800">Parecer Técnico</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="text-sm font-semibold text-slate-700 block mb-2">Nota (0–10)</label>
                <Input
                  ref={notaRef}
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Ex: 9.5"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  disabled={bloqueado}
                  className={`text-lg ${erroNota ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {erroNota && <p className="text-xs text-red-500 mt-1">{erroNota}</p>}
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-semibold text-slate-700 block mb-2">Comentários / Observações</label>
                <Textarea
                  ref={feedbackRef}
                  placeholder="Digite sua avaliação. Se solicitar alterações, explique o que o aluno deve corrigir..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={bloqueado}
                  className={`h-32 resize-none ${erroFeedback ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {erroFeedback && <p className="text-xs text-red-500 mt-1">{erroFeedback}</p>}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between rounded-b-xl gap-4">
          {!bloqueado ? (
            <>
              <p className="text-sm text-slate-500 text-center sm:text-left">
                Após aprovação, o documento será encaminhado ao vice-diretor.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" onClick={handleSolicitarAlteracao}>
                  <AlertTriangle size={16} className="mr-2" /> Solicitar Alterações
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAprovar}>
                  <CheckCircle size={16} className="mr-2" /> Aprovar e Enviar
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                {isAprovado ? (
                  <><CheckCircle className="text-emerald-500" size={18} /> Avaliação finalizada e enviada.</>
                ) : (
                  <><AlertTriangle className="text-amber-500" size={18} /> Relatório devolvido ao aluno.</>
                )}
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL: PainelGeral
// ============================================================
export default function PainelGeral() {
  // Dados mockados
  const [alunos, setAlunos] = useState([
    {
      id: 1,
      nome: "João Carlos Silva",
      curso: "Técnico em Informática",
      turma: "3º Ano A",
      empresa: "TechSoft Solutions Ltda",
      horas: "187/400h",
      dataEnvio: "15/10/2026",
      statusRelatorio: "Pendente", // Pendente, Enviado ao Vice-Diretor, Devolvido para Correção
      nota: "",
      feedback: "",
    },
    {
      id: 2,
      nome: "Maria Fernanda Santos",
      curso: "Técnico em Informática",
      turma: "3º Ano B",
      empresa: "Inovação Tech",
      horas: "400/400h",
      dataEnvio: "10/10/2026",
      statusRelatorio: "Enviado ao Vice-Diretor",
      nota: "9.5",
      feedback: "Excelente projeto final.",
    },
    {
      id: 3,
      nome: "Pedro Henrique Oliveira",
      curso: "Técnico em Informática",
      turma: "3º Ano A",
      empresa: "DataCloud",
      horas: "220/400h",
      dataEnvio: "12/10/2026",
      statusRelatorio: "Devolvido para Correção",
      nota: "",
      feedback: "Necessita ajustes na seção de metodologia.",
    },
    {
      id: 4,
      nome: "Ana Clara Souza",
      curso: "Técnico em Informática",
      turma: "3º Ano B",
      empresa: "Smart Sistemas",
      horas: "380/400h",
      dataEnvio: "18/10/2026",
      statusRelatorio: "Pendente",
      nota: "",
      feedback: "",
    },
  ]);

  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  const handleSelecionarAluno = (aluno) => {
    setAlunoSelecionado(aluno);
  };

  const handleSalvarAvaliacao = (id, nota, feedback, novoStatus) => {
    setAlunos(alunos.map(aluno => 
      aluno.id === id 
        ? { ...aluno, nota, feedback, statusRelatorio: novoStatus } 
        : aluno
    ));
    // Atualiza também o aluno selecionado
    setAlunoSelecionado(prev => prev && prev.id === id ? { ...prev, nota, feedback, statusRelatorio: novoStatus } : prev);
    alert("Avaliação salva com sucesso!");
  };

  // Se um aluno estiver selecionado, exibe a avaliação
  if (alunoSelecionado) {
    return (
      <AvaliacaoRelatorio
        aluno={alunoSelecionado}
        onVoltar={() => setAlunoSelecionado(null)}
        onSalvar={handleSalvarAvaliacao}
      />
    );
  }

  // Caso contrário, exibe a lista de alunos
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Meus Orientandos</h1>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {alunos.length} alunos
        </Badge>
      </div>

      {/* Grid de cards de alunos - estilo similar à imagem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alunos.map((aluno) => {
          // Determina o status do relatório para exibir badge
          let statusColor = "bg-slate-100 text-slate-700";
          let statusLabel = "Pendente";
          if (aluno.statusRelatorio === "Enviado ao Vice-Diretor") {
            statusColor = "bg-emerald-100 text-emerald-700";
            statusLabel = "Aprovado";
          } else if (aluno.statusRelatorio === "Devolvido para Correção") {
            statusColor = "bg-amber-100 text-amber-700";
            statusLabel = "Correção";
          }

          // Define o texto do botão de ação
          let botaoTexto = "Avaliar";
          let botaoAcao = () => handleSelecionarAluno(aluno);
          if (aluno.statusRelatorio === "Enviado ao Vice-Diretor") {
            botaoTexto = "Ver avaliação";
          } else if (aluno.statusRelatorio === "Devolvido para Correção") {
            botaoTexto = "Reavaliar";
          }

          // Para o caso de "Ver avaliação", pode abrir o modal com os dados, mas aqui vamos abrir a mesma tela de avaliação (somente leitura)
          // Mas como o componente AvaliacaoRelatorio bloqueia os campos quando status é Enviado ou Devolvido, já serve.
          // O botão "Ver avaliação" pode abrir a avaliação em modo leitura.
          // O botão "Reavaliar" também abre a avaliação.

          return (
            <Card key={aluno.id} className="hover:shadow-lg transition-shadow border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar com inicial */}
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl flex-shrink-0">
                    {aluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-slate-800 truncate">{aluno.nome}</p>
                    <p className="text-sm text-slate-500 truncate">{aluno.curso} • {aluno.turma}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building2 size={12} /> {aluno.empresa}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs font-normal">
                        <Clock size={12} className="mr-1" /> {aluno.horas}
                      </Badge>
                      <Badge className={`${statusColor} text-xs font-normal`}>
                        {statusLabel}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={botaoAcao}
                    variant={aluno.statusRelatorio === "Enviado ao Vice-Diretor" ? "outline" : "default"}
                    className={aluno.statusRelatorio === "Enviado ao Vice-Diretor" ? "text-blue-600 border-blue-200 hover:bg-blue-50" : ""}
                  >
                    {aluno.statusRelatorio === "Enviado ao Vice-Diretor" ? (
                      <Eye size={14} className="mr-1" />
                    ) : aluno.statusRelatorio === "Devolvido para Correção" ? (
                      <RefreshCw size={14} className="mr-1" />
                    ) : (
                      <FileText size={14} className="mr-1" />
                    )}
                    {botaoTexto}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}