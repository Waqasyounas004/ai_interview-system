import Link from "next/link";
import { Interview } from "@/types/interview";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate, getScoreBadgeColor } from "@/lib/utils";

interface RecentInterviewsProps {
  interviews: Interview[];
}

export default function RecentInterviews({
  interviews,
}: RecentInterviewsProps) {
  if (!interviews || interviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          No Interviews Yet
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Start your first AI mock interview to practice!
        </p>
        <Link href="/interview/new" className="mt-4 inline-block">
          <Button size="md">Start New Interview</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Recent Interviews
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Review your past practice sessions and scores
          </p>
        </div>
        <Link
          href="/history"
          className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {interviews.map((interview) => {
          const score = typeof interview.score === "number"
            ? interview.score
            : (interview.feedback?.score ?? interview.overall_feedback?.score ?? 0);
          const colors = getScoreBadgeColor(score);

          return (
            <Link
              key={interview.id}
              href={`/interview/${interview.id}/result`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 transition-all hover:border-indigo-500/50 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-900"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {interview.title}
                  </h3>
                  <span className="rounded-md bg-zinc-200/70 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {interview.level}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {interview.role} • {formatDate(interview.date || (interview as any).created_at || "")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full border ${colors.border} ${colors.bg} px-3 py-1 text-xs font-bold ${colors.text}`}
                >
                  Score: {score}%
                </div>
                <span className="text-zinc-400 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
