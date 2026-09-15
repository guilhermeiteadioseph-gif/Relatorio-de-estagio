/**
 * Serviço de notificações e e-mails.
 *
 * MODO_MOCK = true (padrão): tudo roda no navegador, apenas console.log.
 * MODO_MOCK = false: requer VITE_API_URL configurada e backend rodando.
 *
 * Para ativar produção, adicione no .env do Vite:
 *   VITE_API_URL=https://api.sistema.cetep-araci.br
 */

const API_URL = import.meta.env?.VITE_API_URL || ""
const MODO_MOCK = !API_URL

let contadorMock = 1000

/* ------------------------------------------------------------------ */
/*  NOTIFICAÇÕES                                                       */
/* ------------------------------------------------------------------ */
export const notificacaoService = {
  /**
   * Cria uma notificação. Em produção o backend também dispara o e-mail
   * vinculado, se `enviarEmail: true` for passado no payload.
   *
   * @param {Object} payload
   * @param {string} payload.usuarioId     - destinatário
   * @param {string} payload.tipo          - "confirmacao-frequencia" | ...
   * @param {string} payload.titulo
   * @param {string} payload.descricao
   * @param {string} [payload.link]        - deep link interno
   * @param {Object} [payload.meta]        - dados extras (estagiarioId, etc.)
   * @param {boolean} [payload.enviarEmail]
   * @param {Object}  [payload.email]      - { to, subject, html }
   */
  async criar(payload) {
    if (MODO_MOCK) {
      console.log("[MOCK][notificacao.criar]", payload)
      return {
        id: `n_mock_${++contadorMock}`,
        lida: false,
        criadaEm: new Date().toISOString(),
        emailEnviado: false,
        ...payload,
      }
    }
    const res = await fetch(`${API_URL}/notificacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Falha ao criar notificação")
    return res.json()
  },

  /** Lista as notificações do usuário logado. */
  async listar(usuarioId) {
    if (MODO_MOCK) return []
    const res = await fetch(`${API_URL}/notificacoes?usuarioId=${usuarioId}`)
    if (!res.ok) throw new Error("Falha ao listar notificações")
    return res.json()
  },

  /** Marca como lida. */
  async marcarComoLida(id) {
    if (MODO_MOCK) {
      console.log("[MOCK][notificacao.marcarComoLida]", id)
      return
    }
    await fetch(`${API_URL}/notificacoes/${id}/lida`, { method: "PATCH" })
  },
}

/* ------------------------------------------------------------------ */
/*  E-MAIL                                                             */
/* ------------------------------------------------------------------ */
export const emailService = {
  /**
   * Dispara um e-mail. Em produção o backend usa a Gmail API
   * (ver backend-reference/gmail.js).
   */
  async enviar({ to, subject, html }) {
    if (MODO_MOCK) {
      console.log("[MOCK][email.enviar]")
      console.log("  Para:", to)
      console.log("  Assunto:", subject)
      console.log("  HTML:", html.slice(0, 120) + "...")
      return { ok: true, messageId: `mock_${Date.now()}` }
    }
    const res = await fetch(`${API_URL}/emails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    })
    if (!res.ok) throw new Error("Falha ao enviar e-mail")
    return res.json()
  },
}