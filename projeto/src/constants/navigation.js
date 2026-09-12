import {
    User, Clock, FileText, CheckSquare,
    GraduationCap, ClipboardCheck,
    Building, CheckCircle,
    Users, Settings,
    LayoutPanelLeft
} from 'lucide-react';

export const navigationItems = {
    aluno: [
        { title: 'Painel', url: '/aluno/painel', icon: LayoutPanelLeft },
        { title: 'Minhas Frequências', url: '/aluno/frequencias', icon: User },
        { title: 'Documentos e Relatórios', url: '/aluno/relatorio', icon: FileText },
        { title: 'Autoavaliação', url: '/aluno/autoavaliacao', icon: CheckSquare },
        { title: 'Configurações', url: '/aluno/configuracoes', icon: Settings },
    ],
    supervisor: [
        { title: 'Painel', url: '/supervisor/painel', icon: LayoutPanelLeft },
        { title: 'Avaliação do Estágio', url: '/supervisor/avaliacao', icon: Clock },
        { title: 'Configurações', url: '/supervisor/configuracoes', icon: Settings },
    ],
    professor: [
        { title: 'Meus Orientandos', url: '/professor/orientandos', icon: User },
        { title: 'Configurações', url: '/professor/configuracoes', icon: Settings },
    ],
    assistente: [
        { title: 'Painel', url: '/assistente/painel', icon: LayoutPanelLeft },
        { title: 'Gerenciar Estagiários', url: '/assistente/gerenciar-estagiarios', icon: Users },
        { title: 'Avaliaçãões de Estágio', url: '/assistente/avaliacoes-estagio', icon: CheckSquare },
        { title: 'Documentos e Relatórios', url: '/assistente/relatorios', icon: FileText },
        { title: 'Fichas de Frequência', url: '/assistente/fichas-frequencia', icon: ClipboardCheck },
        { title: 'Configurações', url: '/assistente/configuracoes', icon: Settings },
    ],
    vice_diretor: [
        { title: 'Painel', url: '/vice-diretor/painel', icon: LayoutPanelLeft },
        { title: 'Usuários', url: '/vice-diretor/usuarios', icon: Users },
        { title: 'Fichas de Frequência', url: '/vice-diretor/frequencias', icon: ClipboardCheck },
        { title: 'Empresas', url: '/vice-diretor/empresas', icon: Building },
        { title: 'Cursos Técnicos', url: '/vice-diretor/cursos', icon: GraduationCap },
        { title: 'Configurações', url: '/vice-diretor/configuracoes', icon: Settings },
    ],
}
