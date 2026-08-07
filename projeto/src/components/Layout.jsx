import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./app-sidebar";
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger } from "@/components/ui/sidebar";

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 items-center gap-2 border-b px-4">
              <SidebarTrigger/>
              <h1 className="font-semibold text-lg">SIGET CETEP Araci</h1>
            </header>
            <main className="p-6">
              {children}
            </main>
          </SidebarInset>
      </SidebarProvider> 
    );
}