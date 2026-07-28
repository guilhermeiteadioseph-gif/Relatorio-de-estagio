import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { roles } from "../constants/roles";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login SIGEP</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label> 
                            <Input
                                id="email"
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="senha">Senha</Label>
                            <Input
                                id="senha"
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}