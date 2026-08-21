import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }) {
    const CurrentStatus = status.toLowerCase();
    
    if (CurrentStatus === "Aprovado" || CurrentStatus === "Concluído") {
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">Aprovado</Badge>
    }

    if (CurrentStatus === "Pendente") {
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">Pendente</Badge>
    }

    if (CurrentStatus === "Rejeitado" || CurrentStatus === "Recusado") {
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Rejeitado</Badge>
    }
}