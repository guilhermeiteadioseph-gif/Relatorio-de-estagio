import { useMemo, useState } from "react"
import { ptBR } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/sonner"
import { formatarData } from "@/components/ui/date-range-picker"
import {
  CalendarIcon,
  Clock,
  FileText,
  Info,
} from "lucide-react"

/**
 * Dialog para registrar e visualizar frequências.
 *
 * Regras de negócio:
 *   - Só é possível registrar hoje ou até 7 dias atrás.
 *   - Datas futuras ficam desabilitadas no calendário.
 *   - Cada registro guarda: data, entrada, saída e atividade desenvolvida.
 */
export default function DialogoFrequencia({
  open,
  onOpenChange,
  frequencias = [],
  onSalvar,
}) {
  /* ------------------------------------------------------------------ */
  /*  Datas desabilitadas no calendário                                  */
  /* ------------------------------------------------------------------ */
  const hoje = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const seteDiasAtras = useMemo(() => {
    const d = new Date(hoje)
    d.setDate(d.getDate() - 7)
    return d
  }, [hoje])

  /* ------------------------------------------------------------------ */
  /*  Estado do formulário                                               */
  /* ------------------------------------------------------------------ */
  const [data, setData] = useState(hoje)
  const [entrada, setEntrada] = useState("08:00")
  const [saida, setSaida] = useState("17:00")
  const [atividade, setAtividade] = useState("")
  const [openCal, setOpenCal] = useState(false)

  /* ------------------------------------------------------------------ */
  /*  Validação e envio                                                  */
  /* ------------------------------------------------------------------ */
  const handleSalvar = () => {
    if (!data) {
      toast.warning("Selecione a data", "Escolha o dia do registro.")
      return
    }
    if (!entrada || !saida) {
      toast.warning("Preencha os horários", "Informe entrada e saída.")
      return
    }
    // Valida que saida > entrada
    const [h1, m1] = entrada.split(":").map(Number)
    const [h2, m2] = saida.split(":").map(Number)
    if (h2 * 60 + m2 <= h1 * 60 + m1) {
      toast.warning(
        "Horário inválido",
        "O horário de saída deve ser posterior ao de entrada."
      )
      return
    }
    if (atividade.trim().length < 5) {
      toast.warning(
        "Descreva a atividade",
        "Escreva ao menos 5 caracteres sobre o que você fez."
      )
      return
    }

    onSalvar({
      data: formatarData(data),
      entrada,
      saida,
      atividade: atividade.trim(),
    })
    toast.success("Frequência registrada!", "O registro foi salvo com sucesso.")

    // Reset do formulário
    setData(hoje)
    setEntrada("08:00")
    setSaida("17:00")
    setAtividade("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-blue-600" />
            Registro de Frequência
          </DialogTitle>
          <DialogDescription>
            Lance a presença do dia ou consulte os registros anteriores.
          </DialogDescription>
        </DialogHeader>

        {/* --------------------------------------------------------- */}
        {/*  Alerta informativo sobre o prazo                           */}
        {/* --------------------------------------------------------- */}
        <Alert variant="info">
          <Info />
          <AlertTitle>Prazo de registro</AlertTitle>
          <AlertDescription>
            Você pode registrar a frequência do dia atual ou até 7 dias
            retroativos. Não é possível registrar datas futuras.
          </AlertDescription>
        </Alert>

        {/* --------------------------------------------------------- */}
        {/*  Formulário de novo registro                                */}
        {/* --------------------------------------------------------- */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Novo registro
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Data */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Data</Label>
              <Popover open={openCal} onOpenChange={setOpenCal}>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 w-full justify-start gap-2 bg-white px-2.5 text-sm font-normal"
                    >
                      <CalendarIcon className="size-4 shrink-0 text-slate-400" />
                      <span className="truncate text-left">
                        {data ? formatarData(data) : "Selecione a data"}
                      </span>
                    </Button>
                  }
                />
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={(d) => {
                      if (d) {
                        setData(d)
                        setOpenCal(false)
                      }
                    }}
                    month={data}
                    onMonthChange={() => {}}
                    disabled={[
                      { after: hoje },
                      { before: seteDiasAtras },
                    ]}
                    locale={ptBR}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Entrada */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">
                Entrada
              </Label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="time"
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  className="bg-white pl-8"
                />
              </div>
            </div>

            {/* Saída */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Saída</Label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="time"
                  value={saida}
                  onChange={(e) => setSaida(e.target.value)}
                  className="bg-white pl-8"
                />
              </div>
            </div>
          </div>

          {/* Atividade */}
          <div className="mt-3 space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <FileText className="size-3.5 text-slate-400" />
              Atividade desenvolvida
            </Label>
            <Textarea
              placeholder="Descreva brevemente o que você realizou no dia..."
              value={atividade}
              onChange={(e) => setAtividade(e.target.value)}
              className="min-h-20 resize-none bg-white"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleSalvar}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Salvar Registro
            </Button>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/*  Tabela de frequências já registradas                       */}
        {/* --------------------------------------------------------- */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">
              Registros anteriores
            </h4>
            <Badge variant="outline" className="bg-white text-xs">
              {frequencias.length}{" "}
              {frequencias.length === 1 ? "registro" : "registros"}
            </Badge>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-slate-600">
                    Data
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">
                    Entrada
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">
                    Saída
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">
                    Atividade desenvolvida
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frequencias.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-sm text-slate-500"
                    >
                      Nenhum registro ainda.
                    </TableCell>
                  </TableRow>
                )}
                {[...frequencias].reverse().map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="text-sm text-slate-700">
                      {f.data}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {f.entrada}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {f.saida}
                    </TableCell>
                    <TableCell className="max-w-md text-sm text-slate-600">
                      <span className="line-clamp-2">{f.atividade}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}