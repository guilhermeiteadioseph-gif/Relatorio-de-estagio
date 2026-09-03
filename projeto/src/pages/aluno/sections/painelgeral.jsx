import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { StatCard } from "@/components/StatCard"
import { StatusBadge } from "@/components/StatusBadge"
import { FileDown, Calendar, Clock, FileText } from "lucide-react"

export default function PainelGeral() {
  // MOCK: Dados temporários.
  const frequenciasMock = [
    { data: "01/09/2026", entrada: "08:00", saida: "12:00", atividade: "Reunião de Alinhamento" },
    { data: "02/09/2026", entrada: "08:00", saida: "14:00", atividade: "Desenvolvimento Front-end" }
  ];

  // 2. MOCK: Dados das Avaliações (Isso virá do JSON/Banco de dados depois)
  const avaliacoesMock = {
    orientador: {
      nome: "Prof. Roberto Silva",
      comentario: "Excelente desempenho e proatividade no setor.",
      dataAvaliacao: "15/08/2026"
    },
    supervisor: {
      nome: "Eng. Amanda Costa",
      comentario: "Cumpriu as metas estabelecidas no plano de estágio com excelência.",
      dataAvaliacao: "20/08/2026"
    },
    relatorioFinal: {
      status: "Aprovado",
      nota: 9.5
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Visão Geral do Estágio</h1>

      {/* 1. Card Superior: Informações do Aluno */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
          <div>
            <p className="text-sm text-slate-500">Empresa</p>
            <p className="font-semibold flex items-center gap-2">🏢 TechSoft Solutions</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Curso</p>
            <p className="font-semibold">Técnico em Informática</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Período</p>
            <p className="font-semibold">01/02/2025 — 30/11/2025</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 flex justify-between">
              Horas cumpridas <span>187/400h</span>
            </p>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-1">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '47%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Grid de StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="DIAS REGISTRADOS" value={frequenciasMock.length} icon={<Calendar />} />
        <StatCard title="HORAS CUMPRIDAS" value="187h" icon={<Clock />} />
        <StatCard title="DOCUMENTOS ENVIADOS" value={2} icon={<FileText />} />
      </div>

      {/* 3. Avaliações e Relatório Final */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Avaliação do Orientador</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 italic">{avaliacoesMock.orientador.comentario}</p>
              <p className="text-xs text-slate-400 mt-2">Avaliado por: {avaliacoesMock.orientador.nome}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Avaliação do Supervisor</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 italic">{avaliacoesMock.supervisor.comentario}</p>
              <p className="text-xs text-slate-400 mt-2">Avaliado por: {avaliacoesMock.supervisor.nome}</p>
            </CardContent>
          </Card>
        </div>

        {/* O Relatório Final mantém o StatusBadge, pois esse documento sim exige aprovação oficial */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg">Relatório Final</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-4">
            <StatusBadge status="Aprovado" />
            <p className="text-sm text-slate-600">Nota final: <span className="font-bold text-emerald-600">{avaliacoesMock.relatorioFinal.nota}</span></p>
            <Button variant="outline" className="w-full flex gap-2">
              <FileDown size={16} /> Ver/Baixar PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 4. Tabela de Frequências (Sem a coluna de status) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Frequências Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Lembre-se de ajustar as colunas do seu componente DataTable para não pedir "Status" aqui */}
          <DataTable data={frequenciasMock} />
        </CardContent>
      </Card>
    </div>
  )
}