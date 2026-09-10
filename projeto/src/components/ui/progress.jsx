import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Barra de progresso simples.
 * Recebe `value` (0-100) e exibe o preenchimento proporcional.
 */
function Progress({ value = 0, className, indicatorClassName, ...props }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0))

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 bg-primary transition-transform duration-500 ease-out",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </div>
  )
}

export { Progress }