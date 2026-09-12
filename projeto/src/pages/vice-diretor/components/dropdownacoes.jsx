import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Dropdown genérico de ações.
 *
 * @param {Object} props
 * @param {string} [props.label="Ações"]           - Rótulo do cabeçalho do menu
 * @param {Array}  props.items                     - [{ label, icon: Icon, onClick, variant?, disabled? }]
 * @param {string} [props.className]
 */
export default function DropdownAcoes({ label = "Ações", items = [], className }) {
  if (items.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 outline-hidden data-[state=open]:bg-slate-100",
          className
        )}
        aria-label="Abrir ações"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4} className="w-56 bg-white">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {items.map((item, i) => {
          // Separador especial entre grupos (item com `separator: true`)
          if (item.separator) {
            return <DropdownMenuSeparator key={`sep-${i}`} />
          }
          const Icone = item.icon
          return (
            <DropdownMenuItem
              key={item.label}
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                "cursor-pointer gap-2",
                item.variant === "destructive" &&
                  "text-red-600 focus:bg-red-50 focus:text-red-700"
              )}
            >
              {Icone && (
                <Icone
                  className={cn(
                    "size-4",
                    item.variant === "destructive" ? "text-red-500" : "text-slate-500"
                  )}
                />
              )}
              <span>{item.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}