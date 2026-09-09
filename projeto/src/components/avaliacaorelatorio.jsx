import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle, AlertTriangle, Send, ArrowLeft, XCircle } from "lucide-react";

/**
 * Componente de Avaliação do Relatório Final
 * 
 * @param {Object} props
 * @param {Object} props.aluno - Dados do aluno (id, nome, curso, empresa, dataEnvio, statusRelatorio, nota?, feedback?)
 * @param {Function} props.onVoltar - Callback para voltar à lista
 * @param {Function} props.onSalvar - Callback para salvar a avaliação (recebe id, nota, feedback, novoStatus)
 * @param {Function} props.onReset - (opcional) Callback para resetar o status (apenas para testes)
 */
export default function AvaliacaoRelatorio({ aluno, onVoltar, onSalvar, onReset }) {
  // Estados locais para os campos do formulário
  const [nota, setNota] = useState(aluno.nota || "");
  const [feedback, setFeedback] = useState(aluno.feedback || "");

  // Determina se o formulário está bloqueado para edição
  const isAprovado = aluno.statusRelatorio === "Enviado ao Vice-Diretor";
  const isDevolvido = aluno.statusRelatorio === "Devolvido para Correção";
  const bloqueado = isAprovado || isDevolvido;

  // --- Handlers de ação ---

  const handleAprovar = () => {
    if (!nota) {
      alert("Por favor, insira uma nota antes de aprovar o relatório.");
      return;
    }
    // Se houver validação adicional de nota (ex: entre 0 e 10)
    const notaNum = parseFloat(nota);
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
      alert("A nota deve ser um número entre 0 e 10.");
      return;
    }
    // Chama o callback do pai com o novo status
    onSalvar(aluno.id, nota, feedback, "Enviado ao Vice-Diretor");
  };

  const handleSolicitarAlteracao = () => {
    if (feedback.length < 10) {
      alert("Para solicitar alterações, escreva um comentário explicando o que o aluno precisa corrigir (mínimo 10 caracteres).");
      return;
    }
    onSalvar(aluno.id, nota, feedback, "Devolvido para Correção");
  };

  // Função de reset (apenas para testes, pode ser removida)
  const handleReset = () => {
    if (onReset) {
      onReset(aluno.id);
    } else {
      // Fallback: se não houver onReset, apenas recarrega a página ou avisa
      alert("Função de reset não definida. Use onReset para controlar.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      
      {/* Cabeçalho com navegação e badges de status */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="-ml-4 text-slate-500 hover:text-slate-800" onClick={onVoltar}>
          <ArrowLeft size={16} className="mr-2" /> Voltar para a lista
        </Button>
        <div className="flex items-center gap-3">
          {isAprovado && (
            <Badge className="bg-emerald-500 text-white text-sm py-1 px-3 flex items-center gap-1">
              <CheckCircle size={14} /> Aprovado e Enviado ao Vice-Diretor
            </Badge>
          )}
          {isDevolvido && (
            <Badge className="bg-amber-500 text-white text-sm py-1 px-3 flex items-center gap-1">
              <AlertTriangle size={14} /> Devolvido para Correção
            </Badge>
          )}
          {/* Badge para pendente (caso o status seja 'pendente' ou vazio) */}
          {!isAprovado && !isDevolvido && (
            <Badge variant="outline" className="text-slate-500 border-slate-300 text-sm py-1 px-3">
              Pendente de Avaliação
            </Badge>
          )}
        </div>
      </div>

      <Card className="shadow-md border-slate-200">
        <CardHeader className="bg-white border-b border-slate-100 pb-6">
          <CardTitle className="text-xl font-bold text-slate-800 mb-2">
            Avaliação do Relatório Final
          </CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-800">Aluno:</span> {aluno.nome}</p>
            <p><span className="font-semibold text-slate-800">Curso:</span> {aluno.curso}</p>
            <p><span className="font-semibold text-slate-800">Local de Estágio:</span> {aluno.empresa || "—"}</p>
            <p><span className="font-semibold text-slate-800">Enviado em:</span> {aluno.dataEnvio || "—"}</p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 space-y-8 bg-white">
          
          {/* SEÇÃO 1: Documento anexado */}
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center">
              <FileText className="mr-2 text-blue-600" size={18} /> Arquivo Submetido
            </h3>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-medium text-slate-800">relatorio_final_abnt.pdf</p>
                  <p className="text-xs text-slate-500">Documento PDF • Formatado em ABNT</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Download size={16} className="mr-2" /> Baixar PDF
              </Button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SEÇÃO 2: Formulário de avaliação */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-800">Parecer Técnico do Orientador</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label htmlFor="nota" className="text-sm font-semibold text-slate-700 block mb-2">
                  Nota Final (0 a 10)
                </label>
                <Input
                  id="nota"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Ex: 9.5"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  disabled={bloqueado}
                  className="text-lg py-5"
                />
              </div>
              <div className="md:col-span-3">
                <label htmlFor="feedback" className="text-sm font-semibold text-slate-700 block mb-2">
                  Comentários / Observações
                </label>
                <Textarea
                  id="feedback"
                  placeholder="Digite sua avaliação. Se solicitar alterações, explique o que o aluno precisa corrigir..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={bloqueado}
                  className="h-32 resize-none"
                />
              </div>
            </div>
          </div>
        </CardContent>

        {/* SEÇÃO 3: Ações no rodapé */}
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between rounded-b-xl gap-4">
          
          {!bloqueado ? (
            <>
              <p className="text-sm text-slate-500 text-center sm:text-left">
                Após a aprovação, o documento será encaminhado ao vice-diretor.
              </p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                <Button
                  variant="outline"
                  className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                  onClick={handleSolicitarAlteracao}
                >
                  <AlertTriangle size={16} className="mr-2" /> Solicitar Alterações
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleAprovar}
                >
                  <CheckCircle size={16} className="mr-2" /> Aprovar e Enviar
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                {isAprovado ? (
                  <><CheckCircle className="text-emerald-500" size={18} /> Avaliação finalizada e enviada ao vice-diretor.</>
                ) : (
                  <><AlertTriangle className="text-amber-500" size={18} /> Relatório devolvido ao aluno para correções.</>
                )}
              </p>
              {/* Botão de reset (apenas para testes) – pode ser ocultado em produção */}
              {onReset && (
                <Button variant="link" size="sm" onClick={handleReset} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={14} className="mr-1" /> Resetar status
                </Button>
              )}
            </div>
          )}

        </CardFooter>
      </Card>
    </div>
  );
}