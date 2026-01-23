import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils";

interface DashboardCardProps {
    title: string;
    value: number;
    icon: React.ReactElement<LucideIcon>;
    className?: string;

}

const DashboardCard = ({ title, value, icon, className }: DashboardCardProps) => {
    return (
        <Card className={cn("bg-slate-100 dark:bg-slate-800 p-4", className)}>
            <CardContent>
                <h3 className="text-3xl text-center mb-4 font-bold text-slate-500 dark:text-slate-200">{title}</h3>
                <div className="flex gap-5 justify-center items-center mb-4">
                    {icon}
                    <h3 className="text-5xl font-semibold text-slate-500 dark:text-slate-200">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardCard;
