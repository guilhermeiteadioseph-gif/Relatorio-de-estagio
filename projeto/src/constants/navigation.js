import {
    User, Clock, FileText, CheckSquare,
    GraduationCap, ClipboardCheck, MessageSquare,
    Building, CheckCircle,
    Users, Settings, BarChart3,
    LayoutPanelLeft
} from 'lucide-react';

export const navigationItems = {
    aluno: [
        { title: 'Painel', url: '/aluno/painel', icon: LayoutPanelLeft },
        { title: 'Minhas Frequências', url: '/aluno/frequencias', icon: User },
        { title: 'Registrar Frequência', url: '/aluno/frequencia/registrar', icon: Clock },
        { title: 'Documentos e Relatórios', url: '/aluno/documentos', icon: FileText },
        { title: 'Autoavaliação', url: '/aluno/autoavaliação', icon: CheckSquare },
        { title: 'Avaliação do Supervisor', url: '/aluno/avaliacao-supervisor', icon: CheckSquare },
        { title: 'Avaliação do Professor', url: '/aluno/avaliacao-professor', icon: CheckSquare },
    ],
    supervisor: [
        { title: 'Painel', url: '/supervisor/painel', icon: LayoutPanelLeft },
        { title: 'Meus Estagiários', url: '/supervisor/estagiarios', icon: User },
        { title: 'Documentos e Relatórios', url: '/supervisor/relatorios', icon: FileText },
        { title: 'Frequências', url: '/supervisor/frequencias', icon: Clock },
        { title: 'Validação do Estágio', url: '/supervisor/estagiarios/validacao', icon: Clock },
    ],
    professor: [
        { title: 'Painel', url: '/professor/painel', icon: LayoutPanelLeft },
        { title: 'Meus Orientandos', url: '/professor/orientandos', icon: User },
        { title: 'Documentos e Relatórios', url: '/professor/relatorios', icon: FileText },
        { title: 'Avaliação de Estágio', url: '/professor/avaliacao-estagio', icon: CheckSquare },
    ],
    assistente: [
        { title: 'Painel', url: '/assistente/painel', icon: LayoutPanelLeft },
        { title: 'Gerenciar Estagiários', url: '/assistente/gerenciar-estagiarios', icon: Users },
        { title: 'Avaliaçãões de Estágio', url: '/assistente/avaliacoes-estagio', icon: CheckSquare },
        { title: 'Documentos e Relatórios', url: '/assistente/relatorios', icon: FileText },
        { title: 'Fichas de Frequência', url: '/assistente/fichas-frequencia', icon: ClipboardCheck },
    ],
    vice_diretor: [
        { title: 'Painel', url: '/vice-diretor/painel', icon: LayoutPanelLeft },
        { title: 'Gerenciar Estagiários', url: '/vice-diretor/gerenciar-estagiarios', icon: Settings },
        { title: 'Fichas de Frequência', url: '/vice-diretor/fichas-frequencia', icon: ClipboardCheck },
        { title: 'Avaliações de Estágio', url: '/vice-diretor/gerenciar-avaliacoes', icon: CheckCircle },
        { title: 'Documentos e Relatórios', url: '/vice-diretor/relatorios', icon: FileText },
        { title: 'Usuários', url: '/vice-diretor/gerenciar-usuarios', icon: Users },
        { title: 'Empresas', url: '/vice-diretor/gerenciar-empresas', icon: Building },
        { title: 'Cursos', url: '/vice-diretor/gerenciar-cursos', icon: GraduationCap },
    ],
}
