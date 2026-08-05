import { ReactNode } from "react";
import Card from "@/components/ui/Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className="flex items-center justify-between p-6 hover:border-indigo-500/40 transition-all">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </p>
        <p className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {trend}
          </p>
        )}
      </div>

      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          {icon}
        </div>
      )}
    </Card>
  );
}
