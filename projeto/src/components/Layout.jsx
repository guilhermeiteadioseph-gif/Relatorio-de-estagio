import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "./app-sidebar";
import { 
  SidebarProvider, 
  SidebarInset, } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/theme-toggle";

export function Layout({ children }) {
  const { user } = useAuth()

    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
          <SidebarInset className="transition-[margin-left] duration-200 ease-linear md:peer-data-[state=expanded]:ml-[var(--sidebar-width)] md:peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)]">
            {/* 2. Header Superior com Breadcrumb e Toggle */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-slate-300 md:peer-data-[state=collapsed]:hidden">
                  {user?.role ? `Painel do ${user.role}` : 'Sistema Escolar'}
                </h2>
              </div>
            </header>
            <main className="p-6">
              {children}
            </main>
          </SidebarInset>
      </SidebarProvider> 
    );
}