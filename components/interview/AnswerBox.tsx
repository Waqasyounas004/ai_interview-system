"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface AnswerBoxProps {
  answer: string;
  setAnswer: (value: string) => void;
}

export default function AnswerBox({ answer, setAnswer }: AnswerBoxProps) {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording && !answer) {
      setAnswer("React Virtual DOM is a lightweight copy of the real DOM...");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Your Answer
        </label>
        <Button
          type="button"
          variant={isRecording ? "danger" : "outline"}
          size="sm"
          onClick={toggleRecording}
          className="gap-1.5"
        >
          <span>{isRecording ? "🔴 Stop Recording" : "🎤 Voice Mode"}</span>
        </Button>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type or record your detailed answer here..."
        className="h-44 w-full rounded-xl border border-zinc-300 bg-white p-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
      />

      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>Press Submit when finished</span>
        <span>{answer.length} characters</span>
      </div>
    </div>
  );
}
