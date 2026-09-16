import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/sonner"
import {
  Building2, CheckCircle2, AlertTriangle, Loader2, Hash, Info,
} from "lucide-react"

import { roles, roleMetadata } from "@/constants/roles"
import { validarCNPJ, formatarCNPJ } from "@/utils/validacao"
import { consultarCNPJ } from "@/utils/apis"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Passo 4 — Dados específicos do perfil.
 *   - Supervisor → CNPJ + dados da empresa (auto-preenchidos se encontrado)
 *   - Professor  → matrícula
 */
export default function PassoDadosPerfil({ dados, onAvancar }) {
  const meta = roleMetadata[dados.role]
  if (meta?.dadosExtra === "empresa") return <FormEmpresa onAvancar={onAvancar} />
  if (meta?.dadosExtra === "matricula") return <FormMatricula onAvancar={onAvancar} />
  // Fallback (não deveria acontecer)
  return null
}

/* ------------------------------------------------------------------ */
/*  Supervisor — CNPJ + empresa                                       */
/* ------------------------------------------------------------------ */
function FormEmpresa({ onAvancar }) {
  const [cnpj, setCnpj] = useState("")
  const [consultando, setConsultando] = useState(false)
  const [resultado, setResultado] = useState(null) // { encontrado, dados, erro }
  const [empresa, setEmpresa] = useState({ razaoSocial: "", nomeFantasia: "", municipio: "", uf: "" })
  const [erro, setErro] = useState("")

  /* Ao sair do campo, valida + consulta */
  const handleBlurCNPJ = async () => {
    setErro("")
    const { valido, erro: err } = validarCNPJ(cnpj)
    if (!valido) {
      setErro(err)
      setResultado(null)
      return
    }
    setConsultando(true)
    const res = await consultarCNPJ(cnpj)
    setConsultando(false)
    setResultado(res)

    if (res.encontrado) {
      setEmpresa({
        razaoSocial: res.dados.razaoSocial || "",
        nomeFantasia: res.dados.nomeFantasia || "",
        municipio: res.dados.municipio || "",
        uf: res.dados.uf || "",
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valido } = validarCNPJ(cnpj)
    if (!valido) return setErro("Informe um CNPJ válido.")

    // Se não encontrado, exige preenchimento manual
    if (!resultado?.encontrado && !empresa.razaoSocial.trim()) {
      return setErro("Informe a razão social da empresa para cadastro manual.")
    }

    onAvancar({
      extra: {
        cnpj,
        empresa: resultado?.encontrado
          ? resultado.dados
          : {
              razaoSocial: empresa.razaoSocial,
              nomeFantasia: empresa.nomeFantasia,
              municipio: empresa.municipio,
              uf: empresa.uf,
              _pendenteAprovacaoEmpresa: true,
            },
      },
    })
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-blue-600" />
          <CardTitle className="text-xl">Sua empresa</CardTitle>
        </div>
        <CardDescription>
          Informe o CNPJ da empresa onde você supervisiona os estagiários.
          Vamos consultar os dados automaticamente.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="cnpj">CNPJ</Label>
            <div className="relative">
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
                onBlur={handleBlurCNPJ}
                placeholder="00.000.000/0000-00"
                disabled={consultando}
              />
              {consultando && (
                <Loader2 className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400" />
              )}
            </div>
          </div>

          {/* Resultado da consulta */}
          {resultado?.encontrado && (
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>Empresa encontrada</AlertTitle>
              <AlertDescription>
                <p className="font-medium">{resultado.dados.razaoSocial}</p>
                <p className="text-xs">
                  {resultado.dados.municipio} - {resultado.dados.uf} •{" "}
                  {resultado.dados.situacao}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {resultado && !resultado.encontrado && (
            <Alert variant="warning">
              <AlertTriangle />
              <AlertTitle>Empresa não encontrada</AlertTitle>
              <AlertDescription>
                O CNPJ é válido, mas não localizamos os dados publicamente.
                Preencha manualmente abaixo — o cadastro ficará pendente até a
                escola validar o convênio.
              </AlertDescription>
            </Alert>
          )}

          {/* Formulário manual (empresa não encontrada) */}
          {resultado && !resultado.encontrado && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="razao">Razão Social *</Label>
                <Input
                  id="razao"
                  value={empresa.razaoSocial}
                  onChange={(e) => setEmpresa((p) => ({ ...p, razaoSocial: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="fantasia">Nome Fantasia</Label>
                <Input
                  id="fantasia"
                  value={empresa.nomeFantasia}
                  onChange={(e) => setEmpresa((p) => ({ ...p, nomeFantasia: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="municipio">Município</Label>
                <Input
                  id="municipio"
                  value={empresa.municipio}
                  onChange={(e) => setEmpresa((p) => ({ ...p, municipio: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  maxLength={2}
                  value={empresa.uf}
                  onChange={(e) => setEmpresa((p) => ({ ...p, uf: e.target.value.toUpperCase() }))}
                />
              </div>
            </div>
          )}

          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Continuar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Professor — matrícula                                             */
/* ------------------------------------------------------------------ */
function FormMatricula({ onAvancar }) {
  const [matricula, setMatricula] = useState("")
  const [erro, setErro] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = matricula.replace(/\D/g, "")
    if (v.length < 4) return setErro("Informe uma matrícula válida (mínimo 4 dígitos).")
    onAvancar({ extra: { matricula: v } })
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Hash className="size-5 text-blue-600" />
          <CardTitle className="text-xl">Sua matrícula</CardTitle>
        </div>
        <CardDescription>
          Como professor orientador, informe seu número de matrícula funcional.
          A escola vai verificar seus dados antes de liberar o acesso.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              id="matricula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value.replace(/\D/g, ""))}
              placeholder="Ex: 202300123"
              inputMode="numeric"
            />
          </div>

          <Alert variant="info">
            <Info />
            <AlertDescription>
              Seu cadastro ficará <strong>pendente</strong> até que o assistente
              ou vice-diretor confirme os dados.
            </AlertDescription>
          </Alert>

          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Concluir cadastro
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}