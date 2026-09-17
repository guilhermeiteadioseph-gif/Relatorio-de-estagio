import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { roles } from "../constants/roles";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  ClipboardList,
  Award,
  UserPlus,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";

export function PaginaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  /**
   * Controla a visibilidade do campo de senha.
   * `false` → type="password" (oculto)
   * `true`  → type="text"     (visível)
   */
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const usuarioLogado = login(email, senha);

    if (usuarioLogado) {
      if (usuarioLogado.role === roles.ALUNO) {
        navigate("/aluno");
      } else if (usuarioLogado.role === roles.PROFESSOR) {
        navigate("/professor");
      } else if (usuarioLogado.role === roles.VICE_DIRETOR) {
        navigate("/vice-diretor");
      } else if (usuarioLogado.role === roles.SUPERVISOR) {
        navigate("/supervisor");
      } else if (usuarioLogado.role === roles.ASSISTENTE) {
        navigate("/assistente");
      }
    } else {
      setError("Email ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: "#0F2744" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
            style={{ backgroundColor: "#1D4ED8" }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10"
            style={{ backgroundColor: "#1D4ED8" }}
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#1D4ED8" }}
            >
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">SIGET</div>
              <div className="text-blue-300/70 text-xs">
                Sistema Integrado de Gestão de Estágio Técnico
              </div>
            </div>
          </div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-3">
            Gerencie seu estágio com simplicidade e praticidade
          </h2>
          <p className="text-blue-200/70 text-sm leading-relaxed max-w-xs">
            Plataforma oficial do CETEP Araci para registro de frequência,
            acompanhamento e relatório de estágio supervisionado.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {[
            { icon: ClipboardList, text: "Registro de frequência" },
            { icon: FileText, text: "Relatório Final" },
            { icon: Award, text: "Avaliação de Estágio" },
            { icon: UserPlus, text: "Cadastro de Estagiários" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2.5 rounded-xl p-3"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            >
              <Icon size={14} className="text-blue-300 flex-shrink-0" />
              <span className="text-blue-100/80 text-xs">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LADO DIREITO — FORMULÁRIO */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Bem-vindo(a)</h1>
            <p className="text-slate-500 text-sm mt-1">
              Faça login para acessar o sistema
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                {/* E-mail */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-left">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Senha — com botão mostrar/ocultar à direita */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="senha">Senha</Label>
                      <Link
                        to="/recuperar-senha"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                  </div>

                  {/*
                    Wrapper `relative` posiciona o botão dentro do input.
                    `pr-9` reserva espaço para o ícone não cobrir o texto.
                  */}
                  <div className="relative">
                    <Input
                      id="senha"
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      autoComplete="current-password"
                      className="pr-9"
                    />

                    <button
                      type="button"
                      onClick={() => setMostrarSenha((v) => !v)}
                      aria-label={
                        mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                      }
                      title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                      className={[
                        "absolute top-1/2 right-1.5 -translate-y-1/2",
                        "inline-flex size-7 items-center justify-center rounded-md",
                        "text-slate-400 transition-colors",
                        "hover:bg-slate-100 hover:text-slate-700",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                      ].join(" ")}
                    >
                      {mostrarSenha ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Erro */}
                {error && (
                  <p className="text-sm font-medium text-red-500 text-destructive">
                    {error}
                  </p>
                )}

                {/* Botão Entrar */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer"
                  style={{ backgroundColor: "#1D4ED8" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1e40af")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1D4ED8")
                  }
                >
                  Entrar
                </button>
              </div>
            </form>

            {/* Divisor "ou" */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">ou</span>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500">
              Não é um usuário?{" "}
              <Link
                to="/cadastro"
                className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Crie sua conta aqui
              </Link>
            </p>
          </div>

          {/* Rodapé */}
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao usar o site, você concorda com nossos{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}