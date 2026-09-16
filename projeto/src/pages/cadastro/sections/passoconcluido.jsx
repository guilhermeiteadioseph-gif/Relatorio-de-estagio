import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Mail, ArrowRight, Shield } from "lucide-react"

import { roleMetadata } from "@/constants/roles"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Passo 5 — Conclusão.
 *   - Se o perfil exige aprovação → mostra "pendente"
 *   - Se não → faz login automático e redireciona
 */
export default function PassoConcluido({ dados }) {
  const navigate = useNavigate()
  const { finalizarCadastro } = useAuth()
  const [estado, setEstado] = useState({ carregando: true, pendente: false, role: dados.role })

  useEffect(() => {
    let ativo = true
    ;(async () => {
      const res = await finalizarCadastro(dados.extra || {})
      if (!ativo) return
      setEstado({ carregando: false, pendente: res.pendente, role: dados.role })

      // Se não ficou pendente, faz login automático e entra
      if (res.ok && !res.pendente) {
        setTimeout(() => {
          const rota = dados.role === "vice-diretor"
            ? "/vice-diretor"
            : dados.role === "supervisor"
            ? "/supervisor"
            : dados.role === "professor"
            ? "/professor"
            : dados.role === "assistente"
            ? "/assistente"
            : "/aluno"
          navigate(rota)
        }, 1200)
      }
    })()
    return () => { ativo = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (estado.carregando) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-slate-500">Finalizando cadastro…</p>
        </CardContent>
      </Card>
    )
  }

  const meta = roleMetadata[dados.role] || {}

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          {estado.pendente ? (
            <Clock className="size-5 text-amber-600" />
          ) : (
            <CheckCircle2 className="size-5 text-emerald-600" />
          )}
          <CardTitle className="text-xl">
            {estado.pendente ? "Cadastro em análise" : "Cadastro concluído!"}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Cabeçalho com e-mail + perfil */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Perfil</span>
            <Badge variant="outline">{meta.label}</Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">E-mail</span>
            <span className="truncate text-sm text-slate-700">{dados.email}</span>
          </div>
          {dados.metodo2FA && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">2FA</span>
              <span className="flex items-center gap-1 text-sm text-slate-700">
                <Shield className="size-3.5 text-emerald-500" />
                {dados.metodo2FA === "app" ? "App Autenticador" : "Código por E-mail"}
              </span>
            </div>
          )}
        </div>

        {estado.pendente ? (
          <Alert variant="warning">
            <Clock />
            <AlertTitle>Aguardando aprovação da escola</AlertTitle>
            <AlertDescription>
              {dados.role === "supervisor" && (
                <>O vice-diretor vai verificar se o CNPJ é válido e se a empresa
                possui convênio com o CETEP. Você receberá um e-mail quando for aprovado.</>
              )}
              {dados.role === "professor" && (
                <>Um assistente ou vice-diretor vai conferir sua matrícula antes
                de liberar o acesso. Você receberá um e-mail quando for aprovado.</>
              )}
              {dados.role === "assistente" && (
                <>O vice-diretor vai revisar seu cadastro antes de liberar o acesso.
                Você receberá um e-mail quando for aprovado.</>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertTitle>Bem-vindo(a) ao SIGET!</AlertTitle>
            <AlertDescription>
              Estamos te redirecionando para o painel…
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <Mail className="size-3" />
            Enviamos um e-mail de confirmação para você
          </p>

          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="gap-1.5"
          >
            Ir para o login <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}