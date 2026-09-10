/**
 * Dados mockados dos estagiários supervisionados.
 *
 * A estrutura de `questionario.respostas` segue EXATAMENTE a Ficha de
 * Avaliação de Desempenho do Estagiário (SURPROT/IF):
 *
 *   - 4 itens de avaliação da concedente + avaliação final
 *   - 7 itens de aspectos do estagiário + avaliação final
 *   - Observações
 *   - Assinatura (nome, local, data)
 *
 * Escala: "otimo" | "bom" | "regular" | "insuficiente"
 */

/* Gerador simples de frequências fictícias. */
function gerarFrequencias(qtd = 12, ano = 2026, mes = 10) {
  const registros = []
  for (let i = 0; i < qtd; i++) {
    const dia = String(i + 1).padStart(2, "0")
    const entrada = "08:00"
    const saida = i % 5 === 4 ? "12:00" : "17:00"
    const horas = i % 5 === 4 ? 4 : 8
    registros.push({
      id: i + 1,
      data: `${dia}/${String(mes).padStart(2, "0")}/${ano}`,
      entrada,
      saida,
      horas,
    })
  }
  return registros
}

export const estagiariosMock = [
  {
    id: 1,
    nome: "João Carlos Silva",
    matricula: "2023001",
    curso: "Técnico em Informática",
    unidadeEscolar: "CETEP Araci",
    email: "joao.silva@aluno.cetep.br",
    telefone: "(75) 99876-1234",
    setor: "Desenvolvimento de Software",
    status: "Ativo",
    periodoEstagio: "01/08/2026 - 30/11/2026",
    horasCumpridas: 187,
    horasTotais: 400,
    supervisor: "Ricardo Almeida",
    telefoneOrientador: "(75) 99800-1122",
    emailOrientador: "ricardo.almeida@techsoft.com.br",
    empresa: {
      nome: "TechSoft Solutions Ltda",
      municipio: "Araci",
      cnpj: "12.345.678/0001-90",
      endereco: "Av. Getúlio Vargas, 123 - Centro, Araci/BA",
      responsavel: "Carlos Eduardo (Gerente de TI)",
    },
    frequencias: gerarFrequencias(12),
    questionario: {
      status: "pendente",
      respondidoEm: null,
      respostas: null,
    },
  },
  {
    id: 2,
    nome: "Maria Fernanda Santos",
    matricula: "2023002",
    curso: "Técnico em Informática",
    unidadeEscolar: "CETEP Araci",
    email: "maria.santos@aluno.cetep.br",
    telefone: "(75) 99123-4567",
    setor: "Suporte Técnico",
    status: "Ativo",
    periodoEstagio: "15/07/2026 - 15/11/2026",
    horasCumpridas: 320,
    horasTotais: 400,
    supervisor: "Ricardo Almeida",
    telefoneOrientador: "(75) 99800-1122",
    emailOrientador: "ricardo.almeida@techsoft.com.br",
    empresa: {
      nome: "TechSoft Solutions Ltda",
      municipio: "Araci",
      cnpj: "12.345.678/0001-90",
      endereco: "Av. Getúlio Vargas, 123 - Centro, Araci/BA",
      responsavel: "Carlos Eduardo (Gerente de TI)",
    },
    frequencias: gerarFrequencias(15),
    questionario: {
      status: "respondido",
      respondidoEm: "2026-10-01T10:45:00",
      respostas: {
        // Bloco 1 — Avaliação da Concedente
        concedenteInfraestrutura: "otimo",
        concedenteAtividades: "otimo",
        concedenteOrganizacao: "otimo",
        concedenteSupervisao: "bom",
        concedenteFinal: "otimo",

        // Bloco 2 — Aspectos do Estagiário
        estagiarioAssiduidade: "otimo",
        estagiarioPontualidade: "otimo",
        estagiarioInteresse: "bom",
        estagiarioOrganizacao: "bom",
        estagiarioResponsabilidade: "otimo",
        estagiarioPostura: "otimo",
        estagiarioRelacionamento: "otimo",
        estagiarioFinal: "otimo",

        // Observações e assinatura
        observacoes:
          "Excelente estagiária, recomendamos fortemente sua efetivação.",
        assinaturaNome: "Ricardo Almeida",
        assinaturaLocal: "Araci/BA",
        assinaturaData: "2026-10-01",
      },
    },
  },
  {
    id: 3,
    nome: "Pedro Henrique Oliveira",
    matricula: "2023003",
    curso: "Técnico em Informática",
    unidadeEscolar: "CETEP Araci",
    email: "pedro.oliveira@aluno.cetep.br",
    telefone: "(75) 98888-2233",
    setor: "Infraestrutura de Redes",
    status: "Ativo",
    periodoEstagio: "20/07/2026 - 20/11/2026",
    horasCumpridas: 220,
    horasTotais: 400,
    supervisor: "Ricardo Almeida",
    telefoneOrientador: "(75) 99800-1122",
    emailOrientador: "ricardo.almeida@techsoft.com.br",
    empresa: {
      nome: "TechSoft Solutions Ltda",
      municipio: "Araci",
      cnpj: "12.345.678/0001-90",
      endereco: "Av. Getúlio Vargas, 123 - Centro, Araci/BA",
      responsavel: "Carlos Eduardo (Gerente de TI)",
    },
    frequencias: gerarFrequencias(10),
    questionario: {
      status: "pendente",
      respondidoEm: null,
      respostas: null,
    },
  },
  {
    id: 4,
    nome: "Ana Clara Souza",
    matricula: "2023004",
    curso: "Técnico em Informática",
    unidadeEscolar: "CETEP Araci",
    email: "ana.souza@aluno.cetep.br",
    telefone: "(75) 99777-1100",
    setor: "Banco de Dados",
    status: "Finalizado",
    periodoEstagio: "01/02/2026 - 30/06/2026",
    horasCumpridas: 400,
    horasTotais: 400,
    supervisor: "Ricardo Almeida",
    telefoneOrientador: "(75) 99800-1122",
    emailOrientador: "ricardo.almeida@techsoft.com.br",
    empresa: {
      nome: "TechSoft Solutions Ltda",
      municipio: "Araci",
      cnpj: "12.345.678/0001-90",
      endereco: "Av. Getúlio Vargas, 123 - Centro, Araci/BA",
      responsavel: "Carlos Eduardo (Gerente de TI)",
    },
    frequencias: gerarFrequencias(12),
    questionario: {
      status: "respondido",
      respondidoEm: "2026-07-05T14:20:00",
      respostas: {
        // Bloco 1
        concedenteInfraestrutura: "otimo",
        concedenteAtividades: "otimo",
        concedenteOrganizacao: "bom",
        concedenteSupervisao: "otimo",
        concedenteFinal: "otimo",
        // Bloco 2
        estagiarioAssiduidade: "otimo",
        estagiarioPontualidade: "otimo",
        estagiarioInteresse: "otimo",
        estagiarioOrganizacao: "otimo",
        estagiarioResponsabilidade: "otimo",
        estagiarioPostura: "otimo",
        estagiarioRelacionamento: "bom",
        estagiarioFinal: "otimo",
        // Extras
        observacoes:
          "Aluna excepcional. Contratada após o término do estágio.",
        assinaturaNome: "Ricardo Almeida",
        assinaturaLocal: "Araci/BA",
        assinaturaData: "2026-07-05",
      },
    },
  },
]