import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/sonner"
import { formatarDataHora } from "@/utils/datetime"
import { cn } from "@/lib/utils"
import {
  DateRangePicker,
  formatarRange,
  parseRange,
} from "@/components/ui/date-range-picker"
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  Lock,
  User,
  Hash,
  BookOpen,
  CalendarDays,
  Building2,
  Briefcase,
  Clock,
  Mail,
  Phone,
  School,
  PenLine,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Estrutura da ficha — extraída diretamente do PDF oficial           */
/* ------------------------------------------------------------------ */

const OPCOES = [
  { value: "otimo",        label: "Ótimo" },
  { value: "bom",          label: "Bom" },
  { value: "regular",      label: "Regular" },
  { value: "insuficiente", label: "Insuficiente" },
]

const ITENS_CONCEDENTE = [
  { id: "concedenteInfraestrutura", label: "1. Infraestrutura" },
  { id: "concedenteAtividades",     label: "2. Atividades exercidas" },
  { id: "concedenteOrganizacao",    label: "3. Organização" },
  { id: "concedenteSupervisao",     label: "4. Supervisão de estágio" },
]

const ITENS_ESTAGIARIO = [
  { id: "estagiarioAssiduidade",     label: "5. Assiduidade" },
  { id: "estagiarioPontualidade",    label: "6. Pontualidade" },
  { id: "estagiarioInteresse",       label: "7. Interesse pelo trabalho" },
  { id: "estagiarioOrganizacao",     label: "8. Organização" },
  { id: "estagiarioResponsabilidade",label: "9. Responsabilidade" },
  { id: "estagiarioPostura",         label: "10. Postura profissional" },
  { id: "estagiarioRelacionamento",  label: "11. Relacionamento" },
]

/**
 * Ficha de Avaliação de Desempenho do Estagiário.
 * Espelha exatamente o formulário oficial SURPROT/IF.
 */
export default function QuestionarioAvaliacao({ estagiario, onVoltar, onSalvar }) {
  const respondido = estagiario.questionario.status === "respondido"
  const respostasExistentes = estagiario.questionario.respostas || {}

  /* ---------------------------------------------------------------- */
  /*  Cabeçalho — dados pré-preenchidos (editáveis)                    */
  /* ---------------------------------------------------------------- */
  const [dados, setDados] = useState({
    concedente:       estagiario.empresa.nome,
    municipio:        estagiario.empresa.municipio || "",
    cnpj:             estagiario.empresa.cnpj,
    endereco:         estagiario.empresa.endereco,
    orientador:       estagiario.supervisor,
    orientadorFone:   estagiario.telefoneOrientador || "",
    orientadorEmail:  estagiario.emailOrientador || "",
    estagiarioNome:   estagiario.nome,
    curso:            estagiario.curso,
    estagiarioFone:   estagiario.telefone,
    estagiarioEmail:  estagiario.email,
    unidadeEscolar:   estagiario.unidadeEscolar || "CETEP Araci",
    // ⬇️ O período agora é um Date range, não mais string.
    //    Convertemos o texto salvo ("01/08/2026 - 30/11/2026") em Dates.
    periodo:          parseRange(estagiario.periodoEstagio),
    totalHoras:       `${estagiario.horasCumpridas}h de ${estagiario.horasTotais}h`,
  })

  const setDado = (campo, valor) =>
    setDados((prev) => ({ ...prev, [campo]: valor }))

  /* ---------------------------------------------------------------- */
  /*  Respostas                                                       */
  /* ---------------------------------------------------------------- */
  const [respostas, setRespostas] = useState({
    concedenteInfraestrutura: respostasExistentes.concedenteInfraestrutura || "",
    concedenteAtividades:     respostasExistentes.concedenteAtividades || "",
    concedenteOrganizacao:    respostasExistentes.concedenteOrganizacao || "",
    concedenteSupervisao:     respostasExistentes.concedenteSupervisao || "",
    concedenteFinal:          respostasExistentes.concedenteFinal || "",
    estagiarioAssiduidade:     respostasExistentes.estagiarioAssiduidade || "",
    estagiarioPontualidade:    respostasExistentes.estagiarioPontualidade || "",
    estagiarioInteresse:       respostasExistentes.estagiarioInteresse || "",
    estagiarioOrganizacao:     respostasExistentes.estagiarioOrganizacao || "",
    estagiarioResponsabilidade:respostasExistentes.estagiarioResponsabilidade || "",
    estagiarioPostura:         respostasExistentes.estagiarioPostura || "",
    estagiarioRelacionamento:  respostasExistentes.estagiarioRelacionamento || "",
    estagiarioFinal:           respostasExistentes.estagiarioFinal || "",
    observacoes:      respostasExistentes.observacoes || "",
    assinaturaNome:   respostasExistentes.assinaturaNome || estagiario.supervisor,
    assinaturaLocal:  respostasExistentes.assinaturaLocal || "",
    assinaturaData:   respostasExistentes.assinaturaData || "",
  })

  const setCampo = (campo, valor) =>
    setRespostas((prev) => ({ ...prev, [campo]: valor }))

  /* ---------------------------------------------------------------- */
  /*  Validação e envio                                                */
  /* ---------------------------------------------------------------- */
  const obrigatorios = [
    ...ITENS_CONCEDENTE.map((i) => i.id),
    "concedenteFinal",
    ...ITENS_ESTAGIARIO.map((i) => i.id),
    "estagiarioFinal",
  ]

  const handleEnviar = () => {
    const faltando = obrigatorios.filter((id) => !respostas[id])
    if (faltando.length > 0) {
      toast.warning(
        "Ficha incompleta",
        `Responda todos os ${obrigatorios.length} itens (faltam ${faltando.length}).`
      )
      return
    }

    // Formata o período (Date range) de volta para string antes de salvar.
    const payload = {
      ...respostas,
      periodoFormatado: formatarRange(dados.periodo),
    }

    onSalvar(estagiario.id, payload)
    toast.success(
      "Ficha enviada!",
      "A avaliação de desempenho foi registrada com sucesso."
    )
  }

  const respondidos = obrigatorios.filter((id) => respostas[id]).length
  const progresso = Math.round((respondidos / obrigatorios.length) * 100)
  const dataResposta = formatarDataHora(estagiario.questionario.respondidoEm)

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Voltar + status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="-ml-2 text-slate-500 hover:text-slate-800"
          onClick={onVoltar}
        >
          <ArrowLeft className="mr-2 size-4" /> Voltar para a lista
        </Button>

        {respondido && (
          <Badge className="gap-1 bg-emerald-500 px-3 py-1 text-white">
            <CheckCircle2 className="size-3.5" /> Enviado
            {dataResposta && ` em ${dataResposta}`}
          </Badge>
        )}
      </div>

      {/* ─────────────── CABEÇALHO ─────────────── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Avaliação de Desempenho do Estagiário
              </CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                SURPROT / IF — Ficha oficial. Os dados abaixo foram
                pré-preenchidos; ajuste se necessário.
              </p>
            </div>
            {respondido && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Lock className="size-3" /> Modo leitura
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Concedente */}
            <Campo
              label="Concedente"
              value={dados.concedente}
              onChange={(v) => setDado("concedente", v)}
              disabled={respondido}
              icon={Building2}
            />
            <Campo
              label="Município"
              value={dados.municipio}
              onChange={(v) => setDado("municipio", v)}
              disabled={respondido}
            />
            <Campo
              label="CNPJ"
              value={dados.cnpj}
              onChange={(v) => setDado("cnpj", v)}
              disabled={respondido}
            />
            <Campo
              label="Endereço"
              value={dados.endereco}
              onChange={(v) => setDado("endereco", v)}
              disabled={respondido}
            />

            <Separator className="sm:col-span-2" />

            {/* Orientador */}
            <Campo
              label="Orientador"
              value={dados.orientador}
              onChange={(v) => setDado("orientador", v)}
              disabled={respondido}
              icon={User}
            />
            <Campo
              label="Telefone (orientador)"
              value={dados.orientadorFone}
              onChange={(v) => setDado("orientadorFone", v)}
              disabled={respondido}
              icon={Phone}
            />
            <div className="sm:col-span-2">
              <Campo
                label="E-mail (orientador)"
                value={dados.orientadorEmail}
                onChange={(v) => setDado("orientadorEmail", v)}
                disabled={respondido}
                icon={Mail}
              />
            </div>

            <Separator className="sm:col-span-2" />

            {/* Estagiário */}
            <Campo
              label="Estagiário"
              value={dados.estagiarioNome}
              onChange={(v) => setDado("estagiarioNome", v)}
              disabled={respondido}
              icon={User}
            />
            <Campo
              label="Curso Técnico"
              value={dados.curso}
              onChange={(v) => setDado("curso", v)}
              disabled={respondido}
              icon={BookOpen}
            />
            <Campo
              label="Telefone (estagiário)"
              value={dados.estagiarioFone}
              onChange={(v) => setDado("estagiarioFone", v)}
              disabled={respondido}
              icon={Phone}
            />
            <Campo
              label="E-mail (estagiário)"
              value={dados.estagiarioEmail}
              onChange={(v) => setDado("estagiarioEmail", v)}
              disabled={respondido}
              icon={Mail}
            />
            <Campo
              label="Unidade Escolar"
              value={dados.unidadeEscolar}
              onChange={(v) => setDado("unidadeEscolar", v)}
              disabled={respondido}
              icon={School}
            />

            {/*
              ⬇️ Período do Estágio — agora com calendário popup.
              O componente renderiza um botão que abre um Popover com o
              CalendarRange. Ao selecionar início + fim, fecha automaticamente.
            */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <CalendarDays className="size-3.5 text-slate-400" />
                Período do Estágio
              </Label>
              <DateRangePicker
                value={dados.periodo}
                onChange={(range) => setDado("periodo", range)}
                disabled={respondido}
                placeholder="Selecione o período"
                comDropdowns          // ativa select de mês/ano no topo
              />
            </div>

            <div className="sm:col-span-2">
              <Campo
                label="Total de Horas Cumpridas"
                value={dados.totalHoras}
                onChange={(v) => setDado("totalHoras", v)}
                disabled={respondido}
                icon={Clock}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────── PROGRESSO ─────────────── */}
      <div className="flex items-center gap-3 px-1">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-500">
          {respondidos} / {obrigatorios.length} ({progresso}%)
        </span>
      </div>

      {/* ─────────────── BLOCO 1 ─────────────── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-semibold uppercase tracking-wide text-slate-800">
            Avaliação da Concedente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TabelaAvaliacao
            itens={ITENS_CONCEDENTE}
            respostas={respostas}
            onChange={setCampo}
            disabled={respondido}
            finalId="concedenteFinal"
            finalLabel="Avaliação Final"
          />
        </CardContent>
      </Card>

      {/* ─────────────── BLOCO 2 ─────────────── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-semibold uppercase tracking-wide text-slate-800">
            Aspectos a Serem Avaliados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TabelaAvaliacao
            itens={ITENS_ESTAGIARIO}
            respostas={respostas}
            onChange={setCampo}
            disabled={respondido}
            finalId="estagiarioFinal"
            finalLabel="Avaliação Final"
          />
        </CardContent>
      </Card>

      {/* ─────────────── OBSERVAÇÕES ─────────────── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-semibold uppercase tracking-wide text-slate-800">
            Observações
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <Textarea
            placeholder="Escreva comentários adicionais sobre o desempenho, sugestões, observações relevantes..."
            value={respostas.observacoes}
            onChange={(e) => setCampo("observacoes", e.target.value)}
            disabled={respondido}
            className="min-h-28 resize-none"
          />
        </CardContent>
      </Card>

      {/* ─────────────── ASSINATURA ─────────────── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold uppercase tracking-wide text-slate-800">
            <PenLine className="size-4 text-slate-500" />
            Orientador do Estágio
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo
              label="Nome"
              value={respostas.assinaturaNome}
              onChange={(v) => setCampo("assinaturaNome", v)}
              disabled={respondido}
              icon={User}
            />
          </div>
          <Campo
            label="Local"
            value={respostas.assinaturaLocal}
            onChange={(v) => setCampo("assinaturaLocal", v)}
            disabled={respondido}
            placeholder="Cidade/UF"
          />
          <Campo
            label="Data"
            type="date"
            value={respostas.assinaturaData}
            onChange={(v) => setCampo("assinaturaData", v)}
            disabled={respondido}
          />
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-between gap-3 rounded-b-xl border-t border-slate-100 bg-slate-50 p-5 sm:flex-row">
          {!respondido ? (
            <>
              <p className="text-center text-xs text-slate-500 sm:text-left">
                Após o envio, a ficha não poderá ser editada.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={onVoltar}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleEnviar}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="mr-2 size-4" /> Enviar Avaliação
                </Button>
              </div>
            </>
          ) : (
            <Alert variant="success" className="w-full">
              <CheckCircle2 />
              <AlertTitle>Ficha enviada</AlertTitle>
              <AlertDescription>
                Esta avaliação de desempenho já foi registrada
                {dataResposta && ` em ${dataResposta}`}.
              </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Subcomponentes                                                    */
/* ------------------------------------------------------------------ */

function Campo({ label, value, onChange, disabled, icon: Icon, type = "text", placeholder }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
        {Icon && <Icon className="size-3.5 text-slate-400" />}
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  )
}

function TabelaAvaliacao({ itens, respostas, onChange, disabled, finalId, finalLabel }) {
  const GRID = "grid grid-cols-[1fr_70px_70px_80px_100px] items-center"

  return (
    <div className="overflow-x-auto">
      <div className={cn(GRID, "min-w-[560px]")}>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Item
        </div>
        {OPCOES.map((o) => (
          <div
            key={o.value}
            className="border-b border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500"
          >
            {o.label}
          </div>
        ))}

        {itens.map((item) => (
          <LinhaAvaliacao
            key={item.id}
            label={item.label}
            itemId={item.id}
            value={respostas[item.id]}
            onChange={onChange}
            disabled={disabled}
            gridClass={GRID}
          />
        ))}

        <LinhaAvaliacao
          label={finalLabel}
          itemId={finalId}
          value={respostas[finalId]}
          onChange={onChange}
          disabled={disabled}
          gridClass={GRID}
          destaque
        />
      </div>
    </div>
  )
}

function LinhaAvaliacao({
  label,
  itemId,
  value,
  onChange,
  disabled,
  gridClass,
  destaque = false,
}) {
  return (
    <>
      <div
        className={cn(
          "px-4 py-2.5 text-sm",
          destaque
            ? "border-b border-slate-200 bg-slate-50 font-semibold text-slate-800"
            : "border-b border-slate-100 text-slate-700"
        )}
      >
        {label}
      </div>

      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(itemId, v)}
        disabled={disabled}
        className="contents"
      >
        {OPCOES.map((o) => (
          <div
            key={o.value}
            className={cn(
              "flex justify-center border-b py-2.5",
              destaque
                ? "border-slate-200 bg-slate-50"
                : "border-slate-100"
            )}
          >
            <RadioGroupItem
              value={o.value}
              aria-label={`${label} — ${o.label}`}
            />
          </div>
        ))}
      </RadioGroup>
    </>
  )
}