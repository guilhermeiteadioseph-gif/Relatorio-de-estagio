import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { UserPlus, Users } from "lucide-react"

/**
 * Dialog de escolha de modo de cadastro de estagiário.
 * Apresenta duas opções clicáveis (cards) para o usuário escolher entre:
 *   - Cadastro individual (ficha completa)
 *   - Cadastro em massa (várias linhas de uma vez)
 */
export default function EscolhaModoEstagiario({ open, onOpenChange, onIndividual, onLote }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo estagiário</DialogTitle>
          <DialogDescription>
            Escolha como deseja cadastrar. Use "em massa" para adicionar vários
            de uma vez — ideal para o início de período.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Opção 1 — Cadastro individual */}
          <button
            type="button"
            onClick={onIndividual}
            className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-300 hover:shadow-md focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:outline-none"
          >
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 transition group-hover:bg-blue-100">
              <UserPlus className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">
                Cadastro individual
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                Preencha a ficha completa de um único estagiário.
              </p>
            </div>
          </button>

          {/* Opção 2 — Cadastro em massa */}
          <button
            type="button"
            onClick={onLote}
            className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-violet-300 hover:shadow-md focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:outline-none"
          >
            <div className="flex size-12 items-center justify-center rounded-lg bg-violet-50 transition group-hover:bg-violet-100">
              <Users className="size-6 text-violet-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">
                Cadastro em massa
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                Adicione vários estagiários de uma vez (podem ser de cursos diferentes).
              </p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}