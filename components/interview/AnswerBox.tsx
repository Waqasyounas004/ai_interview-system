"use client";

import Button from "@/components/ui/Button";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

interface AnswerBoxProps {
  answer: string;
  setAnswer: (value: string) => void;
}

export default function AnswerBox({ answer, setAnswer }: AnswerBoxProps) {
  const { isSupported, isListening, interimText, error, start, stop } = useSpeechRecognition({
    onFinalChunk: (chunk) => {
      setAnswer(answer ? `${answer} ${chunk}` : chunk);
    },
  });

  const toggleRecording = () => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  // While listening, show the live in-progress words appended right inside
  // the answer box itself (not committed to `answer` yet — that only happens
  // once a chunk is finalized), so the candidate sees their words appear as
  // they speak instead of waiting for a pause.
  const displayValue =
    isListening && interimText
      ? `${answer}${answer && !answer.endsWith(" ") ? " " : ""}${interimText}`
      : answer;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Your Answer
        </label>
        <Button
          type="button"
          variant={isListening ? "danger" : "outline"}
          size="sm"
          onClick={toggleRecording}
          disabled={!isSupported}
          className={`gap-1.5 ${isListening ? "animate-pulse" : ""}`}
          title={isSupported ? undefined : "Voice input isn't supported in this browser — please type your answer."}
        >
          <span>{isListening ? "🔴 Listening… (click to stop)" : "🎤 Voice Mode"}</span>
        </Button>
      </div>

      <textarea
        value={displayValue}
        onChange={(e) => setAnswer(e.target.value)}
        readOnly={isListening}
        placeholder="Type or record your detailed answer here..."
        className={`h-44 w-full rounded-xl border p-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:text-white ${
          isListening
            ? "border-indigo-400 bg-indigo-50/60 text-zinc-900 dark:border-indigo-500 dark:bg-indigo-950/20"
            : "border-zinc-300 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900"
        }`}
      />

      {isListening && (
        <p className="text-xs text-indigo-500 dark:text-indigo-400">
          🎙️ Listening — your words are appearing above as you speak. Click the mic again to stop and edit.
        </p>
      )}

      {!isSupported && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Voice input isn&apos;t supported in this browser — try Chrome or Edge, or just type your answer.
        </p>
      )}

      {error === "not-allowed" && (
        <p className="text-xs text-rose-600 dark:text-rose-400">
          Microphone access was denied — allow it in your browser&apos;s site settings to use Voice Mode.
        </p>
      )}
      {error === "network" && (
        <p className="text-xs text-rose-600 dark:text-rose-400">
          Voice recognition lost its connection — click the mic to try again.
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>Press Submit when finished</span>
        <span>{displayValue.length} characters</span>
      </div>
    </div>
  );
}
