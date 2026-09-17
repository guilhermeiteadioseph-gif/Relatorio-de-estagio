import { createContext, useContext, useEffect, useState } from "react"
import { roles, roleMetadata } from "../constants/roles"

const AuthContext = createContext(null)

/* ================================================================== */
/*  Constantes de segurança                                            */
/* ================================================================== */

/** TTL do código (24 horas). */
const TTL_CODIGO_MS = 24 * 60 * 60 * 1000

/** Intervalo mínimo entre dois envios (60s). */
const INTERVALO_MIN_ENTRE_ENVIOS_MS = 60 * 1000

/** Máximo de envios por janela deslizante. */
const MAX_ENVIOS_POR_HORA = 5
const JANELA_RATE_LIMIT_MS = 60 * 60 * 1000

/** Número máximo de tentativas de verificação antes de invalidar. */
const MAX_TENTATIVAS = 5

/* ================================================================== */
/*  Helpers — storage                                                  */
/* ================================================================== */

const KEY_CODIGO = (email) => `mock_emails_${email}`
const KEY_RATE = (email) => `mock_rate_limit_${email}`

function lerCodigoPendente(email) {
  try {
    return JSON.parse(localStorage.getItem(KEY_CODIGO(email)) || "null")
  } catch {
    return null
  }
}

function salvarCodigoPendente(email, registro) {
  localStorage.setItem(KEY_CODIGO(email), JSON.stringify(registro))
}

function removerCodigoPendente(email) {
  localStorage.removeItem(KEY_CODIGO(email))
}

function lerHistoricoEnvios(email) {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY_RATE(email)) || "[]")
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function salvarHistoricoEnvios(email, timestamps) {
  localStorage.setItem(KEY_RATE(email), JSON.stringify(timestamps))
}

/* ================================================================== */
/*  Helpers — geração e hash                                           */
/* ================================================================== */

/** Gera um código numérico de 6 dígitos (100000–999999). */
function gerarCodigo6() {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return String(100000 + (buf[0] % 900000))
}

/**
 * Gera o hash SHA-256 (hex) do código concatenado ao e-mail.
 * Usar o e-mail como "sal" evita que o mesmo código tenha o mesmo hash
 * para usuários diferentes.
 *
 * Em produção, o backend faria exatamente isso (ou usaria bcrypt/argon2).
 */
async function hashCodigo(codigo, email) {
  const dados = new TextEncoder().encode(`${codigo}::${email}`)
  const digest = await crypto.subtle.digest("SHA-256", dados)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/* ================================================================== */
/*  Rate limit (client-side, apenas para simular o backend)            */
/* ================================================================== */

/**
 * Verifica se o e-mail pode receber um novo código AGORA.
 *
 * Regras (mesmas que o backend aplicaria):
 *   1) O último envio precisa ter sido há pelo menos 60s.
 *   2) No máximo 5 envios dentro de uma janela deslizante de 1 hora.
 *
 * @returns {{
 *   permitido: boolean,
 *   motivo?: "intervalo" | "limite_hora",
 *   segundosRestantes?: number,
 *   enviosNaJanela: number
 * }}
 */
function verificarRateLimit(email) {
  const agora = Date.now()
  const historico = lerHistoricoEnvios(email).filter(
    (t) => agora - t < JANELA_RATE_LIMIT_MS
  )

  // Persiste o histórico já podado (economiza espaço)
  salvarHistoricoEnvios(email, historico)

  const ultimo = historico[historico.length - 1]
  if (ultimo && agora - ultimo < INTERVALO_MIN_ENTRE_ENVIOS_MS) {
    const segundosRestantes = Math.ceil(
      (INTERVALO_MIN_ENTRE_ENVIOS_MS - (agora - ultimo)) / 1000
    )
    return {
      permitido: false,
      motivo: "intervalo",
      segundosRestantes,
      enviosNaJanela: historico.length,
    }
  }

  if (historico.length >= MAX_ENVIOS_POR_HORA) {
    const maisAntigo = historico[0]
    const segundosRestantes = Math.ceil(
      (JANELA_RATE_LIMIT_MS - (agora - maisAntigo)) / 1000
    )
    return {
      permitido: false,
      motivo: "limite_hora",
      segundosRestantes,
      enviosNaJanela: historico.length,
    }
  }

  return { permitido: true, enviosNaJanela: historico.length }
}

/* ================================================================== */
/*  Envio do código (mock)                                             */
/* ================================================================== */

/**
 * Fluxo completo de "envio de código":
 *   1. Consulta rate limit.
 *   2. Gera código numérico.
 *   3. Cria hash SHA-256.
 *   4. Salva { hash, expiraEm, tentativas } no localStorage.
 *   5. Registra o envio no histórico (rate limit).
 *
 * Em produção, os passos 3–5 aconteceriam no servidor e o código puro
 * seria despachado por e-mail (Resend/SendGrid/etc.) SEM NUNCA voltar
 * para o cliente.
 *
 * @returns {Promise<{ ok: boolean, erro?: string, segundosRestantes?: number }>}
 */
async function enviarCodigoPara(email) {
  const rate = verificarRateLimit(email)
  if (!rate.permitido) {
    return {
      ok: false,
      erro:
        rate.motivo === "intervalo"
          ? `Aguarde ${rate.segundosRestantes}s para reenviar.`
          : `Limite de ${MAX_ENVIOS_POR_HORA} envios por hora atingido. Tente novamente em ${Math.ceil(
              (rate.segundosRestantes || 0) / 60
            )} min.`,
      segundosRestantes: rate.segundosRestantes,
    }
  }

  const codigo = gerarCodigo6()
  const hash = await hashCodigo(codigo, email)

  salvarCodigoPendente(email, {
    hash,
    expiraEm: Date.now() + TTL_CODIGO_MS,
    criadoEm: Date.now(),
    tentativas: 0,
  })

  // Atualiza histórico do rate limit
  const historico = lerHistoricoEnvios(email)
  historico.push(Date.now())
  salvarHistoricoEnvios(email, historico)

  // ⬇️ APENAS EM DEV. Em produção, o código NUNCA apareceria no console.
  console.info(`[MOCK EMAIL] Código para ${email}: ${codigo}`)

  return { ok: true }
}

/* ================================================================== */
/*  Recuperação de senha                                               */
/* ================================================================== */

/** TTL do link de recuperação (30 minutos). */
const TTL_RECUPERACAO_MS = 30 * 60 * 1000

/** Gera token URL-safe de 32 bytes (hex). */
function gerarTokenRecuperacao() {
  const buf = new Uint8Array(32)
  crypto.getRandomValues(buf)
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/** Storage keys para o mock de recuperação. */
const KEY_RECUPERACAO = (token) => `mock_recovery_${token}`

/* ================================================================== */
/*  Provider                                                           */
/* ================================================================== */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("siget_user")
    return raw ? JSON.parse(raw) : null
  })

  const [pendentes, setPendentes] = useState(() => {
    const raw = localStorage.getItem("siget_pendentes")
    return raw ? JSON.parse(raw) : []
  })

  const [usuarios, setUsuarios] = useState(() => {
    const raw = localStorage.getItem("siget_usuarios")
    return raw
      ? JSON.parse(raw)
      : [
          { email: "aluno@teste.com", senha: "aluno1234567", role: roles.ALUNO, nome: "Aluno Teste" },
          { email: "professor@teste.com", senha: "professor1234", role: roles.PROFESSOR, nome: "Professor Teste" },
          { email: "vice@teste.com", senha: "vicediretor", role: roles.VICE_DIRETOR, nome: "Vice Teste" },
          { email: "supervisor@teste.com", senha: "supervisor12", role: roles.SUPERVISOR, nome: "Supervisor Teste" },
          { email: "assistente@teste.com", senha: "assistente12", role: roles.ASSISTENTE, nome: "Assistente Teste" },
        ]
  })

  useEffect(() => {
    localStorage.setItem("siget_usuarios", JSON.stringify(usuarios))
  }, [usuarios])

  useEffect(() => {
    localStorage.setItem("siget_pendentes", JSON.stringify(pendentes))
  }, [pendentes])

  /* ---------------------------------------------------------------- */
  /*  Login / Logout                                                   */
  /* ---------------------------------------------------------------- */
  const login = (email, senha) => {
    const u = usuarios.find(
      (x) => x.email.toLowerCase() === String(email).toLowerCase() && x.senha === senha
    )
    if (!u) return null
    const sessao = { nome: u.nome, email: u.email, role: u.role }
    setUser(sessao)
    localStorage.setItem("siget_user", JSON.stringify(sessao))
    return sessao
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("siget_user")
  }

  /* ---------------------------------------------------------------- */
  /*  Cadastro                                                         */
  /* ---------------------------------------------------------------- */
  async function registrar({ nome, email, senha, role, metodo2FA }) {
    await new Promise((r) => setTimeout(r, 400))

    const emailNorm = email.toLowerCase()
    const jaExiste = usuarios.some((u) => u.email.toLowerCase() === emailNorm)

    // Nunca revela duplicidade. Só dispara o envio (que já aplica rate limit).
    const envio = await enviarCodigoPara(emailNorm)
    if (!envio.ok) {
      return { ok: false, erro: envio.erro }
    }

    if (jaExiste) {
      // Silenciosamente não regrava — a tela de verificação é idêntica.
      return { ok: true, _jaExistia: true }
    }

    const rascunho = { nome, email: emailNorm, senha, role, metodo2FA }
    sessionStorage.setItem("siget_rascunho", JSON.stringify(rascunho))
    return { ok: true }
  }

  /**
   * Reenvia o código. Delega 100% ao enviarCodigoPara — que já checa o
   * rate limit. Também retorna `segundosRestantes` quando bloqueado, para
   * que a UI possa sincronizar o contador com a regra do "servidor".
   */
  async function reenviarCodigo(email) {
    return enviarCodigoPara(email.toLowerCase())
  }

  /**
   * Consulta pública do rate limit — a UI usa antes de renderizar o botão
   * "Reenviar" para saber se está liberado e, se não estiver, há quantos
   * segundos estará.
   */
  function consultarRateLimit(email) {
    return verificarRateLimit(email.toLowerCase())
  }

  /**
 * Solicita recuperação de senha.
 * REGRA ANTI-ENUMERAÇÃO: sempre retorna `{ ok: true }`, independentemente
 * de o e-mail existir. Se existir, o link é gerado e "enviado".
 *
 * @param {string} email
 * @returns {Promise<{ ok: true }>}
 */
async function solicitarRecuperacaoSenha(email) {
  await new Promise((r) => setTimeout(r, 600))
  const emailNorm = String(email).trim().toLowerCase()
  const usuario = usuarios.find((u) => u.email.toLowerCase() === emailNorm)

  if (usuario) {
    const token = gerarTokenRecuperacao()
    localStorage.setItem(
      KEY_RECUPERACAO(token),
      JSON.stringify({
        email: emailNorm,
        role: usuario.role,
        expiraEm: Date.now() + TTL_RECUPERACAO_MS,
        usado: false,
      })
    )

    // ⬇️ Apenas em DEV. Em produção, o backend enviaria o link por e-mail
    // e o token NUNCA apareceria no console.
    console.info(
      `[MOCK EMAIL] Link de recuperação para ${emailNorm}: ` +
        `/redefinir-senha?token=${token}`
    )
  }

  return { ok: true }
}

/**
 * Valida um token de recuperação sem consumi-lo.
 * Usado pela tela `/redefinir-senha` no carregamento.
 *
 * @returns {{ valido: boolean, email?: string, role?: string, erro?: string }}
 */
function validarTokenRecuperacao(token) {
  if (!token) return { valido: false, erro: "Token ausente." }

  try {
    const raw = localStorage.getItem(KEY_RECUPERACAO(token))
    if (!raw) return { valido: false, erro: "Link inválido ou expirado." }

    const dados = JSON.parse(raw)
    if (dados.usado) return { valido: false, erro: "Este link já foi utilizado." }
    if (Date.now() > dados.expiraEm)
      return { valido: false, erro: "Link expirado. Solicite um novo." }

    return { valido: true, email: dados.email, role: dados.role }
  } catch {
    return { valido: false, erro: "Link inválido." }
  }
}

/**
 * Redefine a senha a partir do token.
 * - Atualiza `usuarios` no estado + localStorage.
 * - Marca o token como `usado` (uso único).
 *
 * @param {string} token
 * @param {string} novaSenha
 * @returns {Promise<{ ok: boolean, erro?: string }>}
 */
async function redefinirSenha(token, novaSenha) {
  const check = validarTokenRecuperacao(token)
  if (!check.valido) return { ok: false, erro: check.erro }

  await new Promise((r) => setTimeout(r, 400))

  setUsuarios((prev) =>
    prev.map((u) =>
      u.email.toLowerCase() === check.email ? { ...u, senha: novaSenha } : u
    )
  )

  // Marca como usado (uso único)
  const raw = localStorage.getItem(KEY_RECUPERACAO(token))
  if (raw) {
    const dados = JSON.parse(raw)
    localStorage.setItem(
      KEY_RECUPERACAO(token),
      JSON.stringify({ ...dados, usado: true })
    )
  }

  return { ok: true }
}

  /* ---------------------------------------------------------------- */
  /*  Verificação do código                                            */
  /* ---------------------------------------------------------------- */
  /**
   * Confere o código digitado contra o hash salvo.
   * - Incrementa `tentativas` a cada erro.
   * - Ao atingir MAX_TENTATIVAS, invalida o código (obriga novo envio).
   * - Expira automaticamente após TTL_CODIGO_MS.
   */
  async function confirmarEmail(email, codigo) {
    const emailNorm = email.toLowerCase()
    const pendente = lerCodigoPendente(emailNorm)

    if (!pendente) {
      return { ok: false, erro: "Nenhum código pendente. Solicite um novo." }
    }

    if (Date.now() > pendente.expiraEm) {
      removerCodigoPendente(emailNorm)
      return { ok: false, erro: "Código expirado. Solicite um novo." }
    }

    if (pendente.tentativas >= MAX_TENTATIVAS) {
      removerCodigoPendente(emailNorm)
      return {
        ok: false,
        erro: `Muitas tentativas incorretas. Solicite um novo código.`,
      }
    }

    const hashDigitado = await hashCodigo(String(codigo), emailNorm)

    if (hashDigitado !== pendente.hash) {
      const tentativas = pendente.tentativas + 1
      const restam = MAX_TENTATIVAS - tentativas

      if (restam <= 0) {
        removerCodigoPendente(emailNorm)
        return {
          ok: false,
          erro: `Muitas tentativas incorretas. Solicite um novo código.`,
        }
      }

      salvarCodigoPendente(emailNorm, { ...pendente, tentativas })
      return {
        ok: false,
        erro: `Código incorreto. ${restam} tentativa(s) restante(s).`,
      }
    }

    // Sucesso: invalida para uso único.
    removerCodigoPendente(emailNorm)
    return { ok: true }
  }

  /* ---------------------------------------------------------------- */
  /*  Finalizar cadastro                                               */
  /* ---------------------------------------------------------------- */
  async function finalizarCadastro(dadosExtra = {}) {
    await new Promise((r) => setTimeout(r, 400))

    const raw = sessionStorage.getItem("siget_rascunho")
    if (!raw) return { ok: false, erro: "Nenhum cadastro em andamento." }
    const rascunho = JSON.parse(raw)
    const meta = roleMetadata[rascunho.role]

    const registro = {
      ...rascunho,
      ...dadosExtra,
      criadoEm: new Date().toISOString(),
      status: meta?.precisaAprovacao ? "pendente" : "ativo",
    }

    if (meta?.precisaAprovacao) {
      setPendentes((prev) => [...prev, registro])
      sessionStorage.removeItem("siget_rascunho")
      return { ok: true, pendente: true }
    }

    const novo = {
      nome: registro.nome,
      email: registro.email,
      senha: registro.senha,
      role: registro.role,
      metodo2FA: registro.metodo2FA,
    }
    setUsuarios((prev) => [...prev, novo])
    sessionStorage.removeItem("siget_rascunho")

    const sessao = { nome: novo.nome, email: novo.email, role: novo.role }
    setUser(sessao)
    localStorage.setItem("siget_user", JSON.stringify(sessao))
    return { ok: true, pendente: false }
  }

  /* ---------------------------------------------------------------- */
  /*  Aprovação / rejeição                                             */
  /* ---------------------------------------------------------------- */
  function aprovarPendente(email) {
    const p = pendentes.find((x) => x.email === email)
    if (!p) return { ok: false }
    setPendentes((prev) => prev.filter((x) => x.email !== email))
    setUsuarios((prev) => [
      ...prev,
      { nome: p.nome, email: p.email, senha: p.senha, role: p.role, metodo2FA: p.metodo2FA },
    ])
    return { ok: true }
  }

  function rejeitarPendente(email) {
    setPendentes((prev) => prev.filter((x) => x.email !== email))
    return { ok: true }
  }

  /* ---------------------------------------------------------------- */
  const value = {
    user,
    usuarios,
    pendentes,
    login,
    logout,
    registrar,
    reenviarCodigo,
    consultarRateLimit,
    confirmarEmail,
    finalizarCadastro,
    aprovarPendente,
    rejeitarPendente,
    solicitarRecuperacaoSenha,
    validarTokenRecuperacao,
    redefinirSenha,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>")
  return ctx
}