/**
 * Utilitários de data/hora no padrão brasileiro.
 * Isolado para manter consistência em toda a aplicação.
 */

/**
 * Formata uma Date (ou string ISO) para "DD/MM/AAAA às HH:MM".
 * @param {Date|string|number} valor
 * @returns {string}
 */
export function formatarDataHora(valor) {
  if (!valor) return ""
  const data = valor instanceof Date ? valor : new Date(valor)
  if (isNaN(data.getTime())) return ""

  const dia   = String(data.getDate()).padStart(2, "0")
  const mes   = String(data.getMonth() + 1).padStart(2, "0")
  const ano   = data.getFullYear()
  const hora  = String(data.getHours()).padStart(2, "0")
  const min   = String(data.getMinutes()).padStart(2, "0")

  return `${dia}/${mes}/${ano} às ${hora}:${min}`
}

/**
 * Retorna a data/hora atual formatada (atalho).
 */
export function agoraFormatado() {
  return formatarDataHora(new Date())
}

/**
 * Formata uma data ISO para "DD/MM/AAAA" (sem hora).
 */
export function formatarData(valor) {
  if (!valor) return ""
  const data = valor instanceof Date ? valor : new Date(valor)
  if (isNaN(data.getTime())) return ""
  return data.toLocaleDateString("pt-BR")
}