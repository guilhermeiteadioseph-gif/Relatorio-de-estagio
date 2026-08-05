import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFrequencia } from "../../contexts/FrequenciaContext";
import { Layout } from "../../components/Layout";

// Componentes Shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "../../components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function DashboardAluno() {
  const { user } = useAuth();
  const { frequencias, marcarFrequencia } = useFrequencia();
  const [justificativa, setJustificativa] = useState("");
  
  const handleMarcarFrequencia = () => {
    marcarFrequencia(justificativa);
    setJustificativa("");
  };

  return (
    <Layout>
        <div style={{ display: 'flex' }}>
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>
        </div>
    </Layout>
  );
};