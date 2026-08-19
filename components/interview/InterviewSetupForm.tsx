"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { createInterviewSession } from "@/lib/interviewService";

export default function InterviewSetupForm() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Junior");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const selectedRole = role.trim();
    if (!selectedRole) {
      setErrorMsg("Please enter or select a Job Role to start the interview.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await createInterviewSession({
        role: selectedRole,
        level,
        questionCount: 5,
      });

      if (!res.success || !res.interview_id) {
        throw new Error("Failed to create interview session");
      }

      router.push(`/interview/${res.interview_id}`);
    } catch (err: any) {
      console.error("Interview creation error:", err);
      setErrorMsg(err.message || "An error occurred while creating your interview.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md p-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Setup Your Interview
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Configure your target role and experience level for a 5-question session
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Job Role"
          type="text"
          placeholder="e.g. Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Experience Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          >
            <option value="Junior">Junior (0-2 yrs)</option>
            <option value="Mid">Mid Level (2-5 yrs)</option>
            <option value="Senior">Senior (5+ yrs)</option>
            <option value="Lead">Lead / Architect</option>
          </select>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Start Practice Interview →
        </Button>
      </form>
    </Card>
  );
}
