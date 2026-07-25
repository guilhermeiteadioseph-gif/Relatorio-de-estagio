import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roles } from '../constants/roles';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockUsers[0]); // Usuário padrão para simulação
  const navigate = useNavigate();

    const login = (email, senha) => {
    // Simulação de login
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return foundUser; // Login bem-sucedido
    }
    return null; // Login falhou
  };

  const logout = () => {
    setUser(null);
    navigate('/login'); // Redireciona para a página de login após logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);