import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/sonner"

/** Dialog de criar/editar empresa. */
export default function FormularioEmpresa({ open, onOpenChange, empresa, onSubmit }) {
  const editando = !!empresa
  const [form, setForm] = useState(() => vazio())

  function vazio() {
    return {
      nome: "",
      cnpj: "",
      email: "",
      telefone: "",
      responsavel: "",
      endereco: "",
      segmento: "",
      status: "pendente",
    }
  }

  useEffect(() => {
    if (open) setForm(empresa ? { ...vazio(), ...empresa } : vazio())
  }, [open, empresa])

  const setCampo = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nome || !form.cnpj) {
      toast.warning("Campos obrigatórios", "Preencha nome e CNPJ.")
      return
    }
    onSubmit?.(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar empresa" : "Nova empresa"}</DialogTitle>
          <DialogDescription>
            {editando
              ? "Atualize os dados da empresa parceira."
              : "Cadastre uma nova empresa concedente de estágio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Razão social</Label>
            <Input value={form.nome} onChange={(e) => setCampo("nome", e.target.value)} />
          </div>
          <div>
            <Label>CNPJ</Label>
            <Input value={form.cnpj} onChange={(e) => setCampo("cnpj", e.target.value)} />
          </div>
          <div>
            <Label>Segmento</Label>
            <Input value={form.segmento} onChange={(e) => setCampo("segmento", e.target.value)} />
          </div>
          <div>
            <Label>E-mail de contato</Label>
            <Input type="email" value={form.email} onChange={(e) => setCampo("email", e.target.value)} />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input value={form.telefone} onChange={(e) => setCampo("telefone", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Endereço completo</Label>
            <Input value={form.endereco} onChange={(e) => setCampo("endereco", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Responsável</Label>
            <Input value={form.responsavel} onChange={(e) => setCampo("responsavel", e.target.value)} />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editando ? "Salvar" : "Cadastrar empresa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}