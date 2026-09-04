import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TabelaAlunos({ dados, onSelecionarAluno }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meus Orientandos</h1>
          <p className="text-slate-500">Acompanhe o andamento e avalie os relatórios finais.</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1 bg-white">
          Total: {dados.length} aluno(s)
        </Badge>
      </div>

      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Nome do Aluno</th>
                <th className="px-6 py-4 font-semibold">Curso</th>
                <th className="px-6 py-4 font-semibold">Carga Horária</th>
                <th className="px-6 py-4 font-semibold">Status do Relatório Final</th>
                <th className="px-6 py-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dados.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                  <td className="px-6 py-4 font-medium text-slate-800">{aluno.nome}</td>
                  <td className="px-6 py-4 text-slate-600">{aluno.curso}</td>
                  <td className="px-6 py-4 text-slate-600">{aluno.horas}</td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={aluno.statusRelatorio === "Enviado ao Vice-Diretor" ? "default" : "secondary"}
                      className={aluno.statusRelatorio === "Enviado ao Vice-Diretor" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-100 text-amber-800"}
                    >
                      {aluno.statusRelatorio}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {aluno.statusRelatorio === "Pendente de Avaliação" ? (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onSelecionarAluno(aluno)}>
                        Avaliar Relatório
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="text-slate-500" onClick={() => onSelecionarAluno(aluno)}>
                        Ver Avaliação
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}