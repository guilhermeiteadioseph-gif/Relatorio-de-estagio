import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth, AuthContext } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router";
import { navigationItems } from "../constants/navigation";
import { LogOut } from "lucide-react";

export function AppSidebar() {
    const { user, logout } = useAuth(AuthContext);
    const location = useLocation();

    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    
    const menuItems = user?.role ? navigationItems[user.role] || [] : [];
    
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1 font-bold text-sm truncate">
                    SIGET
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {!isCollapsed && (
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    )}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => { 
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton tooltip={item.title}
                                        render={
                                            <Link to={item.url} className="flex items-center gap-2 w-full">
                                                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                                                {!isCollapsed && <span className="truncate">{item.title}</span>}
                                            </Link>
                                        }
                                    />
                                    </SidebarMenuItem>
                            )})}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    {!isCollapsed && <SidebarGroupLabel>Conta</SidebarGroupLabel>}

                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={logout} tooltip="Sair">
                                    <LogOut className="w-4 h-4 shrink-0" />
                                    {!isCollapsed && <span>Sair</span>}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter />
        </Sidebar>
    )
}