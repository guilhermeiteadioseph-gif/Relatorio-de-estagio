import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import {
  DateRangePicker, parseRange, formatarRange,
} from "@/components/ui/date-range-picker"

/** Classe dos selects nativos — mesmo padrão visual dos formulários. */
export const SELECT_CLS =
  "h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-800 outline-none " +
  "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"

/**
 * Campos de cadastro/edição de estagiário.
 * Usado tanto pelo formulário individual quanto pelo cadastro em massa.
 *
 * @param {Object}   props.form      - estado atual do formulário
 * @param {Function} props.set       - (campo, valor) => void
 * @param {Array}    props.empresas  - empresas parceiras
 * @param {Array}    props.cursos    - cursos técnicos
 * @param {Array}    props.usuarios  - para filtrar supervisores por empresa
 */
export default function CamposEstagiario({
  form, set, empresas = [], cursos = [], usuarios = [],
}) {
  /* Empresa selecionada — usada para autopreencher e filtrar supervisores. */
  const empresaSel = empresas.find((e) => e.nome === form.empresa)

  /* Supervisores já cadastrados na empresa escolhida. */
  const supervisoresDaEmpresa = usuarios.filter(
    (u) => u.role === "supervisor" && u.empresa === form.empresa
  )

  /* Handler especial: ao escolher empresa, autopreenche CNPJ, endereço
     e o profissional responsável (o "responsável legal" da empresa). */
  const handleEmpresa = (valor) => {
    set("empresa", valor)
    const emp = empresas.find((x) => x.nome === valor)
    if (emp) {
      set("empresaCnpj", emp.cnpj || "")
      set("empresaEndereco",
        `${emp.endereco}, ${emp.bairro} - ${emp.cidade}/${emp.uf}`)
      if (!form.profissionalResponsavel) {
        set("profissionalResponsavel", emp.responsavel || "")
      }
    }
  }

  return (
    <>
      {/* ═══════════ DADOS DO ESTAGIÁRIO ═══════════ */}
      <section>
        <h4 className="mb-3 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Dados do Estagiário
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="text-slate-700">Nome completo *</Label>
            <Input value={form.nome} onChange={(e) => set("nome", e.target.value)} />
          </div>
          <div>
            <Label className="text-slate-700">Matrícula *</Label>
            <Input value={form.matricula} onChange={(e) => set("matricula", e.target.value)} />
          </div>
          <div>
            <Label className="text-slate-700">Telefone / Celular</Label>
            <Input
              value={form.telefone}
              onChange={(e) => set("telefone", e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <Label className="text-slate-700">RG</Label>
            <Input value={form.rg} onChange={(e) => set("rg", e.target.value)} />
          </div>
          <div>
            <Label className="text-slate-700">E-mail</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div>
            <Label className="text-slate-700">Endereço / Bairro</Label>
            <Input value={form.endereco} onChange={(e) => set("endereco", e.target.value)} />
          </div>
          <div>
            <Label className="text-slate-700">Cidade</Label>
            <Input
              value={form.cidade}
              onChange={(e) => set("cidade", e.target.value)}
              placeholder="Cidade/UF"
            />
          </div>
          <div>
            <Label className="text-slate-700">Curso *</Label>
            <select
              value={form.curso}
              onChange={(e) => set("curso", e.target.value)}
              className={SELECT_CLS}
            >
              <option value="">Selecione o curso</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.nome}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-slate-700">Turno do Curso</Label>
            <select
              value={form.turno}
              onChange={(e) => set("turno", e.target.value)}
              className={SELECT_CLS}
            >
              <option>Matutino</option>
              <option>Vespertino</option>
              <option>Noturno</option>
            </select>
          </div>
        </div>
      </section>

      {/* ═══════════ DADOS DA EMPRESA ═══════════ */}
      <section>
        <h4 className="mb-3 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Dados da Empresa
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Empresa — combobox com autocomplete + autopreenchimento */}
          <div className="sm:col-span-2">
            <Label className="text-slate-700">Nome da Empresa</Label>
            <Combobox
              value={form.empresa}
              onChange={handleEmpresa}
              options={empresas
                .filter((e) => e.status === "ativa")
                .map((e) => ({ value: e.nome, label: e.nome }))}
              placeholder="Digite ou selecione uma empresa parceira"
              emptyMessage="Nenhuma empresa parceira encontrada"
            />
          </div>
          <div>
            <Label className="text-slate-700">CNPJ</Label>
            <Input
              value={form.empresaCnpj}
              onChange={(e) => set("empresaCnpj", e.target.value)}
            />
          </div>

          {/* Profissional responsável — quem assina o convênio */}
          <div>
            <Label className="text-slate-700">Profissional responsável</Label>
            <Combobox
              value={form.profissionalResponsavel}
              onChange={(v) => set("profissionalResponsavel", v)}
              options={
                empresaSel
                  ? [{ value: empresaSel.responsavel, label: empresaSel.responsavel }]
                  : []
              }
              placeholder="Quem assina o convênio"
              emptyMessage="Selecione uma empresa acima"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Responsável legal da empresa pelo convênio de estágio.
            </p>
          </div>

          <div className="sm:col-span-2">
            <Label className="text-slate-700">Endereço da Empresa</Label>
            <Input
              value={form.empresaEndereco}
              onChange={(e) => set("empresaEndereco", e.target.value)}
            />
          </div>

          {/* Supervisor — quem acompanha o dia a dia */}
          <div>
            <Label className="text-slate-700">Supervisor de estágio</Label>
            <Combobox
              value={form.supervisor}
              onChange={(v) => set("supervisor", v)}
              options={supervisoresDaEmpresa.map((s) => ({
                value: s.nome,
                label: s.nome,
              }))}
              placeholder="Nome do supervisor"
              emptyMessage="Nenhum supervisor cadastrado nesta empresa"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Pessoa que acompanha o estagiário no dia a dia.
            </p>
          </div>
          <div>
            <Label className="text-slate-700">Carga Horária Total (h)</Label>
            <Input
              type="number"
              value={form.horasTotais}
              onChange={(e) => set("horasTotais", Number(e.target.value))}
            />
          </div>

          <div className="sm:col-span-2">
            <Label className="text-slate-700">Turno e Dias de Estágio</Label>
            <Input
              value={form.turnoDias}
              onChange={(e) => set("turnoDias", e.target.value)}
              placeholder="Ex: Segunda a Sexta • 08h às 12h"
            />
          </div>
          <div>
            <Label className="text-slate-700">Data de Início</Label>
            <Input
              type="date"
              value={form.dataInicio}
              onChange={(e) => set("dataInicio", e.target.value)}
            />
          </div>
          <div>
            <Label className="text-slate-700">Período do Estágio</Label>
            <DateRangePicker
              value={parseRange(form.periodoEstagio)}
              onChange={(r) => set("periodoEstagio", formatarRange(r))}
              numberOfMonths={2}
              placeholder="Selecione o período"
            />
          </div>
        </div>
      </section>
    </>
  )
}