import { calculatePercentage } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = calculatePercentage(current, total);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        <span>Question Progress</span>
        <span>
          {current} of {total} ({percentage}%)
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
