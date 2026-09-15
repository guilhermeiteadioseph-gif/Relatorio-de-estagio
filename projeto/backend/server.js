import "dotenv/config"
import express from "express"
import cors from "cors"
import { enviarEmail } from "./gmail.js"

const app = express()
app.use(cors())
app.use(express.json())

/* ───────────── "Banco" em memória (troque por SQLite/Postgres) ───────────── */
const notificacoes = []
let contador = 0

/* ───────────── Helpers ───────────── */
function montarEmailConfirmacao({ notificacao, estagiario }) {
  const link = `${process.env.APP_URL}${notificacao.link}`
  return {
    to: notificacao.emailDestinatario,
    subject: `[CETEP Araci] Confirmação de frequência — ${estagiario.nome}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1e293b">
        <h2 style="color:#1e3a8a">Confirmação de frequência de estágio</h2>
        <p>Olá, <strong>${estagiario.supervisor}</strong>,</p>
        <p>O estágio de <strong>${estagiario.nome}</strong> (Matrícula ${estagiario.matricula})
           foi concluído. Confira o resumo e confirme as horas no sistema:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 0;color:#64748b">Empresa</td>
              <td style="padding:6px 0"><strong>${estagiario.empresa.nome}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Período</td>
              <td style="padding:6px 0">${estagiario.periodoEstagio}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Total</td>
              <td style="padding:6px 0"><strong>${estagiario.horasCumpridas}h de ${estagiario.horasTotais}h</strong></td></tr>
        </table>
        <p style="margin:24px 0">
          <a href="${link}"
             style="background:#1d4ed8;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;display:inline-block">
            Confirmar no sistema
          </a>
        </p>
        <p style="font-size:12px;color:#64748b">
          Se o botão não funcionar, copie e cole:<br>
          <a href="${link}">${link}</a>
        </p>
        <p style="font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:12px">
          Você precisará entrar com sua conta de supervisor. Se identificar dias que
          não deveriam contar como presença, use a opção "Tenho observações".
        </p>
        <p style="font-size:12px;color:#64748b">
          Coordenação de Estágios — CETEP Araci
        </p>
      </div>
    `,
  }
}

/* ───────────── Rotas ───────────── */

/** Lista notificações (filtra por usuarioId via query) */
app.get("/notificacoes", (req, res) => {
  const { usuarioId } = req.query
  const filtradas = usuarioId
    ? notificacoes.filter((n) => n.usuarioId === usuarioId)
    : notificacoes
  res.json(filtradas)
})

/**
 * Cria uma notificação.
 * Body esperado:
 *   {
 *     usuarioId, tipo, titulo, descricao, link,
 *     meta: { estagiarioId },
 *     enviarEmail: true,
 *     emailDestinatario: "supervisor@empresa.com.br",
 *     estagiario: { ...dados completos para o e-mail... }
 *   }
 */
app.post("/notificacoes", async (req, res) => {
  const {
    usuarioId, tipo, titulo, descricao, link, meta,
    enviarEmail: deveEnviar, emailDestinatario, estagiario,
  } = req.body

  const notificacao = {
    id: `n_${++contador}`,
    usuarioId,
    tipo,
    titulo,
    descricao,
    link,
    meta: meta || {},
    estagiarioId: meta?.estagiarioId,
    lida: false,
    criadaEm: new Date().toISOString(),
    emailEnviado: false,
    emailEnviadoEm: null,
  }

  notificacoes.push(notificacao)

  // Dispara e-mail (se solicitado)
  if (deveEnviar && emailDestinatario && estagiario) {
    try {
      const email = montarEmailConfirmacao({ notificacao, estagiario })
      const resultado = await enviarEmail(email)

      notificacao.emailEnviado = true
      notificacao.emailEnviadoEm = new Date().toISOString()
      notificacao.emailMessageId = resultado.id

      console.log(`[email] Enviado para ${emailDestinatario} (id: ${resultado.id})`)
    } catch (e) {
      console.error("[email] Falha ao enviar:", e.message)
      // Não falha a resposta — a notificação ainda foi criada
    }
  }

  res.status(201).json(notificacao)
})

/** Marca como lida */
app.patch("/notificacoes/:id/lida", (req, res) => {
  const n = notificacoes.find((x) => x.id === req.params.id)
  if (!n) return res.status(404).json({ error: "Não encontrada" })
  n.lida = true
  res.json(n)
})

/** Envio avulso de e-mail (para casos fora do fluxo de notificação) */
app.post("/emails", async (req, res) => {
  try {
    const { to, subject, html } = req.body
    const resultado = await enviarEmail({ to, subject, html })
    res.json({ ok: true, messageId: resultado.id })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

/* ───────────── Start ───────────── */
app.listen(process.env.PORT || 3001, () => {
  console.log(`Backend rodando em http://localhost:${process.env.PORT || 3001}`)
})