import { createContext, useContext, useEffect, useState } from "react"
import { roles, roleMetadata } from "../constants/roles"

const AuthContext = createContext(null)

/* ------------------------------------------------------------------ */
/*  Helpers internos                                                   */
/* ------------------------------------------------------------------ */

/** Gera um código de 6 dígitos (simula o token que viria por e-mail). */
function gerarCodigo6() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/** Persiste a "caixa de e-mails simulada" no localStorage (dev only). */
function enviarEmailSimulado(destinatario, codigo) {
  const key = `mock_emails_${destinatario}`
  localStorage.setItem(key, JSON.stringify({ codigo, expiraEm: Date.now() + 24 * 3600 * 1000 }))
  // Log visual para o dev poder testar
  console.info(`[MOCK EMAIL] Código para ${destinatario}: ${codigo}`)
}

/** Lê o código pendente do localStorage. */
function lerCodigoPendente(email) {
  try {
    return JSON.parse(localStorage.getItem(`mock_emails_${email}`) || "null")
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("siget_user")
    return raw ? JSON.parse(raw) : null
  })

  /** Cadastros pendentes de aprovação (escola revisa depois). */
  const [pendentes, setPendentes] = useState(() => {
    const raw = localStorage.getItem("siget_pendentes")
    return raw ? JSON.parse(raw) : []
  })

  /** Usuários registrados (mock — substituir por backend real). */
  const [usuarios, setUsuarios] = useState(() => {
    const raw = localStorage.getItem("siget_usuarios")
    return raw
      ? JSON.parse(raw)
      : [
          // Usuários seed para login de teste
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

  /* ------------------------------------------------------------------ */
  /*  Login / Logout                                                    */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /*  Etapa 1 — Registrar dados básicos                                 */
  /* ------------------------------------------------------------------ */
  /**
   * Registra dados iniciais e dispara o código de verificação.
   * REGRA DE SEGURANÇA: não revela se o e-mail já existe — sempre responde
   * a mesma coisa e sempre "envia" o código.
   *
   * @returns {Promise<{ ok: boolean }>}
   */
  async function registrar({ nome, email, senha, role, metodo2FA }) {
    // Simula latência
    await new Promise((r) => setTimeout(r, 600))

    const jaExiste = usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())

    // NUNCA revelamos se o e-mail existe → sempre gera código.
    // Em produção, o backend decide o que fazer (reenviar, notificar, etc).
    const codigo = gerarCodigo6()
    enviarEmailSimulado(email, codigo)

    if (jaExiste) {
      // Silenciosamente não regrava; o usuário verá a mesma tela de verificação
      return { ok: true, _jaExistia: true }
    }

    // Guarda o cadastro temporário até a confirmação
    const rascunho = { nome, email, senha, role, metodo2FA }
    sessionStorage.setItem("siget_rascunho", JSON.stringify(rascunho))

    return { ok: true }
  }

  /* ------------------------------------------------------------------ */
  /*  Etapa 2 — Verificar código                                        */
  /* ------------------------------------------------------------------ */
  /**
   * Valida o código de 6 dígitos.
   * @returns {{ ok: boolean, erro?: string }}
   */
  function confirmarEmail(email, codigo) {
    const pendente = lerCodigoPendente(email)
    if (!pendente) return { ok: false, erro: "Nenhum código pendente para este e-mail." }
    if (Date.now() > pendente.expiraEm) return { ok: false, erro: "Código expirado. Solicite novamente." }
    if (pendente.codigo !== String(codigo)) return { ok: false, erro: "Código incorreto." }
    return { ok: true }
  }

  /* ------------------------------------------------------------------ */
  /*  Etapa 3 — Finalizar cadastro                                      */
  /* ------------------------------------------------------------------ */
  /**
   * Conclui o cadastro aplicando as regras por perfil.
   *
   * - Se `precisaAprovacao` → empilha em `pendentes`.
   * - Caso contrário → salva como usuário ativo e faz login automático.
   *
   * @param {object} dadosExtra Dados específicos do perfil (empresa, matrícula, etc.)
   */
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

    // Perfil sem aprovação → ativa direto
    const novo = {
      nome: registro.nome,
      email: registro.email,
      senha: registro.senha,
      role: registro.role,
      metodo2FA: registro.metodo2FA,
    }
    setUsuarios((prev) => [...prev, novo])
    sessionStorage.removeItem("siget_rascunho")

    // Login automático
    const sessao = { nome: novo.nome, email: novo.email, role: novo.role }
    setUser(sessao)
    localStorage.setItem("siget_user", JSON.stringify(sessao))
    return { ok: true, pendente: false }
  }

  /* ------------------------------------------------------------------ */
  /*  Aprovação (usada pelo painel do vice-diretor)                     */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  const value = {
    user,
    usuarios,
    pendentes,
    login,
    logout,
    registrar,
    confirmarEmail,
    finalizarCadastro,
    aprovarPendente,
    rejeitarPendente,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>")
  return ctx
}