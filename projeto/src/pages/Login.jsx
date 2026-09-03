import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { roles } from "../constants/roles";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ClipboardList, Award, UserPlus, FileText } from "lucide-react";

export function PaginaLogin() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const usuarioLogado = login(email,senha);

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
    // Container principal: ocupa 100% da tela (min-h-screen) e não permite rolagem desnecessária
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden" style={{ backgroundColor: '#0F2744' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#1D4ED8' }} />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#1D4ED8' }} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1D4ED8' }}><GraduationCap size={22} className="text-white" /></div>
            <div>
              <div className="text-white font-bold text-lg">SIGET</div>
              <div className="text-blue-300/70 text-xs">Sistema Integrado de Gestão de Estágio Técnico</div>
            </div>
          </div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-3">Gerencie seu estágio com simplicidade e praticidade</h2>
          <p className="text-blue-200/70 text-sm leading-relaxed max-w-xs">Plataforma oficial do CETEP Araci para registro de frequência, acompanhamento e relatório de estágio supervisionado.</p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {[
            { icon: ClipboardList, text: 'Registro de frequência' }, { icon: FileText, text: 'Relatório Final' },
            { icon: Award, text: 'Avaliação de Estágio' }, { icon: UserPlus, text: 'Cadastro de Estagiários' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
              <Icon size={14} className="text-blue-300 flex-shrink-0" />
              <span className="text-blue-100/80 text-xs">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================
        LADO DIREITO: FORMULÁRIO DE LOGIN
        ========================================
      */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white">
        {/* Container que limita a largura do formulário para não ficar esticado */}
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          
          {/* Cabeçalho do Formulário */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Bem-vindo(a)</h1>
            <p className="text-slate-500 text-sm mt-1">Faça login para acessar o sistema</p>
          </div>

          {/* O Formulário propriamente dito */}
          <div className="grid gap-6">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                
                {/* Campo Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-left">Email</Label>
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
                
                {/* Campo Senha */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="senha">Senha</Label>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>

                {/* Exibição de Erros */}
                {error && (
                  <p className="text-sm text-red-500 font-medium text-destructive">{error}</p>
                )}

                {/* Botão Entrar */}
                <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer"
                style={{ backgroundColor: '#1D4ED8' }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e40af')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1D4ED8')}>
                Entrar
              </button>
              </div>
            </form>
          </div>

          {/* Rodapé Opcional */}
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao usar o site, você concorda com nossos{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>

    </div>
  )
}