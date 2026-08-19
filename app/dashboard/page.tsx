"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentInterviews from "@/components/dashboard/RecentInterviews";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { extractInterviewScore, repairAndExtractScore } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Developer");
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const storedName = localStorage.getItem("name");

        if (!user && !storedName) {
          router.push("/login");
          return;
        }

        if (user?.user_metadata?.name) {
          setUserName(user.user_metadata.name);
        } else if (storedName) {
          setUserName(storedName);
        } else if (user?.email) {
          setUserName(user.email.split("@")[0]);
        }

        // Fetch interviews for authenticated user from Supabase interviews table
        let query = supabase.from("interviews").select("*").order("created_at", { ascending: false });
        if (user) {
          query = query.eq("user_id", user.id);
        }

        const { data: interviewsData } = await query;

        if (interviewsData) {
          const repaired = await Promise.all(
            interviewsData.map(async (item) => {
              const s = await repairAndExtractScore(item, supabase);
              return { ...item, score: s };
            })
          );
          setInterviews(repaired);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const totalInterviews = interviews.length;
  const scoresList = interviews.map((item) => extractInterviewScore(item));
  const averageScore = totalInterviews > 0
    ? Math.round(scoresList.reduce((acc, curr) => acc + curr, 0) / totalInterviews)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-transparent p-6 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-purple-950/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Welcome back, {userName}! 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Track your interview preparation progress and practice sessions.
          </p>
        </div>

        <Link href="/interview/new">
          <Button size="lg" className="shadow-md shadow-indigo-500/20">
            + Start New Interview
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <section className="grid gap-6 sm:grid-cols-3">
        <StatsCard
          title="Total Interviews"
          value={totalInterviews}
          trend={`${totalInterviews} sessions logged`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />

        <StatsCard
          title="Average Score"
          value={totalInterviews > 0 ? `${averageScore}%` : "N/A"}
          trend="Top candidate score"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
        />

        <StatsCard
          title="Completed Interviews"
          value={totalInterviews}
          trend="All sessions saved in Supabase"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </section>

      {/* Recent Interviews Section */}
      <section>
        <RecentInterviews interviews={interviews} />
      </section>
    </div>
  );
}
