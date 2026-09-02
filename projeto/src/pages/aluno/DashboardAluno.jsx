import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFrequencia } from "../../contexts/FrequenciaContext";
import { Layout } from "../../components/Layout";
import UploadBox from "../../components/uploadbox";
import { Navigate, useParams } from "react-router";

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

  return (
    <div className="space-y-6">
      {/* Top info card */}
      <div className="bg-white border rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm text-slate-500">Empresa</div>
          <div className="font-semibold text-slate-800">TechSoft Solutions Ltda</div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-slate-500">Curso</div>
              <div className="font-medium">Técnico em Informática</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Período</div>
              <div className="font-medium">01/02/2025 — 30/11/2025</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Horas cumpridas</div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium">187/400h</div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '47%'}} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right text-sm text-slate-400">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">FREQ. REGISTRADAS</div>
            <div className="text-2xl font-bold">{frequencias.length}</div>
          </div>
          <div className="text-slate-300 text-2xl">📅</div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">APROVADAS</div>
            <div className="text-2xl font-bold">3</div>
          </div>
          <div className="text-2xl text-green-400">✅</div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">PENDENTES</div>
            <div className="text-2xl font-bold">2</div>
          </div>
          <div className="text-2xl text-orange-300">⏳</div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">RELATÓRIOS ENVIADOS</div>
            <div className="text-2xl font-bold">2</div>
          </div>
          <div className="text-2xl text-purple-300">📄</div>
        </div>
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

        <div className="divide-y">
          {frequencias.slice(0,5).map((f, idx) => (
            <div key={idx} className="py-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium">{formatDate(f.data)}</div>
                <div className="text-xs text-slate-500 mt-1">{f.horario || '08:00–12:00'} • {f.descricao?.slice(0,100) || '—'}</div>
              </div>

              <div className="flex-shrink-0">
                {/* status badge */}
                {f.status === 'aprovado' && <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Aprovado</span>}
                {f.status === 'pendente' && <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Pendente</span>}
                {!f.status && <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">—</span>}
              </div>
            </div>
          ))}

          {frequencias.length === 0 && (
            <div className="py-4 text-sm text-slate-500">Nenhuma frequência registrada ainda.</div>
          )}
        </div>
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