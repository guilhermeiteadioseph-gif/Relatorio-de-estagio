import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/sonner"
import { Loader2, Mail, Lock, User, Info, Eye, EyeOff } from "lucide-react"

import { roles, roleMetadata, rolesDisponiveisCadastro } from "@/constants/roles"
import { validarEmail, validarSenha } from "@/utils/validacao"
import { verificarSenhaVazada } from "@/utils/apis"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Passo 1 — Dados básicos do cadastro.
 *
 * Valida nome completo, e-mail, senha por perfil (12/10 chars + HIBP)
 * e confirmação. O botão "olho" revela AMBOS os campos de senha ao
 * mesmo tempo (Senha + Confirmar senha).
 */
export default function PassoDadosBasicos({ dados, onAvancar }) {
  const { registrar } = useAuth()

  const [nome, setNome] = useState(dados.nome || "")
  const [email, setEmail] = useState(dados.email || "")
  const [senha, setSenha] = useState(dados.senha || "")
  const [confirmacao, setConfirmacao] = useState("")
  const [role, setRole] = useState(dados.role || roles.ALUNO)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState("")

  /**
   * Controla a visibilidade das senhas.
   * Um único estado → um clique revela/oculta os DOIS campos de senha.
   */
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const meta = roleMetadata[role]

  /* ---------------- Handlers ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro("")

    // 1. Nome completo
    if (!nome.trim() || nome.trim().split(/\s+/).length < 2) {
      setErro("Informe o nome completo (nome e sobrenome).")
      return
    }

    // 2. E-mail
    if (!validarEmail(email)) {
      setErro("Informe um e-mail válido.")
      return
    }

    // 3. Senha conforme perfil
    const { valida, erro: erroSenha } = validarSenha(senha, meta.requer2FA)
    if (!valida) return setErro(erroSenha)

    // 4. Confirmação
    if (senha !== confirmacao) {
      setErro("As senhas não coincidem.")
      return
    }

    // 5. HIBP — verificação anti-vazamento
    setCarregando(true)
    const { vazada, contagem } = await verificarSenhaVazada(senha)
    if (vazada) {
      setCarregando(false)
      return setErro(
        `Esta senha apareceu em vazamentos públicos (${contagem.toLocaleString()} vezes). Escolha outra.`
      )
    }

    // 6. Chama o "backend" (AuthContext)
    const res = await registrar({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
      role,
    })
    setCarregando(false)

    if (!res.ok) {
      setErro("Não foi possível iniciar o cadastro. Tente novamente.")
      return
    }

    toast.success("Verifique seu e-mail", "Enviamos um código de 6 dígitos.")
    onAvancar({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
      role,
    })
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Criar sua conta</CardTitle>
        <CardDescription>
          Preencha seus dados. Você receberá um código por e-mail para confirmar.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ------------------------------------------------------ */}
          {/* Perfil — cards em grid com altura uniforme              */}
          {/* ------------------------------------------------------ */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Você é:</Label>

            {/*
              Grid responsivo:
                - 1 coluna no mobile (empilhado)
                - 3 colunas a partir de `sm` (alinhados lado a lado)
              Cada card tem `min-h-[52px]` para alinhar visualmente,
              independente do tamanho do texto do label.
            */}
            <RadioGroup
              value={role}
              onValueChange={setRole}
              disabled={carregando}
              className="grid grid-cols-1 gap-2 sm:grid-cols-3"
            >
              {rolesDisponiveisCadastro.map((r) => {
                const ativo = role === r
                return (
                  <label
                    key={r}
                    htmlFor={`role-${r}`}
                    className={[
                      // Base: card clicável, altura fixa, conteúdo centrado
                      "flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg border px-3 py-2",
                      "transition-all select-none",
                      // Estado ativo
                      ativo
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500/20"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                      // Desabilitado
                      carregando && "pointer-events-none opacity-60",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <RadioGroupItem id={`role-${r}`} value={r} className="shrink-0" />
                    <span
                      className={[
                        "text-xs font-medium leading-tight",
                        ativo ? "text-blue-700" : "text-slate-700",
                      ].join(" ")}
                    >
                      {roleMetadata[r].label}
                    </span>
                  </label>
                )
              })}
            </RadioGroup>
          </div>

          {/* Nome */}
          <div className="space-y-1.5">
            <Label htmlFor="nome" className="flex items-center gap-1.5">
              <User className="size-3.5 text-slate-400" /> Nome completo
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Maria Fernanda dos Santos"
              disabled={carregando}
              autoComplete="name"
            />
          </div>

          {/* E-mail */}
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
              disabled={carregando}
              autoComplete="email"
            />
          </div>

          {/* ------------------------------------------------------ */}
          {/* Senha + Confirmação                                     */}
          {/* ------------------------------------------------------ */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Campo Senha — com botão de olho à direita */}
            <div className="space-y-1.5">
              <Label htmlFor="senha" className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-slate-400" /> Senha
              </Label>

              {/*
                Envolvemos o <Input> em um <div relative> para poder
                posicionar o botão de olho de forma absoluta dentro do campo.
                O `pr-9` no input reserva espaço para o ícone não sobrepor
                o texto digitado.
              */}
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={carregando}
                  autoComplete="new-password"
                  className="pr-9"
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  disabled={carregando}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Exibir senha"}
                  title={mostrarSenha ? "Ocultar senha" : "Exibir senha"}
                  className={[
                    // Posicionamento absoluto à direita, centralizado verticalmente
                    "absolute top-1/2 right-1.5 -translate-y-1/2",
                    // Aparência: ícone pequeno, com hover discreto
                    "inline-flex size-7 items-center justify-center rounded-md",
                    "text-slate-400 transition-colors",
                    "hover:bg-slate-100 hover:text-slate-700",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  ].join(" ")}
                >
                  {mostrarSenha ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              <p className="flex items-start gap-1 text-[11px] text-slate-500">
                <Info className="mt-0.5 size-3 shrink-0" />
                Mínimo de {meta.minSenha} caracteres
                {meta.requer2FA ? " (perfil com 2FA)" : ""}. Espaços e
                caracteres especiais são permitidos.
              </p>
            </div>

            {/* Campo Confirmar senha — segue o mesmo estado de visibilidade */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmacao" className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-slate-400" /> Confirmar senha
              </Label>
              <Input
                id="confirmacao"
                type={mostrarSenha ? "text" : "password"}
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                disabled={carregando}
                autoComplete="new-password"
              />
            </div>
          </div>

          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {carregando ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Verificando...
              </>
            ) : (
              "Continuar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}