import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Mail, Shield, Info } from "lucide-react"

/**
 * Passo 2 — Escolha do método de 2FA.
 * Exibido apenas para perfis que EXIGEM 2FA (vice-diretor, assistente).
 *
 * A escolha é definitiva — trocar depois exige reautenticação.
 */
export default function Passo2FA({ dados, onAvancar }) {
  const [metodo, setMetodo] = useState(dados.metodo2FA || "")
  const [erro, setErro] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!metodo) {
      setErro("Escolha um método de autenticação em dois fatores.")
      return
    }
    onAvancar({ metodo2FA: metodo })
  }

  const opcoes = [
    {
      value: "app",
      titulo: "App Autenticador",
      descricao: "Use Google Authenticator, Authy ou similar.",
      icone: Smartphone,
    },
    {
      value: "email",
      titulo: "Código por E-mail",
      descricao: "Receberemos um código de 6 dígitos a cada login.",
      icone: Mail,
    },
  ]

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-blue-600" />
          <CardTitle className="text-xl">Autenticação em dois fatores</CardTitle>
        </div>
        <CardDescription>
          Seu perfil exige uma camada extra de segurança. Escolha como deseja
          confirmar seus logins.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <RadioGroup
            value={metodo}
            onValueChange={setMetodo}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {opcoes.map((o) => {
              const Icone = o.icone
              const ativo = metodo === o.value
              return (
                <label
                  key={o.value}
                  htmlFor={`2fa-${o.value}`}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    ativo
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <RadioGroupItem id={`2fa-${o.value}`} value={o.value} className="mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Icone className={`size-4 ${ativo ? "text-blue-600" : "text-slate-500"}`} />
                      <span className="text-sm font-semibold text-slate-800">
                        {o.titulo}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{o.descricao}</p>
                  </div>
                </label>
              )
            })}
          </RadioGroup>

          <Alert variant="info">
            <Info />
            <AlertDescription>
              A escolha é definitiva. Para trocar depois, será preciso passar por
              uma reautenticação (senha + código atual).
            </AlertDescription>
          </Alert>

          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!metodo}
          >
            Continuar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}