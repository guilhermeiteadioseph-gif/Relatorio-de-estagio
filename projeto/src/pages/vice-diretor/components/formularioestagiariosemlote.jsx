import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"
import CamposEstagiario from "./camposestagiario"
import { Plus, Trash2, ChevronDown, ChevronRight, User } from "lucide-react"

/** Uma ficha vazia (mesma estrutura do form individual). */
function fichaVazia() {
  return {
    nome: "", matricula: "", rg: "",
    telefone: "", email: "",
    endereco: "", cidade: "",
    curso: "", turno: "Matutino",
    empresa: "", empresaCnpj: "", empresaEndereco: "",
    profissionalResponsavel: "",
    supervisor: "", periodoEstagio: "",
    turnoDias: "", dataInicio: "",
    horasTotais: 400,
    // Interno — controla se este card está expandido
    _expandido: true,
  }
}

/**
 * Cadastro de estagiários em massa com formulário completo.
 *
 * Cada estagiário é um card colapsável que contém TODOS os campos do
 * formulário individual. Ideal para o início de período, quando vários
 * alunos são cadastrados de uma vez — possivelmente em cursos/empresas
 * diferentes.
 */
export default function FormularioEstagiariosEmLote({
  open, onOpenChange, cursos = [], empresas = [], usuarios = [], onSubmit,
}) {
  const [fichas, setFichas] = useState([fichaVazia()])

  /* Sempre que o dialog abre, reseta para uma ficha vazia expandida. */
  useEffect(() => {
    if (open) setFichas([fichaVazia()])
  }, [open])

  /* Atualiza um campo específico de uma ficha. */
  const setCampo = (idx, campo, valor) =>
    setFichas((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [campo]: valor } : f))
    )

  /* Alterna expandir/colapsar uma ficha. */
  const toggleExpandido = (idx) =>
    setFichas((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, _expandido: !f._expandido } : f))
    )

  const addFicha = () =>
    setFichas((prev) => [...prev, fichaVazia()])

  const removeFicha = (idx) =>
    setFichas((prev) => prev.filter((_, i) => i !== idx))

  /* Uma ficha é válida se tiver nome + matrícula + curso. */
  const fichaValida = (f) => f.nome.trim() && f.matricula.trim() && f.curso.trim()

  const validas = fichas.filter(fichaValida)

  /* Remove o campo interno `_expandido` antes de enviar. */
  const limparPayload = (f) => {
    const { _expandido, ...rest } = f
    return rest
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validas.length === 0) {
      toast.warning(
        "Nenhuma ficha válida",
        "Preencha nome, matrícula e curso em pelo menos uma ficha."
      )
      return
    }
    onSubmit?.(validas.map(limparPayload))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Cadastrar estagiários em massa</DialogTitle>
          <DialogDescription>
            Cada ficha abaixo contém o formulário completo. Preencha apenas as
            que quiser cadastrar — as incompletas serão ignoradas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lista de fichas — scroll interno quando ficar grande */}
          <div className="max-h-[60vh] space-y-3 overflow-y-auto overflow-x-hidden pr-1">
            {fichas.map((ficha, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Cabeçalho do card — clicável para expandir/colapsar */}
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => toggleExpandido(idx)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    {ficha._expandido ? (
                      <ChevronDown className="size-4 shrink-0 text-slate-500" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 text-slate-500" />
                    )}
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
                      {ficha.nome
                        ? ficha.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)
                        : <User className="size-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {ficha.nome || `Estagiário ${idx + 1}`}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {ficha.curso || "Curso não definido"}
                        {ficha.matricula ? ` • Mat. ${ficha.matricula}` : ""}
                      </p>
                    </div>
                    {fichaValida(ficha) && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                        Válida
                      </span>
                    )}
                  </button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFicha(idx)}
                    disabled={fichas.length === 1}
                    className="text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                    aria-label="Remover ficha"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {/* Formulário completo — só renderiza quando expandido */}
                {ficha._expandido && (
                  <div className="space-y-6 p-4">
                    <CamposEstagiario
                      form={ficha}
                      set={(k, v) => setCampo(idx, k, v)}
                      empresas={empresas}
                      cursos={cursos}
                      usuarios={usuarios}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botão de adicionar nova ficha */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFicha}
            className="border-dashed border-slate-300 text-slate-600 hover:border-blue-300 hover:text-blue-600"
          >
            <Plus className="mr-1 size-4" /> Adicionar estagiário
          </Button>

          <DialogFooter>
            <span className="mr-auto text-xs text-slate-500">
              {validas.length} de {fichas.length} ficha(s) pronta(s) para cadastro
            </span>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Cadastrar {validas.length > 0 ? validas.length : ""} estagiário(s)
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}