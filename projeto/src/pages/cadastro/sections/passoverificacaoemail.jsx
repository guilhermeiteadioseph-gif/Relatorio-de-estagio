import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { toast } from "@/components/ui/sonner"
import { Mail, Loader2, RotateCcw } from "lucide-react"

import { useAuth } from "@/contexts/AuthContext"

/**
 * Passo 3 — Verificação do e-mail com código de 6 dígitos.
 *
 * Regra de segurança: NUNCA confirmamos se o e-mail já existe. O usuário
 * sempre vê esta tela; a checagem de duplicidade acontece no backend.
 */
export default function PassoVerificacaoEmail({ dados, onAvancar }) {
  const { confirmarEmail } = useAuth()
  const [codigo, setCodigo] = useState("")
  const [verificando, setVerificando] = useState(false)
  const [erro, setErro] = useState("")

  const handleConfirmar = async () => {
    setErro("")
    if (codigo.length !== 6) {
      setErro("Digite os 6 dígitos do código.")
      return
    }
    setVerificando(true)
    await new Promise((r) => setTimeout(r, 300))
    const res = confirmarEmail(dados.email, codigo)
    setVerificando(false)

    if (!res.ok) {
      setErro(res.erro)
      return
    }
    toast.success("E-mail verificado!", "Você pode continuar o cadastro.")
    onAvancar()
  }

  const reenviar = () => {
    // Simula reenvio (em produção, chamaria o backend)
    toast.info("Novo código enviado", `Verifique ${dados.email}`)
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="size-5 text-blue-600" />
          <CardTitle className="text-xl">Confirme seu e-mail</CardTitle>
        </div>
        <CardDescription>
          Enviamos um código de 6 dígitos para <strong>{dados.email}</strong>.
          Ele expira em 24 horas.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert variant="info">
          <AlertDescription>
            Por questões de segurança, não informamos se um e-mail já está em
            uso. Se você não receber o código, verifique a caixa de spam ou
            tente novamente mais tarde.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            value={codigo}
            onChange={setCodigo}
            disabled={verificando}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {erro && (
            <p className="text-sm font-medium text-destructive">{erro}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={reenviar}
            className="gap-1.5 text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="size-3.5" /> Reenviar código
          </Button>

          <Button
            type="button"
            onClick={handleConfirmar}
            disabled={codigo.length !== 6 || verificando}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {verificando ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Verificando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}