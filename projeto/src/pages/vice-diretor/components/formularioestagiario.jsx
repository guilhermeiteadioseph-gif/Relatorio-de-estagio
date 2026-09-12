import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"
import CamposEstagiario from "./camposestagiario"

export default function FormularioEstagiario({
  open, onOpenChange, estagiario, empresas = [], cursos = [], usuarios = [], onSubmit,
}) {
  const editando = !!estagiario
  const [form, setForm] = useState(() => vazio())

  function vazio() {
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
    }
  }

  useEffect(() => {
    if (open) setForm(estagiario ? { ...vazio(), ...estagiario } : vazio())
  }, [open, estagiario])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nome || !form.matricula || !form.curso) {
      toast.warning("Campos obrigatórios", "Preencha nome, matrícula e curso.")
      return
    }
    onSubmit?.(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar estagiário" : "Novo estagiário"}</DialogTitle>
          <DialogDescription>
            Preencha os dados do estágio conforme a ficha oficial do CETEP.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}
          className="max-h-[65vh] space-y-6 overflow-y-auto overflow-x-hidden pr-1">
          <CamposEstagiario
            form={form}
            set={set}
            empresas={empresas}
            cursos={cursos}
            usuarios={usuarios}
          />

          <DialogFooter className="sticky bottom-0 -mx-6 -mb-6 bg-white px-6 pb-6 pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editando ? "Salvar alterações" : "Cadastrar estagiário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}