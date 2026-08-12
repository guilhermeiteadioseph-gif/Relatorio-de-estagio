import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { roles } from "../constants/roles";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

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
            setError("Credenciais inválidas. Tente novamente.");
        }
    };

    return (
    // Container principal: ocupa 100% da tela (min-h-screen) e não permite rolagem desnecessária
    <div className="w-full min-h-screen flex lg:grid lg:grid-cols-2 bg-background text-foreground">
      
      {/* ========================================
        LADO ESQUERDO: IMAGEM / DESTAQUE VISUAL
        ========================================
        Oculto no celular (hidden), aparece apenas em telas grandes (lg:block).
      */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
        
        {/* Você pode colocar uma imagem de fundo real aqui, ou manter uma cor sólida elegante */}
        {/* Exemplo de imagem de fundo com overlay escuro:
        <img 
          src="url-da-sua-imagem.jpg" 
          alt="Imagem da escola" 
          className="absolute inset-0 object-cover w-full h-full opacity-40 mix-blend-multiply" 
        /> 
        */}

        {/* Logo Superior Esquerdo */}
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <GraduationCap className="h-6 w-6" />
          SIGET CETEP ARACI
        </div>

        {/* Texto Inspiracional Inferior (como no seu protótipo) */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "A educação é o passaporte para o futuro, pois o amanhã pertence
              àqueles que se preparam para ele hoje."
            </p>
            <footer className="text-sm opacity-80">
              Sistema Integrado de Gestão Escolar e Tecnológica
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ========================================
        LADO DIREITO: FORMULÁRIO DE LOGIN
        ========================================
      */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        {/* Container que limita a largura do formulário para não ficar esticado */}
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          
          {/* Cabeçalho do Formulário */}
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acesse sua conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Insira seu email e senha abaixo para entrar no sistema
            </p>
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
                  <p className="text-sm font-medium text-destructive">{error}</p>
                )}

                {/* Botão Entrar */}
                <Button type="submit" className="w-full mt-2">
                  Entrar no sistema
                </Button>
              </div>
            </form>
          </div>

          {/* Rodapé Opcional */}
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao clicar em entrar, você concorda com nossos{" "}
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