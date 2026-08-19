"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/interview/ProgressBar";
import QuestionCard from "@/components/interview/QuestionCard";
import AnswerBox from "@/components/interview/AnswerBox";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { mockInterviews } from "@/lib/mockData";

import { evaluateInterviewSession, getFallbackQuestions } from "@/lib/interviewService";

interface InterviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InterviewPage({ params }: InterviewPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [interviewData, setInterviewData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);

  useEffect(() => {
    async function loadInterviewSession() {
      try {
        setIsLoading(true);
        // Try loading real interview session from Supabase
        const { data: interviewRow } = await supabase
          .from("interviews")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (interviewRow) {
          setInterviewData(interviewRow);

          // Load questions for this interview
          const { data: qRows } = await supabase
            .from("questions")
            .select("*")
            .eq("interview_id", resolvedParams.id)
            .order("question_number", { ascending: true });

          if (qRows && qRows.length > 0) {
            setQuestions(
              qRows.map((q) => ({
                id: q.id,
                question: q.question_text,
                category: q.category || "Technical",
                number: q.question_number,
              }))
            );

            // Pre-populate answers if any already exist
            const initialAns: Record<string, string> = {};
            qRows.forEach((q, idx) => {
              if (q.user_answer) {
                initialAns[q.id || String(idx)] = q.user_answer;
              }
            });
            setAnswers(initialAns);
          } else {
            const targetCount = interviewRow.question_count || 5;
            const fallbackList = getFallbackQuestions(
              interviewRow.role || "Software Engineer",
              interviewRow.level || "Junior",
              targetCount
            ).map((item, idx) => ({
              id: `q${idx + 1}`,
              question: item.question,
              category: item.category,
              number: idx + 1,
            }));
            setQuestions(fallbackList);
          }
        } else {
          // Fallback to mock data if id matches mock ID or generic fallback
          const mock = mockInterviews.find((m) => m.id === resolvedParams.id) || mockInterviews[0];
          if (mock) {
            setInterviewData(mock);
            setQuestions(mock.questions || []);
          }
        }
      } catch (error) {
        console.error("Error loading interview session:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInterviewSession();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Loading your interview session...
          </p>
        </div>
      </main>
    );
  }

  if (!interviewData || questions.length === 0) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
        <Card className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Interview Not Found
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            The requested interview session does not exist or has been removed.
          </p>
          <Link href="/dashboard" className="mt-4 inline-block">
            <Button>Return to Dashboard</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentQKey = currentQuestion?.id || String(currentIndex);

  const handleEvaluateAndExit = async () => {
    setIsSubmitting(true);
    const targetId = resolvedParams?.id || interviewData?.id;
    try {
      if (targetId) {
        const evalRes = await evaluateInterviewSession({
          interviewId: targetId,
          questions,
          answers,
        });

        const scoreParam = typeof evalRes?.score === "number" ? `?score=${evalRes.score}` : "";
        router.push(`/interview/${targetId}/result${scoreParam}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      if (targetId) {
        router.push(`/interview/${targetId}/result`);
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
      setShowQuitModal(false);
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      await handleEvaluateAndExit();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] py-8 px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {interviewData.title || `${interviewData.role} Practice`}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Role: {interviewData.role} • Level: {interviewData.level || interviewData.difficulty}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() => setShowQuitModal(true)}
            >
              Exit Session
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
        />

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion.question}
          number={currentIndex + 1}
          category={currentQuestion.category}
        />

        {/* Answer Box */}
        <AnswerBox
          answer={answers[currentQKey] || ""}
          setAnswer={(val) => setAnswers({ ...answers, [currentQKey]: val })}
        />

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isSubmitting}
          >
            ← Previous
          </Button>

          <Button onClick={handleNext} isLoading={isSubmitting}>
            {isLastQuestion
              ? "Submit Interview & View Score →"
              : "Next Question →"}
          </Button>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 space-y-5 text-center shadow-2xl border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 text-xl font-bold">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Exit Interview Session?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Are you sure you want to exit this session?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 justify-center"
                onClick={() => setShowQuitModal(false)}
              >
                No
              </Button>
              <Button
                variant="primary"
                className="flex-1 justify-center bg-rose-600 hover:bg-rose-700 text-white"
                onClick={() => router.push("/dashboard")}
              >
                Yes
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
