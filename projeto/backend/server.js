import express from "express"
import cors from "cors"
import path from "node:path"
import { env } from "./config/env.js"
import { testarConexao } from "./db.js"
import { handlerErro } from "./middlewares/error.js"

import { authRouter } from "./routes/auth.routes.js"
import { usuariosRouter } from "./routes/usuarios.routes.js"
import { empresasRouter } from "./routes/empresas.routes.js"
import { estagiariosRouter } from "./routes/estagiarios.routes.js"
import { frequenciasRouter } from "./routes/frequencias.routes.js"
import { relatoriosRouter } from "./routes/relatorios.routes.js"
import { avaliacoesRouter } from "./routes/avaliacoes.routes.js"
import { notificacoesRouter } from "./routes/notificacoes.routes.js"

const app = express()

/* ---------- Middlewares base ---------- */
app.use(cors({ origin: env.APP_URL, credentials: true }))
app.use(express.json({ limit: "5mb" }))

/* ---------- Arquivos estáticos (PDFs) ---------- */
app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)))

/* ---------- Health check ---------- */
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }))

/* ---------- Rotas ---------- */
app.use("/auth", authRouter)
app.use("/usuarios", usuariosRouter)
app.use("/empresas", empresasRouter)
app.use("/estagiarios", estagiariosRouter)
app.use("/frequencias", frequenciasRouter)
app.use("/relatorios", relatoriosRouter)
app.use("/avaliacoes", avaliacoesRouter)
app.use("/notificacoes", notificacoesRouter)

/* ---------- Handler de erro (SEMPRE por último) ---------- */
app.use(handlerErro)

/* ---------- Start ---------- */
async function iniciar() {
  try {
    await testarConexao()
    app.listen(env.PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${env.PORT}`)
    })
  } catch (e) {
    console.error("❌ Falha ao iniciar:", e.message)
    process.exit(1)
  }
}

iniciar()