import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"

export default function Autoavaliacao() {
  // Array com as perguntas (isso poderia vir do seu JSON de Mock Data no futuro)
  const perguntas = [
    { id: "q1", texto: "Cumpri rigorosamente os horários de entrada e saída no estágio." },
    { id: "q2", texto: "Consegui aplicar os conhecimentos técnicos do curso na prática." },
    { id: "q3", texto: "Mantive um bom relacionamento com a equipe e supervisores." },
    { id: "q4", texto: "Fui proativo(a) na resolução de problemas do dia a dia." }
  ]

  // Função que será chamada ao clicar em "Enviar"
  const handleSubmit = (e) => {
    e.preventDefault() // Evita que a página recarregue (comportamento padrão do HTML)
    console.log("Formulário enviado para o Vice-Diretor!")
    // Futuramente, aqui entrará a lógica de enviar para o Back-end
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Autoavaliação do Estagiário</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Questionário de Desempenho</CardTitle>
          <CardDescription>
            Responda com sinceridade. Estas informações serão avaliadas pela coordenação e vice-direção.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Formulário HTML padrão interceptado pelo React */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              {/* O .map() percorre a nossa lista e cria um Checkbox para cada pergunta */}
              {perguntas.map((pergunta) => (
                <div key={pergunta.id} className="flex flex-row items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <Checkbox id={pergunta.id} className="mt-1" />
                  <div className="space-y-1 leading-none">
                    <Label 
                      htmlFor={pergunta.id} 
                      className="text-sm font-medium leading-relaxed text-slate-700 cursor-pointer"
                    >
                      {pergunta.texto}
                    </Label>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="flex gap-2 bg-blue-600 hover:bg-blue-700">
                <Send size={16} /> Enviar Avaliação
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}