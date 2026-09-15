import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/sonner"

const TIPOS = [
  { value: "falta", label: "Falta" },
  { value: "atraso", label: "Atraso" },
  { value: "comportamento", label: "Comportamento" },
  { value: "desempenho", label: "Desempenho" },
  { value: "outro", label: "Outro" },
]

const GRAVIDADES = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
]

const SELECT_CLS =
  "h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-800 outline-none " +
  "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"

/**
 * Dialog para registrar uma ocorrência em um estagiário.
 * O assistente pode sinalizar faltas, atrasos, comportamento, etc.
 */
export default function DialogoOcorrencia({ estagiario, open, onOpenChange, onSalvar }) {
  const [form, setForm] = useState(() => vazio())

  function vazio() {
    return {
      tipo: "falta",
      gravidade: "media",
      data: new Date().toISOString().slice(0, 10),
      descricao: "",
    }
  }

  useEffect(() => {
    if (open) setForm(vazio())
  }, [open])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.descricao || form.descricao.trim().length < 10) {
      toast.warning(
        "Descrição curta",
        "Descreva a ocorrência com pelo menos 10 caracteres."
      )
      return
    }
    onSalvar?.(estagiario.id, form)
    toast.success("Ocorrência registrada", "O vice-diretor foi notificado.")
    onOpenChange(false)
  }

  if (!estagiario) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Registrar ocorrência</DialogTitle>
          <DialogDescription className="text-slate-500">
            {estagiario.nome} — Mat. {estagiario.matricula}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-slate-700">Tipo</Label>
            <select value={form.tipo} onChange={(e) => set("tipo", e.target.value)} className={SELECT_CLS}>
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-slate-700">Gravidade</Label>
            <select value={form.gravidade} onChange={(e) => set("gravidade", e.target.value)} className={SELECT_CLS}>
              {GRAVIDADES.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-slate-700">Data da ocorrência</Label>
            <Input type="date" value={form.data} onChange={(e) => set("data", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-slate-700">Descrição</Label>
            <Textarea
              value={form.descricao}
              onChange={(e) => set("descricao", e.target.value)}
              placeholder="Descreva o que aconteceu com detalhes (mínimo 10 caracteres)..."
              className="min-h-24 resize-none"
            />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              Registrar ocorrência
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}