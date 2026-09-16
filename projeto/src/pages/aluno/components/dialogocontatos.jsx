import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Phone,
  MessageCircle,
  Building2,
  MapPin,
  FileBadge,
  UserCog,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Gera o link do WhatsApp a partir de um telefone brasileiro. */
function linkWhatsapp(telefone) {
  const numero = String(telefone).replace(/\D/g, "")
  // Adiciona DDI 55 se ainda não tiver
  const comDdi = numero.startsWith("55") ? numero : `55${numero}`
  return `https://wa.me/${comDdi}`
}

/**
 * Dialog de Contatos e Empresa.
 *
 * Estrutura:
 *   1. Bloco da empresa (dados institucionais)
 *   2. Grid de cartões dos responsáveis (orientador, supervisor, vice-diretor)
 *
 * Cada cartão de responsável traz ações rápidas:
 *   - Enviar e-mail (mailto)
 *   - Ligar (tel)
 *   - WhatsApp (wa.me)
 */
export default function DialogoContatos({ open, onOpenChange, responsaveis, empresa }) {
  const lista = [
    responsaveis?.orientador,
    responsaveis?.supervisor,
    responsaveis?.viceDiretor,
  ].filter(Boolean)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="size-5 text-amber-600" />
            Contatos e Empresa
          </DialogTitle>
          <DialogDescription>
            Dados da empresa concedente e canais para falar com os
            responsáveis pelo estágio.
          </DialogDescription>
        </DialogHeader>

        {/* --------------------------------------------------------- */}
        {/*  Dados da empresa                                           */}
        {/* --------------------------------------------------------- */}
        {empresa && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Building2 className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {empresa.nome}
                </p>
                <p className="text-xs text-slate-500">
                  {empresa.municipio} • {empresa.uf}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
              <p className="flex items-center gap-1.5">
                <FileBadge className="size-3.5 shrink-0 text-slate-400" />
                <span className="truncate">CNPJ: {empresa.cnpj}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{empresa.endereco}</span>
              </p>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/*  Cartões dos responsáveis                                   */}
        {/* --------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {lista.map((r) => (
            <CartaoResponsavel key={r.email} responsavel={r} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ------------------------------------------------------------------ */
/*  Card de um responsável                                             */
/* ------------------------------------------------------------------ */
function CartaoResponsavel({ responsavel }) {
  const iniciais = responsavel.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {iniciais}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            {responsavel.nome}
          </p>
          <p className="truncate text-xs text-slate-500">
            {responsavel.cargo}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-600">
        <p className="flex items-center gap-1.5">
          <Mail className="size-3.5 shrink-0 text-slate-400" />
          <a
            href={`mailto:${responsavel.email}`}
            className="truncate hover:text-blue-600 hover:underline"
          >
            {responsavel.email}
          </a>
        </p>
        <p className="flex items-center gap-1.5">
          <Phone className="size-3.5 shrink-0 text-slate-400" />
          <span>{responsavel.telefone}</span>
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
          render={
            <a href={`mailto:${responsavel.email}`}>
              <Mail className="mr-1.5 size-3.5" /> E-mail
            </a>
          }
        />
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          onClick={() =>
            window.open(linkWhatsapp(responsavel.telefone), "_blank")
          }
        >
          <MessageCircle className="mr-1.5 size-3.5" /> WhatsApp
        </Button>
      </div>
    </div>
  )
}