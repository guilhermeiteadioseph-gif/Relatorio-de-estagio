import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * RadioGroup — grupo de rádio acessível baseado em <input type="radio"> nativo.
 *
 * OBS.: o container NÃO tem layout próprio (display) — cada consumidor define
 * como quer dispor os itens (`flex`, `grid`, `contents`, etc.). Isso evita
 * conflitos de especificidade quando usamos `contents` para colocar os
 * radios diretamente dentro de um grid pai (ver questionarioavaliacao.jsx).
 *
 * Exemplo:
 *   <RadioGroup value={v} onValueChange={setV} className="flex gap-3">
 *     <label className="flex items-center gap-2">
 *       <RadioGroupItem value="bom" /> Bom
 *     </label>
 *   </RadioGroup>
 */
const RadioGroupContext = React.createContext(null)

function RadioGroup({ value, onValueChange, disabled, className, children, ...props }) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <div
        role="radiogroup"
        data-slot="radio-group"
        className={className}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

function RadioGroupItem({ value, id, className, disabled, ...props }) {
  const ctx = React.useContext(RadioGroupContext)
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const checked = ctx?.value === value
  const isDisabled = disabled ?? ctx?.disabled ?? false

  return (
    <input
      type="radio"
      data-slot="radio-group-item"
      id={inputId}
      value={value}
      checked={checked}
      disabled={isDisabled}
      onChange={() => ctx?.onValueChange?.(value)}
      className={cn(
        "size-4 shrink-0 cursor-pointer accent-blue-600",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }