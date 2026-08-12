import * as React from "react"
import { useNavigate, useLocation } from "react-router"
import { useAuth } from "../contexts/AuthContext" // Ajuste o caminho se necessário
import { navigationItems } from "../constants/navigation" // Importa a lista centralizada de abas

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
  Search,
  Settings,
  User,
  LogOut,
  GraduationCap,
  ChevronDown
} from "lucide-react"

export function AppSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

    // Estado para controlar submenus colapsáveis (caso algum item do navigation.js tenha filhos)
    const [openSubmenu, setOpenSubmenu] = React.useState({})

    // Puxa as abas do perfil atual (ex: 'aluno', 'professor', 'supervisor')
    const userRole = user?.role?.toLowerCase() || 'aluno'
    const navItems = navigationItems[userRole] || []

    const toggleSubmenu = (itemId) => {
      setOpenSubmenu((prev) => ({ ...prev, [itemId]: !prev[itemId] }))
    }

    const handleLogout = () => {
      if (logout) logout()
      navigate('/login')
    }

    return (
      <Sidebar collapsible="icon">
        {/* 1. CABEÇALHO DA SIDEBAR */}
        <SidebarHeader className="p-4 gap-4">
          {/* Logo e Título do Sistema */}
          <div className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:justify-center">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5 text-slate-100" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sm tracking-tight text-sidebar-foreground">
                SIGET
              </span>
              <span className="text-[10px] text-sidebar-foreground/60 capitalize">
                CETEP Araci
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        {/* 2. CONTEÚDO PRINCIPAL (Mapeamento Dinâmico do navigation.js) */}
        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3">Menu Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems
                  .filter(i => !(i.title || "").toLowerCase().includes('configura'))
                  .map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.url
                  const hasSubItems = item.items && item.items.length > 0
                  const isSubOpen = !!openSubmenu[item.id]

                  // Caso o item do menu possua sub-itens
                  if (hasSubItems) {
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          onClick={() => toggleSubmenu(item.id)}
                          tooltip={item.title}
                        >
                          {Icon && <Icon className="text-sidebar-foreground/70" />}
                          <span>{item.title}</span>
                          <ChevronDown className={`ml-auto size-3.5 transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`} />
                        </SidebarMenuButton>

                        {isSubOpen && (
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.id || subItem.url}>
                                <SidebarMenuSubButton 
                                  onClick={() => navigate(subItem.url)}
                                  isActive={location.pathname === subItem.url}
                                >
                                  <span>{subItem.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    )
                  }

                  // Item simples de navegação (sem sub-itens)
                  return (
                    <SidebarMenuItem key={item.id || item.url}>
                      <SidebarMenuButton 
                        onClick={() => navigate(item.url)}
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        {Icon && <Icon className="text-sidebar-foreground/70" />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        {/* 3. RODAPÉ (PERFIL DO USUÁRIO LOGADO E LOGOUT) */}
        <SidebarFooter className="p-3">
          <SidebarMenu>
            {/* Configurações (usa rota definida em navigation.js) */}
            {(() => {
              const configItem = navItems.find(i => (i.title || "").toLowerCase().includes('configura'));
              if (!configItem) return null;
              const Icon = configItem.icon;
              return (
                <SidebarMenuItem key={configItem.url}>
                  <SidebarMenuButton
                    onClick={() => navigate(configItem.url)}
                    tooltip={configItem.title}
                    isActive={location.pathname === configItem.url}
                  >
                    {Icon && <Icon className="text-sidebar-foreground/70" />}
                    <span>{configItem.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })()}

            {/* Perfil do Usuário com menu */}
            <DropdownMenu>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <div className="group/menu-item relative flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-accent-foreground/10">
                      <User className="size-4 text-sidebar-foreground" />
                    </div>
                    <div className="flex flex-col text-left leading-none ml-1 truncate group-data-[collapsible=icon]:hidden">
                      <span className="font-medium text-xs truncate">
                        {user?.nome || 'Usuário'}
                      </span>
                      <span className="text-[10px] text-sidebar-foreground/50 mt-0.5 truncate">
                        {user?.email || 'usuario@cetep.edu.br'}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
              </SidebarMenuItem>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel>{user?.nome || 'Usuário'}</DropdownMenuLabel>
                {(() => {
                  const configItem = navItems.find(i => (i.title || "").toLowerCase().includes('configura'));
                  if (!configItem) return null;
                  return (
                    <DropdownMenuItem
                      className="gap-2"
                      onSelect={() => navigate(configItem.url)}>
                      <Settings className="size-4" />
                      Configurações
                    </DropdownMenuItem>
                  )
                })()}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2"
                  onSelect={handleLogout}>
                  <LogOut className="size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }