import { useState } from 'react'
import { Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { FrequenciaProvider } from './contexts/FrequenciaContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { roles } from './constants/roles';
import { Navigate } from 'react-router';

import LayoutEstagiario from './pages/aluno/layoutaluno';
import LayoutProfessor from './pages/professor/layoutprofessor';
import LayoutSupervisor from './pages/supervisor/layoutsupervisor';
import LayoutViceDiretor from './pages/vice-diretor/layoutvicediretor';

const DashboardAssistente = () => <h2>Dashboard do Assistente</h2>;
const AccessDeniedPage = () => <h2>Acesso Negado</h2>;

import './App.css'
import { PaginaLogin } from './pages/Login';

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <FrequenciaProvider>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          
            <Route 
            path="/aluno" 
            element={
              <ProtectedRoute allowedRoles={[roles.ALUNO]}>
                <LayoutEstagiario />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/aluno/:tab" 
            element={
              <ProtectedRoute allowedRoles={[roles.ALUNO]}>
                <LayoutEstagiario />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/professor" 
            element={
              <ProtectedRoute allowedRoles={[roles.PROFESSOR]}>
                <LayoutProfessor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/:tab" 
            element={
              <ProtectedRoute allowedRoles={[roles.PROFESSOR]}>
                <LayoutProfessor />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/supervisor" 
            element={
              <ProtectedRoute allowedRoles={[roles.SUPERVISOR]}>
                <LayoutSupervisor />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/supervisor/:tab" 
            element={
              <ProtectedRoute allowedRoles={[roles.SUPERVISOR]}>
                <LayoutSupervisor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/vice-diretor" 
            element={
              <ProtectedRoute allowedRoles={[roles.VICE_DIRETOR]}>
                <LayoutViceDiretor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/vice-diretor/:tab" 
            element={
              <ProtectedRoute allowedRoles={[roles.VICE_DIRETOR]}>
                <LayoutViceDiretor />
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
      </FrequenciaProvider>
    </AuthProvider>
  );
}

