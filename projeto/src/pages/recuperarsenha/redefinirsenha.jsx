import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/sonner"
import {
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Info,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"

import { validarSenha } from "@/utils/validacao"
import { verificarSenhaVazada } from "@/utils/apis"
import { roleMetadata } from "@/constants/roles"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Tela de redefinição de senha.
 *
 * Recebe `?token=<hex>` na URL. Valida o token, mostra o formulário de
 * nova senha e, em sucesso, redireciona para /login.
 */
export default function RedefinirSenhaPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { validarTokenRecuperacao, redefinirSenha } = useAuth()

  const token = params.get("token")

  /** Resultado da validação do token (executado uma vez). */
  const validacao = useMemo(() => validarTokenRecuperacao(token), [token])

  const [senha, setSenha] = useState("")
  const [confirmacao, setConfirmacao] = useState("")
  const [mostrar, setMostrar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")
  const [concluido, setConcluido] = useState(false)

  /** Min. de caracteres conforme o perfil (12 sem 2FA, 10 com 2FA). */
  const meta = validacao.valido ? roleMetadata[validacao.role] : null
  const minSenha = meta?.minSenha ?? 12

  /* Redireciona em sucesso após 2s */
  useEffect(() => {
    if (!concluido) return
    const id = setTimeout(() => navigate("/login"), 2000)
    return () => clearTimeout(id)
  }, [concluido, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro("")

    const { valida, erro: errSenha } = validarSenha(senha, meta?.requer2FA)
    if (!valida) return setErro(errSenha)

    if (senha !== confirmacao) return setErro("As senhas não coincidem.")

    setEnviando(true)
    const vazada = await verificarSenhaVazada(senha)
    if (vazada.vazada) {
      setEnviando(false)
      return setErro(
        `Esta senha apareceu em vazamentos públicos (${vazada.contagem.toLocaleString()} vezes). Escolha outra.`
      )
    }

    const res = await redefinirSenha(token, senha)
    setEnviando(false)

    if (!res.ok) {
      setErro(res.erro)
      return
    }

    setConcluido(true)
    toast.success("Senha redefinida!", "Você já pode entrar com a nova senha.")
  }

  /* ---------------------------------------------------------------- */
  /*  Token inválido → tela de erro                                   */
  /* ---------------------------------------------------------------- */
  if (!validacao.valido) {
    return (
      <LayoutSimples>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-red-600" />
              <CardTitle className="text-xl">Link inválido</CardTitle>
            </div>
            <CardDescription>{validacao.erro}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Este link pode ter expirado, já ter sido utilizado, ou estar
                incorreto. Solicite um novo link de recuperação.
              </AlertDescription>
            </Alert>

            <Link to="/recuperar-senha">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Solicitar novo link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </LayoutSimples>
    )
  }

  /* ---------------------------------------------------------------- */
  /*  Sucesso → tela de confirmação                                   */
  /* ---------------------------------------------------------------- */
  if (concluido) {
    return (
      <LayoutSimples>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="space-y-5 py-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="size-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Senha redefinida com sucesso
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Redirecionando para o login…
              </p>
            </div>
          </CardContent>
        </Card>
      </LayoutSimples>
    )
  }

  /* ---------------------------------------------------------------- */
  /*  Formulário de nova senha                                        */
  /* ---------------------------------------------------------------- */
  return (
    <LayoutSimples>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-blue-600" />
            <CardTitle className="text-xl">Definir nova senha</CardTitle>
          </div>
          <CardDescription>
            Crie uma nova senha para <strong>{validacao.email}</strong>. O link
            expira em 30 minutos.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nova senha */}
            <div className="space-y-1.5">
              <Label htmlFor="senha" className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-slate-400" /> Nova senha
              </Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrar ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={enviando}
                  autoComplete="new-password"
                  autoFocus
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setMostrar((v) => !v)}
                  aria-label={mostrar ? "Ocultar senhas" : "Mostrar senhas"}
                  title={mostrar ? "Ocultar senhas" : "Mostrar senhas"}
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 inline-flex size-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  {mostrar ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="flex items-start gap-1 text-[11px] text-slate-500">
                <Info className="mt-0.5 size-3 shrink-0" />
                Mínimo de {minSenha} caracteres
                {meta?.requer2FA ? " (perfil com 2FA)" : ""}. Espaços e
                caracteres especiais são permitidos.
              </p>
            </div>

            {/* Confirmar senha */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmacao" className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-slate-400" /> Confirmar nova senha
              </Label>
              <Input
                id="confirmacao"
                type={mostrar ? "text" : "password"}
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                disabled={enviando}
                autoComplete="new-password"
              />
            </div>

            {erro && (
              <Alert variant="destructive">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={enviando}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {enviando ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Salvando...
                </>
              ) : (
                "Redefinir senha"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </LayoutSimples>
  )
}

/* ------------------------------------------------------------------ */
/*  Wrapper de layout (header + main) para as duas telas de recup.    */
/* ------------------------------------------------------------------ */
function LayoutSimples({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-4">
          <Link to="/login" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-700">
              <GraduationCap className="size-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">SIGET</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-10">
        <Link
          to="/login"
          className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="size-3.5" />
          Voltar para o login
        </Link>
        {children}
      </main>
    </div>
  )
}