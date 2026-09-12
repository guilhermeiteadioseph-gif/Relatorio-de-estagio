import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatarDataHora } from "@/utils/datetime"
import {
  Mail, Phone, UserCircle2, Building2, CalendarDays,
  Clock, GraduationCap, Star, AlertTriangle,
} from "lucide-react"

const ROLE_LABEL = {
  professor: "Professor",
  supervisor: "Supervisor",
  assistente: "Assistente",
  vice_diretor: "Vice-Diretor",
  estagiario: "Estagiário",
}

/**
 * Sheet de detalhes. Funciona para usuários comuns E estagiários.
 * Para estagiários exibe o bloco de avaliação do supervisor.
 */
export default function DetalhesUsuario({ pessoa, tipo = "usuario", open, onOpenChange, onVerAvaliacao }) {
  if (!pessoa) return null

  const isEstagiario = tipo === "estagiario"
  const percentual = isEstagiario
    ? Math.round((pessoa.horasCumpridas / pessoa.horasTotais) * 100)
    : 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-white p-0 sm:max-w-md">
        {/* Header fixo */}
        <SheetHeader className="shrink-0 border-b border-slate-200 bg-slate-50 p-5 pr-12">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {pessoa.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-base font-semibold text-slate-800">
                {pessoa.nome}
              </SheetTitle>
              <SheetDescription className="truncate text-xs text-slate-500">
                {isEstagiario ? pessoa.curso : ROLE_LABEL[pessoa.role]}
              </SheetDescription>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="border-none bg-slate-100 text-slate-700">
              {isEstagiario ? pessoa.matricula : ROLE_LABEL[pessoa.role]}
            </Badge>
            {pessoa.status === "ativo" && (
              <Badge className="border-none bg-emerald-100 text-emerald-800">Ativo</Badge>
            )}
            {pessoa.status === "pendente" && (
              <Badge className="border-none bg-amber-100 text-amber-800">Pendente</Badge>
            )}
            {pessoa.status === "inativo" && (
              <Badge className="border-none bg-slate-200 text-slate-600">Inativo</Badge>
            )}
          </div>
        </SheetHeader>

        {/* Corpo */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Contato */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contato
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-600">
                <Mail className="size-4 text-slate-400" />
                <a href={`mailto:${pessoa.email}`} className="truncate hover:text-blue-600 hover:underline">
                  {pessoa.email}
                </a>
              </li>
              {pessoa.telefone && (
                <li className="flex items-center gap-2 text-slate-600">
                  <Phone className="size-4 text-slate-400" />
                  <span>{pessoa.telefone}</span>
                </li>
              )}
            </ul>
          </section>

          <Separator />

          {/* Dados específicos */}
          {isEstagiario ? (
            <>
              <section>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Dados do Estágio
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Building2 className="size-4 text-slate-400" />
                    {pessoa.empresa}
                  </li>
                  <li className="flex items-center gap-2">
                    <UserCircle2 className="size-4 text-slate-400" />
                    Supervisor: {pessoa.supervisor}
                  </li>
                  <li className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-slate-400" />
                    {pessoa.periodoEstagio}
                  </li>
                </ul>

                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Clock className="size-3" />
                      {pessoa.horasCumpridas}h de {pessoa.horasTotais}h
                    </span>
                    <span className="text-slate-500">{percentual}%</span>
                  </div>
                  <Progress value={percentual} className="h-2" />
                  {pessoa.faltas > 0 && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                      <AlertTriangle className="size-3" />
                      {pessoa.faltas} falta{pessoa.faltas > 1 ? "s" : ""} registrada{pessoa.faltas > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </section>

              <Separator />

              {/* Avaliação do supervisor */}
              <section>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Avaliação do Supervisor
                </h4>
                {pessoa.avaliacaoSupervisor ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Star className="size-4 text-amber-500" />
                      <span className="text-sm font-semibold text-slate-800">
                        Conceito: {pessoa.avaliacaoSupervisor.conceitoGeral || pessoa.avaliacaoSupervisor.conceito}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                      {pessoa.avaliacaoSupervisor.respostas?.observacoes ||
                      pessoa.avaliacaoSupervisor.observacoes}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      Registrado em {formatarDataHora(pessoa.avaliacaoSupervisor.respondidoEm || pessoa.avaliacaoSupervisor.data)}
                    </p>
                    {onVerAvaliacao && (
                      <button
                        type="button"
                        onClick={() => onVerAvaliacao(pessoa)}
                        className="mt-3 w-full rounded-md border border-emerald-200 bg-white py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                      >
                        Ver ficha completa →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
                    <GraduationCap className="mx-auto mb-1 size-5 text-slate-400" />
                    Aguardando avaliação do supervisor
                  </div>
                )}
              </section>
            </>
          ) : (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Informações da Conta
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                {pessoa.empresa && (
                  <li className="flex items-center gap-2">
                    <Building2 className="size-4 text-slate-400" />
                    {pessoa.empresa}
                  </li>
                )}
                <li>
                  <span className="text-xs text-slate-400">Cadastrado em: </span>
                  {formatarDataHora(pessoa.dataCadastro)}
                </li>
                {pessoa.ultimoAcesso && (
                  <li>
                    <span className="text-xs text-slate-400">Último acesso: </span>
                    {formatarDataHora(pessoa.ultimoAcesso)}
                  </li>
                )}
                {pessoa.criadoPor && (
                  <li>
                    <span className="text-xs text-slate-400">Criado por: </span>
                    {pessoa.criadoPor}
                  </li>
                )}
                {pessoa.dataInativacao && (
                  <li className="text-red-600">
                    <span className="text-xs text-slate-400">Inativado em: </span>
                    {formatarDataHora(pessoa.dataInativacao)}
                  </li>
                )}
              </ul>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}