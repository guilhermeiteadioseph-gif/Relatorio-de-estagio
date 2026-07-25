import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Cabeçalho com o nome do sistema e botão de logout */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">SIGEP</h1>
            {user && (
              <div className="mt-4">
                <span className="mr-4">Bem-vindo, {user.name}!</span>
                <Button onClick={handleLogout}>Sair</Button>
              </div>
            )}
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    );
}