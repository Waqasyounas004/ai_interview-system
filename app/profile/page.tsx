"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";


export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "User",
    email: "user@example.com",
    role: "Fullstack Developer",
    experienceLevel: "Mid-Level",
  });

  const [totalInterviews, setTotalInterviews] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const storedName = localStorage.getItem("name");
        const storedEmail = localStorage.getItem("email");

        if (!user && !storedName) {
          router.push("/login");
          return;
        }

        const currentName = user?.user_metadata?.name || storedName || "User";
        const currentEmail = user?.email || storedEmail || "user@example.com";

        setFormData((prev) => ({
          ...prev,
          name: currentName,
          email: currentEmail,
        }));

        if (user) {
          const { count } = await supabase
            .from("interviews")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);

          setTotalInterviews(count || 0);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSavedSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("name", formData.name);
      window.dispatchEvent(new Event("auth-change"));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              User Profile
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your personal preferences, target role, and interview preparation settings.
            </p>
          </div>

          <Link href="/interview/new">
            <Button size="md" className="shadow-md shadow-indigo-500/20">
              Start Practice Session
            </Button>
          </Link>
        </div>

        {/* Profile Card Header */}
        <Card className="p-6 sm:p-8 border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/30 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/20">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-zinc-800 bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              <span>{formData.name.charAt(0).toUpperCase()}</span>
            </div>

            {/* User Meta */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {formData.name}
                </h2>
                <span className="rounded-md bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  {formData.experienceLevel} Level
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {formData.role}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                ✉️ {formData.email}
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 text-xl">
              🎯
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Completed Sessions
              </p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">
                {totalInterviews}
              </p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 text-xl">
              ⭐
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Average Overall Score
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                88%
              </p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 text-xl">
              🚀
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Current Readiness
              </p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                Job-Ready
              </p>
            </div>
          </Card>
        </div>

        {/* Profile Settings Form */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Edit Account Information
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Update your profile details and target interview role preferences.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {savedSuccess && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                ✓ Profile changes saved successfully!
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Target Job Role"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                >
                  <option value="Junior">Junior (0-2 years)</option>
                  <option value="Mid-Level">Mid-Level (2-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                </select>
              </div>
            </div>

            {/* Target Technologies & Skills */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Primary Focus Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "Supabase", "FastAPI"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="md">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
