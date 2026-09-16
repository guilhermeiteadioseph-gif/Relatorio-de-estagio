/* ------------------------------------------------------------------ */
/*  Integrações externas — HIBP e OpenCNPJ                            */
/*  (com fallback mock quando não há rede / CORS / chave)             */
/* ------------------------------------------------------------------ */

import { limparCNPJ } from "./validacao"

/**
 * Have I Been Pwned — Pwned Passwords (k-anonymity).
 *
 * Fluxo:
 *   1. SHA-1(senha) → hex
 *   2. GET /range/{5 primeiros chars}
 *   3. Compara localmente o sufixo (35 chars restantes) com a lista retornada
 *   4. Se presente → senha vazada
 *
 * @param {string} senha
 * @returns {Promise<{ vazada: boolean, contagem: number }>}
 */
export async function verificarSenhaVazada(senha) {
  try {
    const buf = new TextEncoder().encode(senha)
    const hash = await crypto.subtle.digest("SHA-1", buf)
    const hex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()

    const prefixo = hex.slice(0, 5)
    const sufixo = hex.slice(5)

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefixo}`)
    if (!res.ok) throw new Error("HIBP indisponível")

    const texto = await res.text()
    const linha = texto.split("\n").find((l) => l.startsWith(sufixo))
    const contagem = linha ? Number(linha.split(":")[1]) : 0

    return { vazada: contagem > 0, contagem }
  } catch {
    // Em falha (offline/CORS), não bloqueia o cadastro — apenas avisa.
    return { vazada: false, contagem: 0, erro: "Não foi possível verificar vazamentos." }
  }
}

/* ------------------------------------------------------------------ */
/*  OpenCNPJ — consulta de dados cadastrais da empresa                */
/*  Em produção, troque o endpoint por um com chave paga ou proxy     */
/*  server-side. Aqui usamos um mock + tentativa real via BrasilAPI.  */
/* ------------------------------------------------------------------ */

/**
 * Consulta pública de CNPJ.
 * @param {string} cnpj
 * @returns {Promise<{ encontrado: boolean, dados?: object, erro?: string }>}
 */
export async function consultarCNPJ(cnpj) {
  const doc = limparCNPJ(cnpj)

  try {
    // BrasilAPI é pública e não exige chave. Usada como fallback real.
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${doc}`)
    if (!res.ok) throw new Error("Não encontrado")

    const j = await res.json()
    return {
      encontrado: true,
      dados: {
        razaoSocial: j.razao_social,
        nomeFantasia: j.nome_fantasia,
        municipio: j.municipio,
        uf: j.uf,
        cep: j.cep,
        logradouro: j.logradouro,
        numero: j.numero,
        bairro: j.bairro,
        email: j.email,
        telefone: j.ddd_telefone_1,
        situacao: j.descricao_situacao_cadastral,
      },
    }
  } catch {
    // Fallback mock — permite testar o fluxo sem internet
    return { encontrado: false, erro: "Não foi possível consultar o CNPJ." }
  }
}