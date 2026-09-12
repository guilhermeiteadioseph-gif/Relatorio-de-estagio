import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Star, User, Building2, Clock, AlertTriangle } from "lucide-react"
import { formatarDataHora } from "@/utils/datetime"

/* Rótulos das respostas */
const LABEL_RESPOSTA = {
  otimo: "Ótimo", bom: "Bom", regular: "Regular", insuficiente: "Insuficiente",
}

const BLOCOS = [
  {
    titulo: "Avaliação da Concedente",
    itens: [
      { id: "concedenteInfraestrutura", label: "1. Infraestrutura" },
      { id: "concedenteAtividades", label: "2. Atividades exercidas" },
      { id: "concedenteOrganizacao", label: "3. Organização" },
      { id: "concedenteSupervisao", label: "4. Supervisão de estágio" },
      { id: "concedenteFinal", label: "Avaliação Final", destaque: true },
    ],
  },
  {
    titulo: "Aspectos do Estagiário",
    itens: [
      { id: "estagiarioAssiduidade", label: "5. Assiduidade" },
      { id: "estagiarioPontualidade", label: "6. Pontualidade" },
      { id: "estagiarioInteresse", label: "7. Interesse pelo trabalho" },
      { id: "estagiarioOrganizacao", label: "8. Organização" },
      { id: "estagiarioResponsabilidade", label: "9. Responsabilidade" },
      { id: "estagiarioPostura", label: "10. Postura profissional" },
      { id: "estagiarioRelacionamento", label: "11. Relacionamento" },
      { id: "estagiarioFinal", label: "Avaliação Final", destaque: true },
    ],
  },
]

/** Cor da Badge conforme a nota atribuída */
function corResposta(v) {
  switch (v) {
    case "otimo": return "bg-emerald-100 text-emerald-800"
    case "bom": return "bg-blue-100 text-blue-800"
    case "regular": return "bg-amber-100 text-amber-800"
    case "insuficiente": return "bg-red-100 text-red-800"
    default: return "bg-slate-100 text-slate-600"
  }
}

/** Visualização completa (somente leitura) da avaliação do supervisor. */
export default function DialogoAvaliacaoSupervisor({ estagiario, open, onOpenChange }) {
  if (!estagiario) return null

  const av = estagiario.avaliacaoSupervisor
  if (!av) return null

  const respostas = av.respostas || {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="size-5 text-amber-500" />
            Avaliação do Supervisor
          </DialogTitle>
          <DialogDescription>
            Ficha de Avaliação de Desempenho do Estagiário — SURPROT/IF
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
          {/* Cabeçalho: estagiário + empresa + supervisor */}
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2 text-slate-700">
                <User className="size-4 text-slate-400" />
                <span className="font-semibold">{estagiario.nome}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                Mat. {estagiario.matricula}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Building2 className="size-4 text-slate-400" />
                {estagiario.empresa}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Clock className="size-4 text-slate-400" />
                Supervisor: {estagiario.supervisor}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-xs text-slate-500">
                Avaliação registrada em {formatarDataHora(av.respondidoEm)}
              </span>
              <Badge className={`${corResposta(
                respostas.estagiarioFinal || respostas.concedenteFinal
              )} border-none`}>
                Conceito geral: {LABEL_RESPOSTA[av.conceitoGeral?.toLowerCase()] || av.conceitoGeral || "—"}
              </Badge>
            </div>
          </section>

          {/* Blocos de avaliação */}
          {BLOCOS.map((bloco) => (
            <section key={bloco.titulo}>
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                {bloco.titulo}
              </h4>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                {bloco.itens.map((item, i) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-4 py-2.5 ${
                      i !== bloco.itens.length - 1 ? "border-b border-slate-100" : ""
                    } ${item.destaque ? "bg-slate-50" : ""}`}
                  >
                    <span className={`text-sm ${item.destaque ? "font-semibold text-slate-800" : "text-slate-700"}`}>
                      {item.label}
                    </span>
                    <Badge className={`${corResposta(respostas[item.id])} border-none text-xs`}>
                      {LABEL_RESPOSTA[respostas[item.id]] || "—"}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <Separator />

          {/* Observações */}
          <section>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-500">
              Observações do Supervisor
            </h4>
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              {respostas.observacoes || "Sem observações registradas."}
            </p>
          </section>

          {/* Assinatura */}
          <section className="rounded-lg border border-slate-200 p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Assinatura
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
              <p><span className="text-xs text-slate-400">Nome: </span>{respostas.assinaturaNome || "—"}</p>
              <p><span className="text-xs text-slate-400">Local: </span>{respostas.assinaturaLocal || "—"}</p>
              <p><span className="text-xs text-slate-400">Data: </span>{respostas.assinaturaData || "—"}</p>
            </div>
          </section>

          {/* Alerta útil para o vice-diretor */}
          <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              Use estas informações como base para a sua avaliação final do estágio.
              O parecer do supervisor não substitui a avaliação do vice-diretor.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}