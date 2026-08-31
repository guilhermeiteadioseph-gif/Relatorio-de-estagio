import { 
    Card,
    CardHeader,
    CardContent,
    CardTitle} from "@/components/ui/card";

export function StatCard({ title, description, value, icon: Icon, ...props })  {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-500">
                    {title}
                </CardTitle>
                {Icon && <Icon className="w-4 h-4 text-slate-400" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-800"></div>
                {value && <p className="text-2xl font-bold">{value}</p>}
                {description && (
                    <p className="text-xs text-slate-400 mt-1">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}    