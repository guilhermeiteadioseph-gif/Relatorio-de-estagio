/* ------------------------------------------------------------------ */
/*  Roles do sistema + metadados para o fluxo de cadastro             */
/* ------------------------------------------------------------------ */

export const roles = {
  ALUNO: "aluno",
  PROFESSOR: "professor",
  VICE_DIRETOR: "vice-diretor",
  SUPERVISOR: "supervisor",
  ASSISTENTE: "assistente",
}

/**
 * Metadados por perfil.
 *  - label          → nome amigável
 *  - requer2FA      → usuário obrigatoriamente escolhe um método 2FA
 *  - minSenha       → mínimo de caracteres (12 sem 2FA, 10 com 2FA)
 *  - precisaAprovacao → cadastro fica pendente até escola aprovar
 *  - dadosExtra     → etapa específica após verificação de e-mail
 */
export const roleMetadata = {
  [roles.ALUNO]: {
    label: "Estagiário",
    requer2FA: false,
    minSenha: 12,
    precisaAprovacao: false,
    dadosExtra: null,
  },
  [roles.SUPERVISOR]: {
    label: "Supervisor",
    requer2FA: false,
    minSenha: 12,
    precisaAprovacao: true,
    dadosExtra: "empresa", // CNPJ + dados da empresa
  },
  [roles.PROFESSOR]: {
    label: "Professor Orientador",
    requer2FA: false,
    minSenha: 12,
    precisaAprovacao: true,
    dadosExtra: "matricula", // Apenas matrícula
  },
  [roles.ASSISTENTE]: {
    label: "Assistente",
    requer2FA: false,
    minSenha: 12,
    precisaAprovacao: true,
    dadosExtra: null,
  },
  [roles.VICE_DIRETOR]: {
    label: "Vice-Diretor",
    requer2FA: true,
    minSenha: 10,
    precisaAprovacao: false,
    dadosExtra: null,
  },
}

/** Lista de perfis disponíveis no cadastro público. */
export const rolesDisponiveisCadastro = [
  roles.SUPERVISOR,
  roles.PROFESSOR,
  roles.ASSISTENTE,
]