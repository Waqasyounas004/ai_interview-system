"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/interview/ProgressBar";
import QuestionCard from "@/components/interview/QuestionCard";
import AnswerBox from "@/components/interview/AnswerBox";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { mockInterviews } from "@/lib/mockData";

interface InterviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InterviewPage({ params }: InterviewPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const interview =
    mockInterviews.find((item) => item.id === resolvedParams.id) ||
    mockInterviews[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  if (!interview) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
        <Card className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Interview Not Found
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            The requested interview session does not exist.
          </p>
          <Link href="/dashboard" className="mt-4 inline-block">
            <Button>Return to Dashboard</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const currentQuestion = interview.questions[currentIndex];
  const isLastQuestion = currentIndex === interview.questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      router.push(`/interview/${interview.id}/result`);
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
              {interview.title}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Role: {interview.role} • Level: {interview.level}
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Exit Session
            </Button>
          </Link>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          current={currentIndex + 1}
          total={interview.questions.length}
        />

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion.question}
          number={currentIndex + 1}
          category={currentQuestion.category}
        />

        {/* Answer Box */}
        <AnswerBox
          answer={answers[currentIndex] || ""}
          setAnswer={(val) => setAnswers({ ...answers, [currentIndex]: val })}
        />

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Previous
          </Button>

          <Button onClick={handleNext}>
            {isLastQuestion
              ? "Submit Interview & View Score →"
              : "Next Question →"}
          </Button>
        </div>
      </div>
    </main>
  );
}
