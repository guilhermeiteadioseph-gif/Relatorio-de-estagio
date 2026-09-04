import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileDown, CheckCircle, ArrowLeft, Send } from "lucide-react";

export default function AvaliacaoRelatorio({ aluno, onVoltar, onSalvar }) {
  // Estado local para os inputs do formulário
  const [nota, setNota] = useState(aluno.nota || "");
  const [feedback, setFeedback] = useState(aluno.feedback || "");

  const bloqueado = aluno.statusRelatorio === "Enviado ao Vice-Diretor";

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-2 -ml-4 text-slate-500" onClick={onVoltar}>
        <ArrowLeft size={16} className="mr-2" /> Voltar para a lista
      </Button>

      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xl">Avaliação: Relatório Final de Estágio</CardTitle>
          <p className="text-sm text-slate-500">Aluno: <span className="font-semibold text-slate-800">{aluno.nome}</span></p>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded">
                <FileDown size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">relatorio_final_abnt.pdf</p>
                <p className="text-xs text-slate-500">Enviado para análise preliminar do Orientador.</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Baixar PDF</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className="text-sm font-semibold text-slate-700">Nota Final (0 a 10)</label>
              <Input 
                type="number" 
                placeholder="Ex: 9.5" 
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                disabled={bloqueado}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-sm font-semibold text-slate-700">Comentários e Parecer Técnico</label>
              <Textarea 
                placeholder="Digite sua avaliação sobre o desenvolvimento do aluno..." 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={bloqueado}
                className="mt-1 h-32"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between bg-slate-50 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 flex items-center">
            {bloqueado 
              ? <><CheckCircle size={16} className="text-emerald-500 mr-2"/> Esta avaliação já foi enviada.</>
              : "Após avaliar, o documento será encaminhado ao Vice-Diretor."}
          </p>
          
          {!bloqueado && (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onSalvar(aluno.id, nota, feedback)}>
              <Send size={16} className="mr-2" /> Finalizar e Enviar
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}