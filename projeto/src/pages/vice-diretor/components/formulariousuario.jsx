import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/sonner"

const SELECT_CLS =
  "h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-800 outline-none " +
  "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"

export default function FormularioUsuario({ open, onOpenChange, usuario, onSubmit }) {
  const editando = !!usuario
  const [form, setForm] = useState(() => vazio())

  function vazio() {
    // ⬇️ CPF removido
    return { nome: "", email: "", telefone: "", role: "professor", status: "ativo" }
  }

  useEffect(() => {
    if (open) setForm(usuario ? { ...vazio(), ...usuario } : vazio())
  }, [open, usuario])

  const setCampo = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nome || !form.email) {
      toast.warning("Campos obrigatórios", "Preencha nome e e-mail.")
      return
    }
    onSubmit?.(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar usuário" : "Novo usuário"}</DialogTitle>
          <DialogDescription>
            {editando
              ? "Atualize os dados do usuário abaixo."
              : "Preencha os dados para criar uma nova conta."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Nome completo</Label>
            <Input value={form.nome} onChange={(e) => setCampo("nome", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>E-mail</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setCampo("email", e.target.value)}
            />
          </div>
          {/* ⬇️ Telefone passou a ocupar a linha inteira (CPF removido) */}
          <div className="sm:col-span-2">
            <Label>Telefone</Label>
            <Input
              value={form.telefone}
              onChange={(e) => setCampo("telefone", e.target.value)}
            />
          </div>
          <div>
            <Label>Perfil</Label>
            <select
              value={form.role}
              onChange={(e) => setCampo("role", e.target.value)}
              className={SELECT_CLS}
            >
              <option value="professor">Professor</option>
              <option value="supervisor">Supervisor</option>
              <option value="assistente">Assistente</option>
              <option value="vice_diretor">Vice-Diretor</option>
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) => setCampo("status", e.target.value)}
              className={SELECT_CLS}
            >
              <option value="ativo">Ativo</option>
              <option value="pendente">Pendente</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editando ? "Salvar alterações" : "Criar usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}