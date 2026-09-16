/* ------------------------------------------------------------------ */
/*  Validações de formato (e-mail, senha, CNPJ)                        */
/* ------------------------------------------------------------------ */

/** Regex de e-mail (suficiente para validação client-side). */
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarEmail(email) {
  return RE_EMAIL.test(String(email || "").trim())
}

/**
 * Valida senha conforme regra por perfil.
 *
 * Regras:
 *   - Perfis SEM 2FA (estagiário, supervisor, professor) → mín. 12 chars
 *   - Perfis COM 2FA (vice-diretor, assistente)         → mín. 10 chars
 *   - Caracteres especiais e espaços SÃO PERMITIDOS (mas não exigidos)
 *   - Não pode estar em lista de senhas comuns (leak check via HIBP na API)
 *
 * @param {string} senha
 * @param {boolean} requer2FA
 * @returns {{ valida: boolean, erro?: string }}
 */
export function validarSenha(senha, requer2FA = false) {
  const min = requer2FA ? 10 : 12
  const s = String(senha || "")

  if (!s) return { valida: false, erro: "Informe uma senha." }
  if (s.length < min)
    return { valida: false, erro: `A senha deve ter no mínimo ${min} caracteres.` }
  if (s.length > 128)
    return { valida: false, erro: "A senha é longa demais (máx. 128)." }

  return { valida: true }
}

/* ------------------------------------------------------------------ */
/*  CNPJ — validação de formato + dígitos verificadores                */
/* ------------------------------------------------------------------ */

/** Remove tudo que não for dígito. */
export function limparCNPJ(cnpj) {
  return String(cnpj || "").replace(/\D/g, "")
}

/** Formata "12345678000190" → "12.345.678/0001-90". */
export function formatarCNPJ(cnpj) {
  const v = limparCNPJ(cnpj).slice(0, 14)
  return v
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
}

/** Formata a máscara de CEP "12345-678". */
export function formatarCEP(cep) {
  const v = String(cep || "").replace(/\D/g, "").slice(0, 8)
  return v.replace(/^(\d{5})(\d)/, "$1-$2")
}

/** Formata telefone (11) 99999-9999. */
export function formatarTelefone(tel) {
  const v = String(tel || "").replace(/\D/g, "").slice(0, 11)
  if (v.length <= 10) return v.replace(/^(\d{2})(\d{4})(\d)/, "($1) $2-$3")
  return v.replace(/^(\d{2})(\d{5})(\d)/, "($1) $2-$3")
}

/**
 * Valida CNPJ numericamente (14 dígitos + dígitos verificadores).
 * @param {string} cnpj
 * @returns {{ valido: boolean, erro?: string }}
 */
export function validarCNPJ(cnpj) {
  const v = limparCNPJ(cnpj)

  if (v.length !== 14) return { valido: false, erro: "O CNPJ deve ter 14 dígitos." }
  if (/^(\d)\1+$/.test(v)) return { valido: false, erro: "CNPJ inválido." }

  const calcular = (base) => {
    let peso = base.length - 7
    let soma = 0
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * peso--
      if (peso < 2) peso = 9
    }
    const r = soma % 11
    return r < 2 ? 0 : 11 - r
  }

  const dv1 = calcular(v.slice(0, 12))
  const dv2 = calcular(v.slice(0, 12) + dv1)

  if (Number(v[12]) !== dv1 || Number(v[13]) !== dv2) {
    return { valido: false, erro: "CNPJ inválido (dígitos verificadores)." }
  }
  return { valido: true }
}