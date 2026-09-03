import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import UploadBox from "@/components/uploadbox" 
import DataTable from "@/components/datatable"

export default function Frequencias() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho com botão de ação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Controle de Frequência</h1>
        <Button className="flex gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus size={16} /> Registrar Nova Frequência
        </Button>
      </div>

      {/* Área de Envio do Documento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Enviar Folha do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadBox title="Anexe o PDF assinado da sua frequência mensal" />
        </CardContent>
      </Card>

      {/* Histórico com a Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Registros</CardTitle>
          {/* Instrução visual para lembrar das colunas que você definiu */}
          <p className="text-sm text-slate-500">
            Colunas esperadas: Data | Atividade | Entrada | Saída | Status
          </p>
        </CardHeader>
        <CardContent>
          {/* O StatusBadge será embutido diretamente nas células desta DataTable no futuro */}
          <DataTable />
        </CardContent>
      </Card>
    </div>
  )
}