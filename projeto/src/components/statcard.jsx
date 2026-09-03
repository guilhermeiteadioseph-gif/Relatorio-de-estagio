import { isValidElement } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle
} from "@/components/ui/card";

export default function StatCard({ title, description, value, icon, ...props }) {
    const IconComponent = isValidElement(icon) ? null : icon;

    return (
        <Card {...props}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-500">
                    {title}
                </CardTitle>
                {IconComponent ? <IconComponent className="w-4 h-4 text-slate-400" /> : icon}
            </CardHeader>
            <CardContent>
                {value && <p className="text-2xl font-bold text-slate-900">{value}</p>}
                {description && (
                    <p className="text-xs text-slate-400 mt-1">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}