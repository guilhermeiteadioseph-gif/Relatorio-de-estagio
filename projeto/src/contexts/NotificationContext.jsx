import {
  createContext, useCallback, useContext, useMemo, useState,
} from "react"
import { useAuth } from "./AuthContext"
import { notificacaoService, emailService } from "@/services/notificacoes"
import { toast } from "@/components/ui/sonner"

/* ------------------------------------------------------------------ */
/*  Seed de mock — simula notificações já criadas pelo backend        */
/* ------------------------------------------------------------------ */
const SEED = [
  {
    id: "n_seed_1",
    usuarioId: "u1", // Ricardo Almeida (supervisor)
    tipo: "confirmacao-frequencia",
    estagiarioId: 4,
    titulo: "Confirmação de frequência pendente",
    descricao: "Ana Clara Souza concluiu 400h de estágio. Confirme as horas.",
    link: "/supervisor/painel?estagiario=4&acao=confirmar",
    lida: false,
    criadaEm: "2026-07-01T08:00:00",
    emailEnviado: true,
    emailEnviadoEm: "2026-07-01T08:00:05",
  },
]

const Ctx = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notificacoes, setNotificacoes] = useState(SEED)

  /* Filtra por usuário logado. Sem id, mostra tudo (útil em dev). */
  const minhas = useMemo(() => {
    if (!user?.id) return notificacoes
    return notificacoes.filter(
      (n) => !n.usuarioId || n.usuarioId === user.id
    )
  }, [notificacoes, user])

  const naoLidas = useMemo(
    () => minhas.filter((n) => !n.lida).length,
    [minhas]
  )

  /** Cria notificação (e opcionalmente envia e-mail). */
  const criar = useCallback(async (payload) => {
    const criada = await notificacaoService.criar(payload)
    setNotificacoes((prev) => [criada, ...prev])

    if (payload.enviarEmail && payload.email) {
      try {
        await emailService.enviar(payload.email)
        setNotificacoes((prev) =>
          prev.map((n) =>
            n.id === criada.id
              ? { ...n, emailEnviado: true, emailEnviadoEm: new Date().toISOString() }
              : n
          )
        )
      } catch (e) {
        toast.error("Falha ao enviar e-mail", e.message)
      }
    }
    return criada
  }, [])

  const marcarComoLida = useCallback((id) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    )
    notificacaoService.marcarComoLida(id).catch(() => {})
  }, [])

  const marcarTodasComoLidas = useCallback(() => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })))
  }, [])

  const remover = useCallback((id) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  /** Busca a notificação de confirmação pendente de um estagiário. */
  const buscarPorEstagiario = useCallback(
    (estagiarioId) =>
      minhas.find(
        (n) =>
          n.tipo === "confirmacao-frequencia" &&
          n.estagiarioId === estagiarioId &&
          !n.lida
      ),
    [minhas]
  )

  const value = {
    notificacoes: minhas,
    naoLidas,
    criar,
    marcarComoLida,
    marcarTodasComoLidas,
    remover,
    buscarPorEstagiario,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useNotifications() {
  const ctx = useContext(Ctx)
  if (!ctx)
    throw new Error("useNotifications deve ser usado dentro de <NotificationProvider>")
  return ctx
}