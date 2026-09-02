import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFrequencia } from "../../contexts/FrequenciaContext";
import { Layout } from "../../components/Layout";
import UploadBox from "../../components/uploadbox";
import { Navigate, useParams } from "react-router";
import { StatCard } from "../../components/statcard";
import { StatusBadge } from "../../components/statusbadge";
import DataTable from "../../components/datatable";

// Seções (podem ser funções separadas no mesmo arquivo)
function PainelSection() {
  const { user } = useAuth(); // Obtém o usuário logado do contexto de autenticação
  const { frequencias = [] } = useFrequencia();

  // helper para formatar data simples
  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch (e) {
      return iso;
    }
  };

  // normaliza possíveis valores de status vindos do backend/mocks
  const normalizeStatus = (s) => {
    if (!s) return '';
    const ss = String(s).toLowerCase();
    if (['aprovado', 'aprovada', 'concluído', 'concluido', 'presente'].includes(ss)) return 'Aprovado';
    if (['pendente', 'pending'].includes(ss)) return 'Pendente';
    if (['rejeitado', 'recusado', 'reprovado', 'ausente'].includes(ss)) return 'Rejeitado';
    // fallback: capitalize first
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
  };

  const aprovadasCount = frequencias.filter(f => normalizeStatus(f.status) === 'Aprovado').length;
  const pendentesCount = frequencias.filter(f => normalizeStatus(f.status) === 'Pendente').length;
  const relatoriosCount = (user && user.relatorios && user.relatorios.length) || 0;

  // mapeia frequências para o formato da tabela
  const recentRows = (frequencias || []).slice().reverse().slice(0,5).map(f => ({
    date: formatDate(f.data || f.date || f.createdAt || f.dateRegistro),
    time: f.horario || (f.horaEntrada && f.horaSaida ? `${f.horaEntrada}–${f.horaSaida}` : ''),
    desc: f.descricao || f.atividade || f.titulo || f.conteudo || '',
    rawStatus: f.status
  }));

  return (
    <div className="space-y-6">
      {/* Top info card */}
      <div className="bg-white border rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm text-slate-500">Empresa</div>
          <div className="font-semibold text-slate-800">{user?.empresa || user?.company || 'TechSoft Solutions Ltda'}</div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-slate-500">Curso</div>
              <div className="font-medium">{user?.curso || 'Técnico em Informática'}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Período</div>
              <div className="font-medium">{user?.periodo || '01/02/2025 — 30/11/2025'}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Horas cumpridas</div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium">{user?.horasCumpridas || '187'}/{user?.horasTotais || '400'}h</div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.round(((user?.horasCumpridas||187)/(user?.horasTotais||400))*100)}%`}} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right text-sm text-slate-400">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Stats row using StatCard component */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="FREQ. REGISTRADAS" value={frequencias.length} description="" />
        <StatCard title="APROVADAS" value={aprovadasCount} description="" />
        <StatCard title="PENDENTES" value={pendentesCount} description="" />
        <StatCard title="RELATÓRIOS ENVIADOS" value={relatoriosCount} description="" />
      </div>

      {/* Relatório Final card */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">Relatório Final</h3>
            <div className="mt-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-md p-3 flex items-center gap-3">
              <span className="text-lg">🔖</span>
              <div>
                <div className="text-sm">Aprovado com nota <span className="font-semibold">9,5</span></div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">✏️ Editar Relatório Final</button>
            <button className="bg-slate-100 text-slate-700 px-3 py-2 rounded-md text-sm">📤 Exportar PDF (CETEP)</button>
          </div>
        </div>
      </div>

      {/* Frequências Recentes */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Frequências Recentes</h4>
          <div className="flex items-center gap-3">
            <button className="text-sm text-slate-500">Ver todas →</button>
            <button className="bg-slate-100 text-slate-700 px-3 py-2 rounded-md text-sm">Exportar PDF</button>
          </div>
        </div>

        <DataTable
          columns={[
            { key: 'date', label: 'Data' },
            { key: 'time', label: 'Horário' },
            { key: 'desc', label: 'Descrição' },
            {
              key: 'status',
              label: 'Status',
              render: (_, row) => <StatusBadge status={normalizeStatus(row.rawStatus)} />
            }
          ]}
          data={recentRows}
          emptyMessage="Nenhuma frequência registrada ainda."
        />
      </div>
    </div>
  );
}

function FrequenciasSection() {
  return <div>Conteúdo de Frequências</div>;
}

function RelatoriosSection() {
  return <div>Conteúdo de Relatórios</div>;
}

function AutoavaliacaoSection() {
  return <div>Conteúdo de Autoavaliação</div>;
}

export function DashboardAluno() {
  const { frequencias, marcarFrequencia } = useFrequencia();
  const [justificativa, setJustificativa] = useState("");
  
  const { tab } = useParams(); // pega o parâmetro da URL

  const handleMarcarFrequencia = () => {
    marcarFrequencia(justificativa);
    setJustificativa("");
  };

  // Mapeia o valor da URL para o componente correspondente
  const renderTab = () => {
    switch (tab) {
      case "frequencias":
        return <FrequenciasSection />;
      case "documentos":
        return <RelatoriosSection />;
      case "autoavaliacao":
        return <AutoavaliacaoSection />;
      case "painel":
      case undefined:
        return <PainelSection />;
      default:
        // Se a aba não existir, redireciona para dashboard
        return <Navigate to="/aluno/painel" replace />;
    }
  };

  return (
    <Layout>
      {renderTab()}
    </Layout>
  );
}