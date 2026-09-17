import { useState } from "react"
import { Link } from "react-router"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/sonner"
import { GraduationCap, Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"

import { validarEmail } from "@/utils/validacao"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Tela de solicitação de recuperação de senha.
 *
 * Fluxo:
 *   1. Usuário informa o e-mail.
 *   2. Backend sempre responde OK (anti-enumeração).
 *   3. Se o e-mail existir, um link com token é "enviado".
 */
export default function RecuperarSenha() {
  const { solicitarRecuperacaoSenha } = useAuth()

  const [email, setEmail] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro("")

    if (!validarEmail(email)) {
      setErro("Informe um e-mail válido.")
      return
    }

    setEnviando(true)
    await solicitarRecuperacaoSenha(email)
    setEnviando(false)
    setEnviado(true)
    toast.success("Verifique seu e-mail", "Se houver uma conta, enviamos um link.")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header enxuto */}
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

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-blue-600" />
              <CardTitle className="text-xl">Recuperar senha</CardTitle>
            </div>
            <CardDescription>
              Informe seu e-mail cadastrado. Enviaremos um link para você criar
              uma nova senha.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {enviado ? (
              <>
                <Alert variant="success">
                  <CheckCircle2 />
                  <AlertDescription>
                    Se este e-mail estiver cadastrado, você receberá um link em
                    instantes. Verifique sua caixa de entrada e o spam.
                  </AlertDescription>
                </Alert>

                <p className="text-center text-sm text-slate-500">
                  Não recebeu?{" "}
                  <button
                    type="button"
                    onClick={() => setEnviado(false)}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Tentar novamente
                  </button>
                </p>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-slate-400" /> E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@exemplo.com"
                    disabled={enviando}
                    autoComplete="email"
                    autoFocus
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
                      <Loader2 className="mr-2 size-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}