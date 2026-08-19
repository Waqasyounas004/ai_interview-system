import Link from "next/link";
import { Interview } from "@/types/interview";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate, getScoreBadgeColor, extractInterviewScore } from "@/lib/utils";

interface InterviewCardProps {
  interview: Interview;
}

export default function InterviewCard({ interview }: InterviewCardProps) {
  const score = extractInterviewScore(interview);
  const badge = getScoreBadgeColor(score);
  const questionCount = interview.questions?.length ?? 5;

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:hover:border-zinc-700">
      <div>
        {/* Card Header: Title & Score */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
              {interview.level} Level
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {interview.title}
            </h3>
          </div>

          {/* Score Badge */}
          <div
            className={`flex flex-col items-center rounded-xl border ${badge.border} ${badge.bg} px-3 py-1.5 min-w-[70px] text-center`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Score
            </span>
            <span className={`text-lg font-black ${badge.text}`}>
              {score}%
            </span>
          </div>
        </div>

        {/* Info Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{interview.role}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(interview.date || (interview as any).created_at || "")}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{questionCount} {questionCount === 1 ? "Question" : "Questions"}</span>
          </div>
        </div>

        {/* Strengths Snippet if available */}
        {interview.feedback?.strengths && interview.feedback.strengths.length > 0 && (
          <div className="mt-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Highlight:
            </p>
            <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300 line-clamp-1">
              ✨ {interview.feedback.strengths[0]}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer: Action */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <span className="text-xs font-medium text-zinc-400">
          ID: #{interview.id}
        </span>

        <Link href={`/interview/${interview.id}/result`}>
          <Button size="sm" variant="outline" className="group-hover:border-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            View Details →
          </Button>
        </Link>
      </div>
    </Card>
  );
}
