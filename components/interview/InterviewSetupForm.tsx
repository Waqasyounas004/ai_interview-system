"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function InterviewSetupForm() {
  const router = useRouter();
  const [role, setRole] = useState("Frontend Developer");
  const [level, setLevel] = useState("Junior");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting interview setup:", { role, level });

    setTimeout(() => {
      setIsLoading(false);
      router.push("/interview/1");
    }, 600);
  }

  return (
    <Card className="mx-auto w-full max-w-md p-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Setup Your Interview
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Configure your target role and experience level
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Job Role"
          type="text"
          placeholder="e.g. Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
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
