"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react"

/* -------------------------------------------------------------------------- */
/*  Estado global dos toasts (fora do React para permitir chamadas simples)   */
/* -------------------------------------------------------------------------- */
let toasts = []
let uid = 0
const listeners = new Set()

function emit() {
  listeners.forEach((l) => l([...toasts]))
}

function remove(id) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

/**
 * Dispara um toast.
 * @param {Object} opts
 * @param {string} opts.title
 * @param {string} [opts.description]
 * @param {"default"|"success"|"error"|"warning"|"info"} [opts.variant]
 * @param {number} [opts.duration]  em ms; 0 = persistente
 */
export function toast({ title, description, variant = "default", duration = 4000 }) {
  const id = ++uid
  toasts = [...toasts, { id, title, description, variant }]
  emit()
  if (duration > 0) {
    setTimeout(() => remove(id), duration)
  }
  return id
}

toast.success = (title, description) => toast({ title, description, variant: "success" })
toast.error   = (title, description) => toast({ title, description, variant: "error" })
toast.warning = (title, description) => toast({ title, description, variant: "warning" })
toast.info    = (title, description) => toast({ title, description, variant: "info" })
toast.dismiss = remove

/* -------------------------------------------------------------------------- */
/*  Componente <Toaster /> que renderiza os toasts                            */
/* -------------------------------------------------------------------------- */
const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  default: Info,
}

const STYLES = {
  default: "border-slate-200 bg-white text-slate-800",
  success: "border-emerald-200 bg-white text-emerald-800",
  error:   "border-red-200 bg-white text-red-800",
  warning: "border-amber-200 bg-white text-amber-800",
  info:    "border-blue-200 bg-white text-blue-800",
}

const ICON_COLORS = {
  default: "text-slate-500",
  success: "text-emerald-500",
  error:   "text-red-500",
  warning: "text-amber-500",
  info:    "text-blue-500",
}

export function Toaster() {
  const [items, setItems] = React.useState([])

  React.useEffect(() => {
    listeners.add(setItems)
    return () => listeners.delete(setItems)
  }, [])

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {items.map((item) => {
        const Icon = ICONS[item.variant] ?? ICONS.default
        return (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-lg animate-in slide-in-from-top-2 fade-in",
              STYLES[item.variant]
            )}
          >
            <Icon className={cn("mt-0.5 size-4 shrink-0", ICON_COLORS[item.variant])} />
            <div className="flex-1 min-w-0">
              {item.title && (
                <p className="text-sm font-semibold leading-tight">{item.title}</p>
              )}
              {item.description && (
                <p className="mt-0.5 text-xs text-slate-500 leading-snug">
                  {item.description}
                </p>
              )}
            </div>
            <button
              onClick={() => remove(item.id)}
              className="text-slate-400 transition hover:text-slate-600"
              aria-label="Fechar"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}