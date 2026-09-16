import { useEffect, useMemo, useState } from "react"
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
import { Mail, Loader2, RotateCcw, CheckCircle2 } from "lucide-react"

import { useAuth } from "@/contexts/AuthContext"

/** Fallback visual (sincroniza com a regra do backend quando bloqueado). */
const SEGUNDOS_PARA_REENVIAR = 60

/**
 * Passo 3 — Verificação do e-mail.
 *
 * O timer local é APENAS UX. A fonte da verdade é o rate limit do
 * AuthContext (que simula o backend). Se o botão for habilitado antes
 * da hora, o backend ainda rejeita e devolve `segundosRestantes` — e o
 * timer se reajusta.
 */
export default function PassoVerificacaoEmail({ dados, onAvancar }) {
  const { confirmarEmail, reenviarCodigo } = useAuth()

  const [codigo, setCodigo] = useState("")
  const [verificando, setVerificando] = useState(false)
  const [reenviando, setReenviando] = useState(false)
  const [erro, setErro] = useState("")

  /** Instante a partir do qual o reenvio é permitido (ms). */
  const [liberadoEm, setLiberadoEm] = useState(
    () => Date.now() + SEGUNDOS_PARA_REENVIAR * 1000
  )

  /** Relógio de UI — atualizado a cada segundo. */
  const [agora, setAgora] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const segundosRestantes = useMemo(
    () => Math.max(0, Math.ceil((liberadoEm - agora) / 1000)),
    [liberadoEm, agora]
  )

  const podeReenviar = segundosRestantes === 0 && !reenviando && !verificando

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */
  const handleConfirmar = async () => {
    setErro("")
    if (codigo.length !== 6) {
      setErro("Digite os 6 dígitos do código.")
      return
    }
    setVerificando(true)
    const res = await confirmarEmail(dados.email, codigo)
    setVerificando(false)

    if (!res.ok) {
      setErro(res.erro)
      return
    }
    toast.success("E-mail verificado!", "Você pode continuar o cadastro.")
    onAvancar()
  }

  /**
   * Solicita novo código. Se o backend bloquear (rate limit), o timer
   * local se ajusta ao `segundosRestantes` retornado.
   */
  const handleReenviar = async () => {
    if (!podeReenviar) return
    setErro("")
    setReenviando(true)
    const res = await reenviarCodigo(dados.email)
    setReenviando(false)

    if (!res.ok) {
      // Backend rejeitou → sincroniza o timer local com a regra dele.
      if (res.segundosRestantes) {
        setLiberadoEm(Date.now() + res.segundosRestantes * 1000)
      }
      setErro(res.erro || "Não foi possível reenviar. Tente novamente.")
      return
    }

    setCodigo("")
    setLiberadoEm(Date.now() + SEGUNDOS_PARA_REENVIAR * 1000)
    toast.success("Novo código enviado", `Verifique ${dados.email}`)
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  const codigoCompleto = codigo.length === 6

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
            uso. Você tem até <strong>5 tentativas</strong> para digitar o código;
            depois disso, será preciso solicitar um novo.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            value={codigo}
            onChange={setCodigo}
            disabled={verificando || reenviando}
            autoFocus
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

        <div className="flex flex-col-reverse items-stretch gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReenviar}
            disabled={!podeReenviar}
            aria-live="polite"
            className={[
              "gap-1.5 text-slate-500 transition-colors",
              podeReenviar
                ? "hover:bg-slate-100 hover:text-slate-800"
                : "cursor-not-allowed text-slate-400",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {reenviando ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Enviando novo código…
              </>
            ) : podeReenviar ? (
              <>
                <RotateCcw className="size-3.5" />
                Reenviar código
              </>
            ) : (
              <>
                <RotateCcw className="size-3.5 opacity-50" />
                Reenviar em {segundosRestantes}s
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleConfirmar}
            disabled={!codigoCompleto || verificando || reenviando}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {verificando ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Verificando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 size-4" /> Confirmar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}