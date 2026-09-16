import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { GraduationCap, ArrowLeft } from "lucide-react"

import PassoDadosBasicos from "./sections/passodadosbasicos"
import Passo2FA from "./sections/passo2fa"
import PassoVerificacaoEmail from "./sections/passoverificacaoemail"
import PassoDadosPerfil from "./sections/passodadosperfil"
import PassoConcluido from "./sections/passoconcluido"

import { roles, roleMetadata } from "@/constants/roles"
import { Toaster } from "@/components/ui/sonner"

/**
 * Orquestrador do fluxo de cadastro.
 *
 * Passos:
 *   1. dados-basicos   → nome, e-mail, senha, confirmação, perfil
 *   2. dois-fa         → escolha do método de 2FA (apenas se exigido)
 *   3. verificacao     → código de 6 dígitos
 *   4. dados-perfil    → CNPJ (supervisor) ou matrícula (professor)
 *   5. concluido       → resumo + estado pendente/aprovado
 */
export default function CadastroPage() {
  const navigate = useNavigate()
  const [passo, setPasso] = useState(1)
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: "",
    role: roles.ALUNO,
    metodo2FA: null,
    extra: null,
  })

  /* Avança entre os passos, calculando se o 2FA é necessário */
  const proximo = (patch = {}) => {
    const merged = { ...dados, ...patch }
    setDados(merged)

    if (passo === 1) {
      const meta = roleMetadata[merged.role]
      // Se o perfil exige 2FA e ainda não foi escolhido, vai pro passo 2FA
      if (meta?.requer2FA && !merged.metodo2FA) return setPasso(2)
      return setPasso(3)
    }
    if (passo === 2) return setPasso(3) // escolheu 2FA → verificação
    if (passo === 3) {
      const meta = roleMetadata[merged.role]
      // Se há dados extra (empresa/matrícula), vai pro passo 4; senão conclui
      if (meta?.dadosExtra) return setPasso(4)
      return setPasso(5)
    }
    if (passo === 4) return setPasso(5)
  }

  const voltar = () => {
    if (passo === 1) return navigate("/login")
    setPasso((p) => Math.max(1, p - 1))
  }

  /* Progresso visual (1..5) */
  const passosVisiveis = (() => {
    const meta = roleMetadata[dados.role] || {}
    const arr = [1]
    if (meta.requer2FA) arr.push(2)
    arr.push(3)
    if (meta.dadosExtra) arr.push(4)
    arr.push(5)
    return arr
  })()
  const idx = passosVisiveis.indexOf(passo) + 1
  const totalPassos = passosVisiveis.length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header enxuto com logo e progresso */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/login" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-700">
              <GraduationCap className="size-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">SIGET</span>
          </Link>

          {/* Barra de progresso */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Passo {idx} de {totalPassos}
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${(idx / totalPassos) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Botão voltar (escondido no passo final) */}
        {passo < 5 && (
          <button
            type="button"
            onClick={voltar}
            className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="size-3.5" />
            Voltar
          </button>
        )}

        {passo === 1 && <PassoDadosBasicos dados={dados} onAvancar={proximo} />}
        {passo === 2 && <Passo2FA dados={dados} onAvancar={proximo} />}
        {passo === 3 && <PassoVerificacaoEmail dados={dados} onAvancar={proximo} />}
        {passo === 4 && <PassoDadosPerfil dados={dados} onAvancar={proximo} />}
        {passo === 5 && <PassoConcluido dados={dados} />}
      </main>

      <Toaster />
    </div>
  )
}