import { useState } from 'react'
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FrequenciaProvider } from './contexts/FrequenciaContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Roles } from './constants/roles';

const LoginPage = () => <h2>Tela de Login</h2>;
const DashboardAluno = () => <h2>Dashboard do Aluno</h2>;
const DashboardProfessor = () => <h2>Dashboard do Professor</h2>;
const DashboardViceDiretor = () => <h2>Dashboard do Vice-Diretor</h2>;
const DashboardSupervisor = () => <h2>Dashboard do Supervisor</h2>;
const DashboardAssistente = () => <h2>Dashboard do Assistente</h2>;
const AccessDeniedPage = () => <h2>Acesso Negado</h2>;

import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          
          <Route 
            path="/aluno/*" 
            element={
              <ProtectedRoute allowedRoles={[Roles.ALUNO]}>
                <DashboardAluno />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/professor/*" 
            element={
              <ProtectedRoute allowedRoles={[Roles.PROFESSOR]}>
                <DashboardProfessor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/vice-diretor/*" 
            element={
              <ProtectedRoute allowedRoles={[Roles.VICE_DIRETOR]}>
                <DashboardViceDiretor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/supervisor/*" 
            element={
              <ProtectedRoute allowedRoles={[Roles.SUPERVISOR]}>
                <DashboardSupervisor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/assistente/*" 
            element={
              <ProtectedRoute allowedRoles={[Roles.ASSISTENTE]}>
                <DashboardAssistente />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

