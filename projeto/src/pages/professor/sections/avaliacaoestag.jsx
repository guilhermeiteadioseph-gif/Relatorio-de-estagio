import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle, Send, ArrowLeft, AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Componente de Avaliação de Desempenho do Estagiário
 * 
 * - Totalmente funcional sem backend (usa estados locais)
 * - Inclui dados mockados do aluno e perguntas
 * - Permite responder questionário, dar nota, enviar e resetar
 */
export default function AvaliacaoEstagiario() {
  // ----------------------------------------------------------------
  // DADOS MOCKADOS (simulam o que viria do banco)
  // ----------------------------------------------------------------
  const alunoMock = {
    nome: "João Carlos Silva",
    curso: "Técnico em Informática",
    empresa: "TechSoft Solutions Ltda",
    cargaHoraria: "400h concluídas",
    relatorioNome: "Relatorio_Final_JoaoCarlos_ABNT.pdf",
    dataEnvio: "15/10/2026",
  };

  const perguntasMock = [
    { id: "p1", texto: "1. Como você avalia a proatividade e iniciativa do estagiário para resolver problemas?" },
    { id: "p2", texto: "2. Qual o nível de relacionamento interpessoal e trabalho em equipe demonstrado?" },
    { id: "p3", texto: "3. Como o aluno aplicou os conhecimentos teóricos do curso na prática da empresa?" },
    { id: "p4", texto: "4. Avalie a qualidade da documentação e relatórios entregues." },
  ];

  const opcoesResposta = ["Insatisfatório", "Regular", "Bom", "Excelente"];

  // ----------------------------------------------------------------
  // ESTADOS DO COMPONENTE
  // ----------------------------------------------------------------
  // Dados do aluno (podem ser alterados futuramente via props)
  const [aluno] = useState(alunoMock);

  // Respostas do questionário (objeto { perguntaId: opcao })
  const [respostas, setRespostas] = useState({});

  // Nota e parecer
  const [nota, setNota] = useState("");
  const [parecer, setParecer] = useState("");

  // Status da avaliação: 'pendente' | 'enviado'
  const [status, setStatus] = useState("pendente");

  // Mensagem de feedback (exibe alerta ou toast)
  const [mensagem, setMensagem] = useState("");

  // ----------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------
  const handleResponder = (perguntaId, opcao) => {
    if (status === "enviado") {
      setMensagem("Avaliação já enviada. Não é possível alterar as respostas.");
      return;
    }
    setRespostas({ ...respostas, [perguntaId]: opcao });
    setMensagem("");
  };

  const handleEnviar = () => {
    // Validações
    const totalPerguntas = perguntasMock.length;
    const respondidas = Object.keys(respostas).length;

    if (respondidas < totalPerguntas) {
      setMensagem(`Por favor, responda todas as ${totalPerguntas} perguntas. (Faltam ${totalPerguntas - respondidas})`);
      return;
    }

    if (!nota) {
      setMensagem("Por favor, insira a nota final.");
      return;
    }

    // Valida nota (0 a 10)
    const notaNum = parseFloat(nota);
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
      setMensagem("A nota deve ser um número entre 0 e 10.");
      return;
    }

    // Simula envio para o vice-diretor
    setStatus("enviado");
    setMensagem("✅ Avaliação enviada com sucesso! O vice-diretor foi notificado.");
  };

  const handleReset = () => {
    setRespostas({});
    setNota("");
    setParecer("");
    setStatus("pendente");
    setMensagem("🔄 Estado resetado. Você pode refazer a avaliação.");
  };

  const handleBaixarPDF = () => {
    alert("Simulando download do PDF: " + aluno.relatorioNome);
  };

  const handleSolicitarCorrecao = () => {
    if (status === "enviado") {
      setMensagem("Não é possível solicitar correção após o envio.");
      return;
    }
    // Poderia abrir um modal ou campo extra – aqui apenas simulamos
    setMensagem("📝 Solicitação de correção registrada. O aluno será notificado.");
    // Opcional: você pode adicionar um campo para descrever a correção
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">
      
      {/* Cabeçalho com navegação e status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" className="text-slate-500 hover:text-slate-800">
          <ArrowLeft size={20} className="mr-2" /> Voltar para a lista
        </Button>
        <div className="flex items-center gap-3">
          {status === "enviado" && (
            <Badge className="bg-emerald-500 text-white py-1 px-3 flex items-center gap-1">
              <CheckCircle size={14} /> Avaliação Enviada ao Vice-Diretor
            </Badge>
          )}
          {status === "pendente" && (
            <Badge variant="outline" className="text-slate-500 border-slate-300 py-1 px-3">
              Pendente de Envio
            </Badge>
          )}
          {/* Botão de reset (visível apenas em desenvolvimento) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-slate-400 hover:text-slate-600"
            title="Resetar estado (apenas para testes)"
          >
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>

      {/* Card principal */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-white border-b border-slate-100 pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
            Avaliação de Desempenho do Estagiário
          </CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-800">Aluno:</span> {aluno.nome}</p>
            <p><span className="font-semibold text-slate-800">Curso:</span> {aluno.curso}</p>
            <p><span className="font-semibold text-slate-800">Empresa:</span> {aluno.empresa}</p>
            <p><span className="font-semibold text-slate-800">Carga Horária:</span> {aluno.cargaHoraria}</p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 space-y-10 bg-white">
          
          {/* Mensagem de feedback (alerta/info) */}
          {mensagem && (
            <div className={`p-3 rounded-lg text-sm ${
              mensagem.includes("✅") || mensagem.includes("sucesso")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : mensagem.includes("🔄")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              {mensagem}
            </div>
          )}

          {/* PASSO 1: Análise do Relatório em PDF */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center border-b pb-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
              Análise do Relatório Escrito
            </h3>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <FileText size={32} className="text-red-500" />
                <div>
                  <p className="font-medium text-slate-800">{aluno.relatorioNome}</p>
                  <p className="text-sm text-slate-500">Enviado em {aluno.dataEnvio} • Formato ABNT</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-600 border-amber-200 hover:bg-amber-50"
                  onClick={handleSolicitarCorrecao}
                  disabled={status === "enviado"}
                >
                  <AlertTriangle size={16} className="mr-2" /> Solicitar Correção
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={handleBaixarPDF}
                >
                  <Download size={16} className="mr-2" /> Baixar PDF
                </Button>
              </div>
            </div>
          </section>

          {/* PASSO 2: Questionário de Desempenho */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center border-b pb-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
              Questionário de Avaliação
            </h3>
            
            <div className="space-y-6">
              {perguntasMock.map((pergunta) => (
                <div key={pergunta.id} className="space-y-2">
                  <p className="text-sm font-medium text-slate-800">{pergunta.texto}</p>
                  <div className="flex flex-wrap gap-2">
                    {opcoesResposta.map((opcao) => (
                      <button
                        key={opcao}
                        type="button"
                        disabled={status === "enviado"}
                        onClick={() => handleResponder(pergunta.id, opcao)}
                        className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                          respostas[pergunta.id] === opcao 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {opcao}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-400">
                {Object.keys(respostas).length} de {perguntasMock.length} perguntas respondidas
              </p>
            </div>
          </section>

          {/* PASSO 3: Parecer Final e Nota */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center border-b pb-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">3</span>
              Parecer Final e Nota
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="text-sm font-semibold text-slate-700 block mb-2">Nota Final (0–10)</label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Ex: 9.5"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  disabled={status === "enviado"}
                  className="text-lg"
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-semibold text-slate-700 block mb-2">Parecer Técnico (opcional)</label>
                <Textarea
                  placeholder="Comentários adicionais sobre o desenvolvimento do estagiário..."
                  value={parecer}
                  onChange={(e) => setParecer(e.target.value)}
                  disabled={status === "enviado"}
                  className="h-24 resize-none"
                />
              </div>
            </div>
          </section>

        </CardContent>

        {/* Rodapé com ação principal */}
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end rounded-b-xl">
          {status === "pendente" ? (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={handleEnviar}
            >
              <Send size={18} className="mr-2" /> Salvar Avaliação e Enviar
            </Button>
          ) : (
            <div className="flex items-center gap-3 text-sm font-medium text-emerald-600">
              <CheckCircle size={20} />
              Avaliação concluída! O Vice-Diretor foi notificado.
              <Button variant="link" size="sm" onClick={handleReset} className="text-slate-400">
                <RotateCcw size={14} className="mr-1" /> Reavaliar
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}