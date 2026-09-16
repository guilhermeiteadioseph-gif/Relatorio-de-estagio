import { useState } from "react"
import { useAlunoData } from "../contexts/alunocontext"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  GraduationCap,
  BookOpen,
  Hash,
  CalendarDays,
  Building2,
  Clock,
} from "lucide-react"

import CardsAtalho from "../components/cardsatalho"
import DialogoFrequencia from "../components/dialogofrequencia"
import DialogoRelatorio from "../components/dialogorelatorio"
import DialogoAutoavaliacao from "../components/dialogoautoavaliacao"
import DialogoContatos from "../components/dialogocontatos"

/**
 * Painel principal do estagiário.
 *
 * Estrutura:
 *   1. Card principal  → identificação + curso + empresa + progresso
 *   2. Cards de atalho → Registrar Frequência | Relatório | Autoavaliação | Contatos
 *   3. Dialogs         → abertos a partir dos cards
 */
export default function PainelAluno() {
  const {
    aluno,
    estagio,
    responsaveis,
    frequencias,
    relatorio,
    autoavaliacao,
    adicionarFrequencia,
    enviarRelatorio,
    salvarAutoavaliacao,
  } = useAlunoData()

  /* -------------------------------------------------------------- */
  /*  Estado dos dialogs                                             */
  /* -------------------------------------------------------------- */
  const [openFrequencia, setOpenFrequencia] = useState(false)
  const [openRelatorio, setOpenRelatorio] = useState(false)
  const [openAutoavaliacao, setOpenAutoavaliacao] = useState(false)
  const [openContatos, setOpenContatos] = useState(false)

  /* -------------------------------------------------------------- */
  /*  Progresso de carga horária                                     */
  /* -------------------------------------------------------------- */
  const percentual = Math.round(
    (estagio.horasCumpridas / estagio.horasTotais) * 100
  )

  /* Autoavaliação só é liberada quando o estágio é finalizado */
  const autoavaliacaoDisponivel =
    autoavaliacao.disponivel || estagio.status === "Finalizado"

  /* -------------------------------------------------------------- */
  /*  Render                                                         */
  /* -------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Olá, {aluno.nome.split(" ")[0]}!
        </h1>
        <p className="text-sm text-slate-500">
          Aqui está o resumo do seu estágio e as ações disponíveis.
        </p>
      </div>

      {/* ------------------------------------------- */}
      {/*  Card principal                              */}
      {/* ------------------------------------------- */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white">
              {aluno.nome
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>

            {/* Identificação */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-slate-800">
                {aluno.nome}
              </p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Hash className="size-3" /> Mat. {aluno.matricula}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="size-3" /> {aluno.curso}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="size-3" /> Ciclo {aluno.cicloMatricula}
                </span>
              </div>
            </div>

            {/* Status do estágio */}
            <Badge
              className={
                estagio.status === "Finalizado"
                  ? "bg-slate-100 text-slate-700 border-none"
                  : "bg-emerald-100 text-emerald-800 border-none"
              }
            >
              {estagio.status}
            </Badge>
          </div>

          {/* Infos adicionais */}
          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
            <InfoItem icon={Building2} label="Empresa" valor={estagio.empresa.nome} />
            <InfoItem
              icon={CalendarDays}
              label="Período do estágio"
              valor={estagio.periodo}
            />
            <InfoItem
              icon={Clock}
              label="Setor"
              valor={estagio.setor}
            />
          </div>

          {/* Barra de progresso */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Carga horária: {estagio.horasCumpridas}h de {estagio.horasTotais}h
              </span>
              <span className="text-slate-500">{percentual}%</span>
            </div>
            <Progress value={percentual} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------- */}
      {/*  Cards de atalho                             */}
      {/* ------------------------------------------- */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Ações Rápidas
        </h2>
        <CardsAtalho
          onAbrirFrequencia={() => setOpenFrequencia(true)}
          onAbrirRelatorio={() => setOpenRelatorio(true)}
          onAbrirAutoavaliacao={() => {
            if (!autoavaliacaoDisponivel) return
            setOpenAutoavaliacao(true)
          }}
          onAbrirContatos={() => setOpenContatos(true)}
          autoavaliacaoDisponivel={autoavaliacaoDisponivel}
          relatorioStatus={relatorio.status}
        />
      </div>

      {/* ------------------------------------------- */}
      {/*  Dialogs                                     */}
      {/* ------------------------------------------- */}
      <DialogoFrequencia
        open={openFrequencia}
        onOpenChange={setOpenFrequencia}
        frequencias={frequencias}
        onSalvar={adicionarFrequencia}
      />

      <DialogoRelatorio
        open={openRelatorio}
        onOpenChange={setOpenRelatorio}
        relatorio={relatorio}
        onEnviar={enviarRelatorio}
      />

      <DialogoAutoavaliacao
        open={openAutoavaliacao}
        onOpenChange={setOpenAutoavaliacao}
        disponivel={autoavaliacaoDisponivel}
        autoavaliacao={autoavaliacao}
        aluno={aluno}
        estagio={estagio}
        onSalvar={salvarAutoavaliacao}
      />

      <DialogoContatos
        open={openContatos}
        onOpenChange={setOpenContatos}
        responsaveis={responsaveis}
        empresa={estagio.empresa}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Subcomponente: linha de informação no card principal               */
/* ------------------------------------------------------------------ */
function InfoItem({ icon: Icon, label, valor }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="truncate text-sm text-slate-800">{valor || "—"}</p>
      </div>
    </div>
  )
}