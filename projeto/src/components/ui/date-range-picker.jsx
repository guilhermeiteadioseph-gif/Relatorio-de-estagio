import { useEffect, useState } from "react"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/* ------------------------------------------------------------------ */
/*  Helpers de formatação                                              */
/* ------------------------------------------------------------------ */

/** Formata uma Date para "DD/MM/AAAA". */
export function formatarData(d) {
  if (!d) return ""
  const dia = String(d.getDate()).padStart(2, "0")
  const mes = String(d.getMonth() + 1).padStart(2, "0")
  return `${dia}/${mes}/${d.getFullYear()}`
}

/** Formata um range para "DD/MM/AAAA - DD/MM/AAAA". */
export function formatarRange(range) {
  if (!range?.from) return ""
  if (!range?.to) return formatarData(range.from)
  return `${formatarData(range.from)} - ${formatarData(range.to)}`
}

/** Converte "DD/MM/AAAA - DD/MM/AAAA" em { from, to } (Date | null). */
export function parseRange(str) {
  if (!str) return { from: null, to: null }
  const parse = (s) => {
    if (!s) return null
    const [d, m, y] = s.split("/").map(Number)
    if (!d || !m || !y) return null
    return new Date(y, m - 1, d)
  }
  const [a, b] = String(str).split(" - ")
  return { from: parse(a), to: parse(b) }
}

/* ------------------------------------------------------------------ */
/*  Componente principal                                               */
/* ------------------------------------------------------------------ */
/**
 * DateRangePicker com seleção progressiva EXPLÍCITA.
 *
 * Fluxo garantido (independente do que veio em `value`):
 *   1. Abre → mostra o período salvo como referência, mas nada "armado".
 *   2. 1º clique → SEMPRE inicia um novo range (a data clicada vira `from`).
 *                  Popover continua aberto.
 *   3. 2º clique → completa o range (`to`) e só AÍ fecha.
 *   4. "Limpar"  → zera sem fechar.
 *
 * Implementação: usamos `onDayClick` (dispara em qualquer clique de dia)
 * em vez de depender do `onSelect` do RDP, porque o RDP completa o range
 * sozinho quando já vê um `from` — o que travava a escolha da nova data
 * inicial. Aqui, a máquina de estados é toda nossa.
 *
 * @param {Object} props
 * @param {{from: Date|null, to: Date|null}} props.value
 * @param {(range: {from: Date|null, to: Date|null}) => void} props.onChange
 * @param {boolean} [props.disabled]
 * @param {string}  [props.placeholder]
 * @param {string}  [props.className]
 * @param {number}  [props.numberOfMonths=2]
 * @param {boolean} [props.comDropdowns=false]
 */
function DateRangePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Selecione o período",
  className,
  numberOfMonths = 2,
  comDropdowns = false,
}) {
  const [open, setOpen] = useState(false)
  const [mesVisivel, setMesVisivel] = useState(() => value?.from || new Date())

  /* Rascunho da edição em andamento.
     - `null`             → não estamos editando; mostra o `value` salvo.
     - `{from, to:null}`  → usuário já escolheu início; falta o fim.
     - `{from, to}`       → range completo (fecha e salva imediatamente). */
  const [rascunho, setRascunho] = useState(null)

  /* Reseta o rascunho sempre que o popover abre/fecha e ancora o mês. */
  useEffect(() => {
    if (open) {
      setRascunho(null)
      setMesVisivel(value?.from || new Date())
    } else {
      setRascunho(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  /* O que está visível no calendário:
     - Enquanto editamos, mostramos o rascunho.
     - Senão, mostramos o valor salvo (referência). */
  const visivel = rascunho ?? {
    from: value?.from || null,
    to: value?.to || null,
  }

  /* Formato aceito pelo RDP (undefined em vez de null). */
  const selected = {
    from: visivel.from || undefined,
    to: visivel.to || undefined,
  }

  /* ------------------------------------------------------------------ */
  /*  Máquina de estados do clique                                       */
  /* ------------------------------------------------------------------ */
  const handleDayClick = (day) => {
    // (A) Nada selecionado ainda OU range já completo → inicia novo range
    if (!rascunho || (rascunho.from && rascunho.to)) {
      setRascunho({ from: day, to: null })
      // Ancoramos o mês visível na data clicada (evita saltar de volta)
      setMesVisivel(day)
      return
    }

    // (B) Temos `from` mas falta `to` → completa o range
    if (rascunho.from && !rascunho.to) {
      const inicio = rascunho.from
      const fim = day

      // Se o usuário clicou ANTES do início, invertemos
      const from = fim < inicio ? fim : inicio
      const to = fim < inicio ? inicio : fim

      const novo = { from, to }
      setRascunho(novo)
      onChange?.(novo)
      setOpen(false) // ÚNICO ponto que fecha automaticamente
    }
  }

  /* Limpa a seleção sem fechar o popover. */
  const handleLimpar = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    setRascunho(null)
    onChange?.({ from: null, to: null })
  }

  /* ------------------------------------------------------------------ */
  /*  Textos                                                             */
  /* ------------------------------------------------------------------ */
  const vazio = !visivel.from
  const selecionando = !!visivel.from && !visivel.to

  const label = value?.from
    ? value?.to
      ? `${formatarData(value.from)} — ${formatarData(value.to)}`
      : formatarData(value.from)
    : placeholder

  const instrucao = vazio
    ? "Clique na data inicial"
    : selecionando
    ? `Início: ${formatarData(visivel.from)} • clique na data final`
    : "Período selecionado"

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-8 w-full justify-start gap-2 bg-transparent px-2.5 text-sm font-normal",
              !value?.from && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="size-4 shrink-0 text-slate-400" />
            <span className="truncate text-left">{label}</span>

            {/* Botão "X" inline para limpar rapidamente */}
            {value?.from && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleLimpar}
                onMouseDown={(e) => e.preventDefault()}
                className="ml-auto inline-flex size-4 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Limpar período"
              >
                <X className="size-3" />
              </span>
            )}
          </Button>
        }
      />

      <PopoverContent align="start" sideOffset={4} className="w-auto p-0">
        <Calendar
          mode="range"
          selected={selected}
          /* Ignoramos o `onSelect` do RDP para não deixá-lo "completar"
             o range por conta própria. Toda a lógica vai em onDayClick. */
          onSelect={() => {}}
          onDayClick={handleDayClick}
          month={mesVisivel}
          onMonthChange={setMesVisivel}
          numberOfMonths={numberOfMonths}
          locale={ptBR}
          captionLayout={comDropdowns ? "dropdown" : "label"}
          autoFocus
        />

        {/* Rodapé com instrução + limpar */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
          <span
            className={cn(
              "text-xs",
              vazio ? "text-slate-400" : "text-slate-600 dark:text-slate-300"
            )}
          >
            {instrucao}
          </span>

          {!vazio && (
            <button
              type="button"
              onClick={handleLimpar}
              className="text-xs font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              Limpar
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker }