"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InterviewCard from "@/components/history/InterviewCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";


export default function HistoryPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const storedToken = localStorage.getItem("token");

        if (!user && !storedToken) {
          router.push("/login");
          return;
        }

        if (user) {
          const { data } = await supabase
            .from("interviews")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          const formatted = (data || []).map((item: any) => {
            const itemScore = typeof item.score === "number"
              ? item.score
              : (item.overall_feedback?.score || item.feedback?.score || 0);

            return {
              id: item.id,
              title: item.title || `${item.role} Practice`,
              role: item.role,
              level: item.level || item.difficulty || "Medium",
              date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent",
              questionsCount: 5,
              score: itemScore,
              feedback: {
                score: itemScore,
                summary: item.overall_feedback?.summary || "Completed technical interview practice.",
              },
            };
          });
          setInterviews(formatted);
        }
      } catch (error) {
        console.error("Error fetching history", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [router]);

  // Calculate high-level stats
  const totalInterviews = interviews.length;
  const avgScore = totalInterviews
    ? Math.round(
        interviews.reduce(
          (acc, item) => acc + (item.feedback?.score ?? 0),
          0
        ) / totalInterviews
      )
    : 0;
  const maxScore = totalInterviews
    ? Math.max(...interviews.map((item) => item.feedback?.score ?? 0))
    : 0;

  // Filter & sort logic
  const filteredInterviews = useMemo(() => {
    return interviews
      .filter((interview) => {
        const matchesSearch =
          interview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel =
          selectedLevel === "all" ||
          interview.level.toLowerCase() === selectedLevel.toLowerCase();

        return matchesSearch && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === "score") {
          return (b.feedback?.score ?? 0) - (a.feedback?.score ?? 0);
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [interviews, searchTerm, selectedLevel, sortBy]);

  return (
    <main className="min-h-[calc(100vh-8rem)] py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Interview History
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Review your past practice sessions, AI feedback, and performance metrics.
            </p>
          </div>

          <Link href="/interview/new">
            <Button size="md" className="shadow-md shadow-indigo-500/20">
              + New Interview
            </Button>
          </Link>
        </div>

        {/* Quick Stats Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Total Sessions
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
              {totalInterviews}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Average Score
            </p>
            <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalInterviews > 0 ? `${avgScore}%` : "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Highest Score
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalInterviews > 0 ? `${maxScore}%` : "N/A"}
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              placeholder="Search by title or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="all">All Levels</option>
              <option value="junior">Junior</option>
              <option value="mid-level">Mid-Level</option>
              <option value="senior">Senior</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "score")}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
            </select>
          </div>
        </div>

        {/* Interview Grid */}
        {filteredInterviews.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInterviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
              🔍
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
              No Interviews Found
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              We couldn't find any interview sessions matching your search or filters.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLevel("all");
                }}
              >
                Clear Filters
              </Button>
              <Link href="/interview/new">
                <Button>Start New Interview</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
