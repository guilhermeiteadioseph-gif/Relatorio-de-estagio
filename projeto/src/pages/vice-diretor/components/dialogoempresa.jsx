import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Mail, Phone, MapPin, User, Hash, CalendarDays } from "lucide-react"
import { formatarDataHora } from "@/utils/datetime"

/** Dialog de visualização de empresa (somente leitura). */
export default function DialogoEmpresa({ empresa, open, onOpenChange, estagiarios = [], usuarios = [] }) {
  if (!empresa) return null

  const vinculos = [
    ...estagiarios.filter((e) => e.empresa === empresa.nome).map((e) => ({ tipo: "Estagiário", nome: e.nome })),
    ...usuarios.filter((u) => u.empresa === empresa.nome).map((u) => ({ tipo: "Supervisor", nome: u.nome })),
  ]

  const statusBadge = {
    ativa: { label: "Ativa", classe: "bg-emerald-100 text-emerald-800" },
    pendente: { label: "Pendente", classe: "bg-amber-100 text-amber-800" },
    inativa: { label: "Inativa", classe: "bg-slate-100 text-slate-600" },
  }[empresa.status] || { label: empresa.status, classe: "bg-slate-100 text-slate-700" }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="size-5 text-slate-400" />
            {empresa.nome}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge className={`${statusBadge.classe} border-none`}>{statusBadge.label}</Badge>
            <span>{empresa.segmento}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contato */}
          <section>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Contato</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <User className="size-4 text-slate-400" />
                {empresa.responsavel}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-slate-400" />
                <a href={`mailto:${empresa.email}`} className="hover:text-blue-600 hover:underline">
                  {empresa.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-slate-400" />
                {empresa.telefone}
              </li>
              <li className="flex items-center gap-2">
                <Hash className="size-4 text-slate-400" />
                CNPJ {empresa.cnpj}
              </li>
            </ul>
          </section>

          <Separator />

          {/* Endereço */}
          <section>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Endereço</h4>
            <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
              <div>
                <p>{empresa.endereco}</p>
                <p>{empresa.bairro} • {empresa.cidade}/{empresa.uf}</p>
                {empresa.cep && <p className="text-xs text-slate-500">CEP {empresa.cep}</p>}
              </div>
            </div>
          </section>

          <Separator />

          {/* Vínculos */}
          <section>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Vínculos ({vinculos.length})
            </h4>
            {vinculos.length === 0 && (
              <p className="text-sm text-slate-500">Nenhum vínculo registrado.</p>
            )}
            <ul className="space-y-1.5">
              {vinculos.map((v, i) => (
                <li key={i} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-1.5 text-sm">
                  <span className="text-slate-700">{v.nome}</span>
                  <Badge variant="outline" className="bg-white text-xs">{v.tipo}</Badge>
                </li>
              ))}
            </ul>
          </section>

          {/* Auditoria */}
          <section className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3" />
              Cadastrada em {formatarDataHora(empresa.dataCadastro)}
            </span>
            {empresa.aprovadoPor && (
              <span>Aprovada por {empresa.aprovadoPor}</span>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}