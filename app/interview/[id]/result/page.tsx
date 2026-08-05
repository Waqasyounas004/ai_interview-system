"use client";

import { use } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { mockInterviews } from "@/lib/mockData";
import { getScoreBadgeColor, formatDate } from "@/lib/utils";

interface ResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InterviewResultPage({ params }: ResultPageProps) {
  const resolvedParams = use(params);

  const interview =
    mockInterviews.find((item) => item.id === resolvedParams.id) ||
    mockInterviews[0];

  const feedback = interview.feedback || {
    score: 85,
    strengths: ["Strong communication", "Solid React fundamentals"],
    weaknesses: ["Deepen TypeScript generics knowledge"],
  };

  const badge = getScoreBadgeColor(feedback.score);

  return (
    <main className="min-h-[calc(100vh-8rem)] py-8 px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Interview Report
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {interview.title}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Role: {interview.role} • Date: {formatDate(interview.date)}
            </p>
          </div>

          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Score Card */}
        <Card
          className={`flex flex-col items-center justify-center p-8 text-center border-2 ${badge.border} ${badge.bg}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Overall AI Score
          </p>
          <div className={`mt-2 text-6xl font-black ${badge.text}`}>
            {feedback.score}%
          </div>
          <p className="mt-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {feedback.score >= 80
              ? "🎉 Excellent Performance!"
              : feedback.score >= 60
              ? "👍 Good Effort!"
              : "💪 Needs Practice"}
          </p>
        </Card>

        {/* Breakdown Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Strengths */}
          <Card className="p-6 border-l-4 border-l-emerald-500">
            <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-4">
              <span>✅</span> Key Strengths
            </h3>
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              {feedback.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Weaknesses / Improvements */}
          <Card className="p-6 border-l-4 border-l-amber-500">
            <h3 className="flex items-center gap-2 text-lg font-bold text-amber-700 dark:text-amber-400 mb-4">
              <span>🎯</span> Areas to Improve
            </h3>
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              {feedback.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/interview/new">
            <Button size="lg">Practice Another Interview →</Button>
          </Link>
          <Link href="/history">
            <Button variant="secondary" size="lg">
              View History
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
