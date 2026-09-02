import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status = '' }) {
    const CurrentStatus = String(status).toLowerCase();
    
    if (['aprovado', 'aprovada', 'concluído', 'concluido', 'presente'].includes(CurrentStatus)) {
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">Aprovado</Badge>
    }

    if (['pendente', 'pending'].includes(CurrentStatus)) {
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">Pendente</Badge>
    }

    if (['rejeitado', 'recusado', 'reprovado', 'ausente'].includes(CurrentStatus)) {
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Rejeitado</Badge>
    }

    return <Badge className="bg-slate-100 text-slate-600 border-none">{String(status || '—')}</Badge>
}