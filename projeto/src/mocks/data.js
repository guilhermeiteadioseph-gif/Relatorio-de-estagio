import { roles } from '../constants/roles.js'

export const mockUsers = [
    {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        role: roles.ALUNO
    },
    {
        id: 2,
        name: 'Maria Oliveira',
        email: 'maria.oliveira@example.com',
        role: roles.PROFESSOR
    },
    {
        id: 3,
        name: 'Carlos Santos',
        email: 'carlos.santos@example.com',
        role: roles.SUPERVISOR
    },
    {
        id: 4,
        name: 'Ana Costa',
        email: 'ana.costa@example.com',
        role: roles.ASSISTENTE
    },
    {
        id: 5,
        name: 'Pedro Almeida',
        email: 'pedro.almeida@example.com',
        role: roles.VICE_DIRETOR
    }
]

export const mockFrequencias = [
    {
        id: 'freq_1',
        alunoId: 1,
        date: '2026-06-01',
        horaEntrada: '08:00',
        horaSaida: '12:00',
        horasCumpridas: 4,
        atividade: 'Atividade A',
        status: 'Presente' // Pendente, Presente, Ausente
    }
]

export const mockRelatorios = [
    {
        id: 'rel_1',
        alunoId: 1,
        mesReferencias: 'Fevereiro/2026',
        totalHoras: 20,
        titulo: 'Relatório de Atividade A',
        conteudo: 'Descrição detalhada da atividade A realizada pelo aluno.',
        validadoPeloProfessor: true,
        aprovadoPeloViceDiretor: false,
        status: 'Pendente' // Pendente, Aprovado, Rejeitado
    }
]