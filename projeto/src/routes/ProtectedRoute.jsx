import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Usuário não autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Usuário autenticado, mas não possui a role necessária, redireciona para a página de acesso negado
    return <Navigate to="/access-denied" replace />;
  }

  // Usuário autenticado e possui a role necessária, renderiza o conteúdo protegido
  return children;
};