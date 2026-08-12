import { navigationItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { AppSidebar } from "./app-sidebar";
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger,
  SidebarSeparator } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/theme-toggle";

export function Layout({ children }) {
  const { user } = useAuth()

    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
          <SidebarInset>
            {/* 2. Header Superior com Breadcrumb e Toggle */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="cursor-pointer hover:bg-slate-800" />
                <h2 className="text-sm font-medium text-slate-300 peer-data-[state=collapsed]:hidden">
                  {user?.role ? `Painel do ${user.role}` : 'Sistema Escolar'}
                </h2>
              </div>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </header>
            <main className="p-6">
              {children}
            </main>
          </SidebarInset>
      </SidebarProvider> 
    );
}