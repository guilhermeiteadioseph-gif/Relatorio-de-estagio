/**
 * Dados mockados do estagiário logado.
 *
 * Estrutura:
 *   - aluno:            dados cadastrais + curso + ciclo de matrícula
 *   - estagio:          dados do estágio (progresso, empresa, período)
 *   - responsaveis:     contatos do professor, supervisor e vice-diretor
 *   - frequencias:      registros de presença (data, entrada, saída, atividade)
 *   - relatorio:        status do relatório final + feedback do professor
 *   - autoavaliacao:    estado da autoavaliação (só liberada ao final)
 */

export const alunoMock = {
  /* -------------------------------------------------------------- */
  /*  DADOS DO ALUNO                                                 */
  /* -------------------------------------------------------------- */
  aluno: {
    id: 1,
    nome: "João Carlos Silva",
    matricula: "2023001",
    curso: "Técnico em Informática",
    cicloMatricula: "2024.2",
    turno: "Matutino",
    email: "joao.silva@aluno.cetep.br",
    telefone: "(75) 99876-1234",
    unidadeEscolar: "CETEP Araci",
  },

  /* -------------------------------------------------------------- */
  /*  DADOS DO ESTÁGIO                                               */
  /* -------------------------------------------------------------- */
  estagio: {
    status: "Em andamento", // "Em andamento" | "Finalizado"
    periodo: "01/08/2026 - 30/11/2026",
    dataInicio: "2026-08-01",
    dataFim: "2026-11-30",
    horasCumpridas: 400,
    horasTotais: 400,
    setor: "Desenvolvimento de Software",
    empresa: {
      nome: "TechSoft Solutions Ltda",
      municipio: "Araci",
      uf: "BA",
      cnpj: "12.345.678/0001-90",
      endereco: "Av. Getúlio Vargas, 123 - Centro, Araci/BA",
      responsavel: "Carlos Eduardo (Gerente de TI)",
    },
  },

  /* -------------------------------------------------------------- */
  /*  RESPONSÁVEIS (contatos)                                        */
  /* -------------------------------------------------------------- */
  responsaveis: {
    orientador: {
      nome: "Ricardo Almeida",
      cargo: "Professor Orientador",
      email: "ricardo.almeida@cetep.br",
      telefone: "(75) 99800-1122",
    },
    supervisor: {
      nome: "Carlos Eduardo",
      cargo: "Supervisor na Empresa",
      email: "carlos.eduardo@techsoft.com.br",
      telefone: "(75) 99777-3300",
    },
    viceDiretor: {
      nome: "Mariana Costa",
      cargo: "Vice-Diretora",
      email: "mariana.costa@cetep.br",
      telefone: "(75) 99666-4400",
    },
  },

  /* -------------------------------------------------------------- */
  /*  FREQUÊNCIAS (registros de presença)                            */
  /* -------------------------------------------------------------- */
  frequencias: [
    {
      id: 1,
      data: "01/10/2026",
      entrada: "08:00",
      saida: "17:00",
      atividade: "Desenvolvimento do módulo de autenticação do sistema interno.",
    },
    {
      id: 2,
      data: "02/10/2026",
      entrada: "08:00",
      saida: "17:00",
      atividade: "Revisão de código e testes unitários da API de usuários.",
    },
    {
      id: 3,
      data: "03/10/2026",
      entrada: "08:00",
      saida: "17:00",
      atividade: "Reunião com o time de produto e ajustes na documentação técnica.",
    },
    {
      id: 4,
      data: "04/10/2026",
      entrada: "08:00",
      saida: "17:00",
      atividade: "Implementação de melhorias no painel administrativo.",
    },
    {
      id: 5,
      data: "05/10/2026",
      entrada: "08:00",
      saida: "12:00",
      atividade: "Sessão de code review com o supervisor e ajustes finais.",
    },
  ],

  /* -------------------------------------------------------------- */
  /*  RELATÓRIO FINAL                                                */
  /* -------------------------------------------------------------- */
  relatorio: {
    // status possíveis:
    //   "nao-enviado"       → aluno ainda não submeteu
    //   "em-analise"        → enviado, aguardando professor
    //   "devolvido"         → professor pediu correções
    //   "aprovado"          → professor aprovou e encaminhou ao vice-diretor
    //   "nota-atribuida"    → vice-diretor atribuiu a nota final
    status: "devolvido",
    arquivoNome: "relatorio_final_joao_silva.pdf",
    dataEnvio: "2026-10-15T10:30:00",
    feedbackProfessor:
      "Ajustar a formatação das referências bibliográficas conforme a ABNT NBR 6023. Corrigir também a numeração das figuras.",
    dataFeedback: "2026-10-16T14:20:00",
    notaFinal: null, // preenchida quando o vice-diretor atribuir
  },

  /* -------------------------------------------------------------- */
  /*  AUTOAVALIAÇÃO (só libera quando o estágio terminar)            */
  /* -------------------------------------------------------------- */
  autoavaliacao: {
    // Só fica "disponivel: true" quando o estágio é finalizado
    disponivel: true,
    status: "pendente", // "pendente" | "respondida"
    respondidaEm: null,
    respostas: null,
  },
}