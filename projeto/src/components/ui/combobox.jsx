import { useEffect, useRef, useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

/**
 * Combobox — input com dropdown de sugestões.
 *
 * Comportamento:
 *   - Digitar filtra as opções em tempo real
 *   - Clicar numa opção preenche o campo
 *   - Fechar ao clicar fora
 *   - Botão "X" limpa o valor
 *   - Aceita valores "livres" (não precisa estar na lista)
 *
 * @param {Object}   props
 * @param {string}   props.value         - valor atual
 * @param {Function} props.onChange      - (novoValor) => void
 * @param {Array}    props.options       - [{ value, label }]
 * @param {string}   [props.placeholder]
 * @param {string}   [props.emptyMessage="Nenhum resultado"]
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.className]
 */
export function Combobox({
  value,
  onChange,
  options = [],
  placeholder = "Digite ou selecione…",
  emptyMessage = "Nenhum resultado",
  disabled = false,
  className,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  /* Fecha ao clicar fora */
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  /* Filtra as opções conforme o texto digitado */
  const filtrados = options.filter((o) =>
    !value || o.label.toLowerCase().includes(String(value).toLowerCase())
  )

  const limpar = (e) => {
    e.stopPropagation()
    onChange("")
    setOpen(false)
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-14"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={limpar}
              className="flex size-4 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Limpar"
            >
              <X className="size-3" />
            </button>
          )}
          <ChevronDown className="pointer-events-none size-4 text-slate-400" />
        </div>
      </div>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg ring-1 ring-slate-200/50">
          <div className="max-h-56 overflow-y-auto py-1">
            {filtrados.length === 0 ? (
              <p className="px-3 py-2 text-sm text-slate-500">{emptyMessage}</p>
            ) : (
              filtrados.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false) }}
                  className="block w-full px-3 py-1.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}