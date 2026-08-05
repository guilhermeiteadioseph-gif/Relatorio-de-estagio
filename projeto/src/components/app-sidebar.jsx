import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarHeader,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useAuth, AuthContext } from "../contexts/AuthContext";
import { link, useLocation } from "react-router";
import roles from "../constants/roles";

export function AppSidebar() {
    useAuth(AuthContext); // Hook para acessar o contexto de autenticação
    useLocation(); // Hook para obter a localização atual da rota


    return (
        <Sidebar collapsible="icon">
            <SidebarTrigger />
            <SidebarHeader />
                <h1>SIGET</h1>
            <SidebarContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}