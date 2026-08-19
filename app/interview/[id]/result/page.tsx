"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { mockInterviews } from "@/lib/mockData";
import { getScoreBadgeColor, formatDate } from "@/lib/utils";

interface ResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InterviewResultPage({ params }: ResultPageProps) {
  const resolvedParams = use(params);

  const [interview, setInterview] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        setIsLoading(true);
        const targetId = resolvedParams?.id;

        if (!targetId) {
          setInterview(mockInterviews[0]);
          return;
        }

        // Query Supabase for interview row using maybeSingle to avoid PGRST116 errors
        const { data: interviewRow, error: intErr } = await supabase
          .from("interviews")
          .select("*")
          .eq("id", targetId)
          .maybeSingle();

        if (interviewRow) {
          setInterview(interviewRow);

          // Query questions for feedback breakdown
          const { data: qData } = await supabase
            .from("questions")
            .select("*")
            .eq("interview_id", targetId)
            .order("question_number", { ascending: true });

          setQuestions(qData || []);
        } else {
          // Fallback to mock data or generated item
          const mock = mockInterviews.find((item) => item.id === targetId);
          setInterview(mock || {
            id: targetId,
            title: "Practice Interview Session",
            role: "Software Engineer",
            level: "Practice",
            score: 0,
            created_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Error fetching interview result:", err);
        setInterview(mockInterviews[0]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResult();
  }, [resolvedParams?.id]);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Generating AI Evaluation Report...
          </p>
        </div>
      </main>
    );
  }

  const rawScore =
    typeof interview?.score === "number"
      ? interview.score
      : typeof interview?.overall_feedback?.score === "number"
      ? interview.overall_feedback.score
      : typeof interview?.feedback?.score === "number"
      ? interview.feedback.score
      : 0;

  const finalScore = Math.min(100, Math.max(0, rawScore));

  const defaultStrengths =
    finalScore === 0
      ? ["Attempted the interview session"]
      : ["Solid technical communication", "Clear analytical thinking"];

  const defaultWeaknesses =
    finalScore === 0
      ? ["Questions were skipped or lacked technical content", "Review core fundamentals before retrying"]
      : ["Expand on architectural trade-offs and edge cases"];

  const feedback = {
    score: finalScore,
    strengths:
      interview?.overall_feedback?.strengths ||
      interview?.feedback?.strengths ||
      defaultStrengths,
    weaknesses:
      interview?.overall_feedback?.weaknesses ||
      interview?.feedback?.weaknesses ||
      defaultWeaknesses,
  };

  const badge = getScoreBadgeColor(finalScore);

  return (
    <main className="min-h-[calc(100vh-8rem)] py-8 px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              AI Interview Performance Report
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {interview?.title || `${interview?.role} Interview`}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Role: {interview?.role} • Date: {formatDate(interview?.created_at || interview?.date || new Date().toISOString())}
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
            Overall Candidate AI Score
          </p>
          <div className={`mt-2 text-6xl font-black ${badge.text}`}>
            {finalScore}%
          </div>
          <p className="mt-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {finalScore >= 80
              ? "🎉 Excellent Performance!"
              : finalScore >= 60
              ? "👍 Good Effort!"
              : "💪 Needs Practice"}
          </p>
        </Card>

        {/* Strengths & Improvements Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Strengths */}
          <Card className="p-6 border-l-4 border-l-emerald-500">
            <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-4">
              <span>✅</span> Key Strengths
            </h3>
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              {(feedback.strengths || ["Solid technical principles"]).map((item: string, idx: number) => (
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
              {(feedback.weaknesses || ["Deepen architectural details"]).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Detailed Question Feedback Breakdown */}
        {questions.length > 0 && (
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Question-by-Question Feedback
            </h3>
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                    <span>Question {idx + 1}</span>
                    <span className="rounded bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-indigo-700 dark:text-indigo-300 font-bold">
                      Score: {q.question_score || 80}%
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {q.question_text}
                  </p>
                  {q.user_answer && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-2.5 rounded border border-zinc-200 dark:border-zinc-800">
                      <strong className="text-zinc-700 dark:text-zinc-300">Your Answer:</strong> {q.user_answer}
                    </p>
                  )}
                  {q.ai_feedback && (
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">
                      💡 <strong>AI Feedback:</strong> {q.ai_feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

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
