import { useState } from "react"
import { useNavigate } from "react-router"
import { Bell, Mail, Info } from "lucide-react"
import { useNotifications } from "@/contexts/NotificationContext"
import { Button } from "@/components/ui/button"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { formatarDataHora } from "@/utils/datetime"
import { cn } from "@/lib/utils"

/** Ícone por tipo de notificação. */
const ICONES = {
  "confirmacao-frequencia": Mail,
}

export default function SinoNotificacoes() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const {
    notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas,
  } = useNotifications()

  const handleClick = (n) => {
    marcarComoLida(n.id)
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative"
            aria-label="Notificações"
          >
            <Bell className="size-4" />
            {naoLidas > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {naoLidas > 9 ? "9+" : naoLidas}
              </span>
            )}
          </Button>
        }
      />

      <PopoverContent align="end" sideOffset={8} className="w-96 p-0">
        {/* Cabeçalho do dropdown */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">Notificações</p>
            <p className="text-xs text-slate-500">
              {naoLidas > 0 ? `${naoLidas} não lida(s)` : "Tudo em ordem"}
            </p>
          </div>
          {naoLidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-700"
              onClick={marcarTodasComoLidas}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Lista */}
        <div className="max-h-96 overflow-y-auto">
          {notificacoes.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
              <Bell className="size-8 text-slate-300" />
              <p className="text-sm text-slate-500">
                Nenhuma notificação por aqui.
              </p>
            </div>
          ) : (
            notificacoes.map((n) => {
              const Icone = ICONES[n.tipo] || Info
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50",
                    !n.lida && "bg-blue-50/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      n.lida
                        ? "bg-slate-100 text-slate-400"
                        : "bg-blue-100 text-blue-600"
                    )}
                  >
                    <Icone className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm leading-tight",
                          n.lida
                            ? "font-medium text-slate-600"
                            : "font-semibold text-slate-800"
                        )}
                      >
                        {n.titulo}
                      </p>
                      {!n.lida && (
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                      {n.descricao}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatarDataHora(n.criadaEm)}
                      {n.emailEnviado && " • E-mail enviado"}
                    </p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}