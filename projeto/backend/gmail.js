import { google } from "googleapis"

/**
 * Cliente OAuth2 configurado com refresh token de longa duração.
 * O refresh token permite enviar e-mails sem interação do usuário —
 * ideal para notificações automáticas de sistema.
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
)

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
})

const gmail = google.gmail({ version: "v1", auth: oauth2Client })

/**
 * Envia um e-mail HTML via Gmail API.
 * @param {Object} opts
 * @param {string} opts.to       - destinatário
 * @param {string} opts.subject  - assunto
 * @param {string} opts.html     - corpo em HTML
 * @returns {Promise<Object>}    - resposta da API do Gmail
 */
export async function enviarEmail({ to, subject, html }) {
  // Codifica o assunto para UTF-8 (RFC 2047)
  const assuntoCodificado = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`

  // Monta a mensagem MIME
  const mensagem = [
    `From: ${process.env.GMAIL_SENDER}`,
    `To: ${to}`,
    `Subject: ${assuntoCodificado}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    html,
  ].join("\r\n")

  // Gmail exige base64url
  const raw = Buffer.from(mensagem)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  })

  return res.data
}