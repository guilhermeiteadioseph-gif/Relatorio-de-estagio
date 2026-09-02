import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UploadBox } from "@/components/UploadBox" // Seu componente
import { DataTable } from "@/components/DataTable" // Seu componente

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
          <CardTitle className="text-lg">Enviar Documento</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadBox title="Anexe o PDF do documento" />
        </CardContent>
      </Card>

      {/* Documentos & Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentos & Relatório</CardTitle>
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