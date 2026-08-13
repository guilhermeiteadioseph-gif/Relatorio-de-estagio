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
  SidebarHeader,
  SidebarTrigger,
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
      <Sidebar collapsible="icon" className="w-60 flex-shrink-0 flex flex-col shadow-lg z-10" style={{ backgroundColor: '#0F2744' }}>
        {/* 1. CABEÇALHO DA SIDEBAR */}
        <SidebarHeader className="px-5 py-5 border-b border-white/10">
          {/* Logo e Título do Sistema */}
          <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
            <div className="flex aspect-square w-8 h-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#1D4ED8' }}>
              <GraduationCap size={16} className="text-white" />
            </div>
            <div className="min-w-0 flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-white font-bold text-sm">
                SIGET
              </span>
              <span className="text-blue-300/70 text-[10px] leading-tight truncate capitalize">
                CETEP Araci
              </span>
            </div>
            <SidebarTrigger className="cursor-pointer ml-auto text-white" />
          </div>
        </SidebarHeader>

        <SidebarSeparator className="bg-white/10 hidden" />

        {/* 2. CONTEÚDO PRINCIPAL */}
        <SidebarContent className="flex-1 px-2.5 py-3 overflow-y-auto ">
          <SidebarGroup>
            <SidebarGroupContent className="space-y-0.5">
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
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left group text-slate-300/80 hover:text-white hover:bg-white/8"
                        >
                          {Icon && <Icon size={15} className="text-slate-400 group-hover:text-slate-200" />}
                          <span>{item.title}</span>
                          <ChevronDown className={`ml-auto size-[15px] text-slate-400 transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`} />
                        </SidebarMenuButton>

                        {isSubOpen && (
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.id || subItem.url}>
                                <SidebarMenuSubButton 
                                  onClick={() => navigate(subItem.url)}
                                  isActive={location.pathname === subItem.url}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left group mt-0.5 ${location.pathname === subItem.url ? 'bg-white/15 text-white' : 'text-slate-300/80 hover:text-white hover:bg-white/8'}`}
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
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left group ${isActive ? 'bg-white/15 text-white' : 'text-slate-300/80 hover:text-white hover:bg-white/8'}`}
                      >
                        {Icon && <Icon size={15} className={isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-200'} />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator className="bg-white/10 hidden" />

        {/* 3. RODAPÉ (PERFIL DO USUÁRIO LOGADO E LOGOUT) */}
        <SidebarFooter className="px-2.5 py-3 border-t border-white/10">
          <SidebarMenu className="space-y-0.5">
            {/* Configurações */}
            {(() => {
              const configItem = navItems.find(i => (i.title || "").toLowerCase().includes('configura'));
              if (!configItem) return null;
              const Icon = configItem.icon;
              const isActive = location.pathname === configItem.url;
              return (
                <SidebarMenuItem key={configItem.url}>
                  <SidebarMenuButton
                    onClick={() => navigate(configItem.url)}
                    tooltip={configItem.title}
                    isActive={isActive}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left group ${isActive ? 'bg-white/15 text-white' : 'text-slate-300/80 hover:text-white hover:bg-white/8'}`}
                  >
                    {Icon && <Icon size={15} className={isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-200'} />}
                    <span>{configItem.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })()}

            {/* Perfil do Usuário com menu */}
            <DropdownMenu>
              <SidebarMenuItem>
                <DropdownMenuTrigger render={(props) => (
                  <div {...props} className="group/menu-item relative flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 overflow-hidden rounded-lg text-left text-xs font-medium transition-all text-slate-300/80 hover:text-white hover:bg-white/8 outline-hidden">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-400 group-hover/menu-item:text-slate-200 transition-colors">
                      <User size={15} />
                    </div>
                    <div className="min-w-0 flex flex-col text-left leading-none truncate group-data-[collapsible=icon]:hidden">
                      <span className="text-white text-xs font-semibold leading-tight truncate">
                        {user?.nome || 'Usuário'}
                      </span>
                      <span className="text-blue-300/70 text-[10px] leading-tight truncate mt-0.5">
                        {user?.email || 'usuario@example.com'}
                      </span>
                    </div>
                  </div>
                )}
                />
              </SidebarMenuItem>
              
              <DropdownMenuContent side="right" align="center" sideOffset={8} className="w-56 bg-[#0F2744] border border-white/10 shadow-xl rounded-lg p-1">
                <DropdownMenuLabel className="text-white/40 text-[10px] uppercase tracking-wider font-medium px-2 py-1.5">
                  {user?.nome || 'Usuário'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem
                  className="flex items-center gap-2.5 px-2 py-2 rounded-md text-xs font-medium transition-all text-slate-400 hover:text-white hover:bg-white/8 cursor-pointer focus:bg-white/8 focus:text-white"
                  onClick={handleLogout}>
                  <LogOut size={15} />
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }