import { useState } from 'react'
import { BrowserRouter, Router, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { FrequenciaProvider } from './contexts/FrequenciaContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { roles } from './constants/roles';
import { Navigate } from 'react-router';

const DashboardAluno = () => <h2>Dashboard do Aluno</h2>;
const DashboardProfessor = () => <h2>Dashboard do Professor</h2>;
const DashboardViceDiretor = () => <h2>Dashboard do Vice-Diretor</h2>;
const DashboardSupervisor = () => <h2>Dashboard do Supervisor</h2>;
const DashboardAssistente = () => <h2>Dashboard do Assistente</h2>;
const AccessDeniedPage = () => <h2>Acesso Negado</h2>;

import './App.css'
import { PaginaLogin } from './pages/Login';

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          
          <Route 
            path="/aluno/*" 
            element={
              <ProtectedRoute allowedRoles={[roles.ALUNO]}>
                <DashboardAluno />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/professor/*" 
            element={
              <ProtectedRoute allowedRoles={[roles.PROFESSOR]}>
                <DashboardProfessor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/vice-diretor/*" 
            element={
              <ProtectedRoute allowedRoles={[roles.VICE_DIRETOR]}>
                <DashboardViceDiretor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/supervisor/*" 
            element={
              <ProtectedRoute allowedRoles={[roles.SUPERVISOR]}>
                <DashboardSupervisor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/assistente/*" 
            element={
              <ProtectedRoute allowedRoles={[roles.ASSISTENTE]}>
                <DashboardAssistente />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </AuthProvider>
  );
}

