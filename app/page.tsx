"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function Home() {
  // Mirrors the auth check in components/layout/Navbar.tsx so the "Start
  // Interview" CTAs below go straight into the interview flow for a logged-in
  // user instead of always sending them back through signup/login.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setIsLoggedIn(!!data?.session || !!localToken);
    };

    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    window.addEventListener("auth-change", checkAuthStatus);

    return () => {
      authListener?.subscription?.unsubscribe();
      window.removeEventListener("auth-change", checkAuthStatus);
    };
  }, []);

  const primaryCtaHref = isLoggedIn ? "/interview/new" : "/signup";
  const primaryCtaLabel = isLoggedIn ? "Start Interview" : "Start Practice Free";
  const secondaryCtaHref = isLoggedIn ? "/interview/new" : "/login";
  const secondaryCtaLabel = isLoggedIn ? "Start New Interview" : "Get Started Now";

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-20 sm:py-28 text-center">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/3 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* AI Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur-sm dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          ✨ Next-Gen AI Practice Platform
        </div>

        {/* Main Title */}
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
          Master Your Next Tech Interview with{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            AI Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Practice realistic, role-specific technical questions, receive instant actionable feedback, and track your progress to land your dream job.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href={primaryCtaHref}>
            <Button size="lg" className="px-8 py-3.5 shadow-lg shadow-indigo-500/25">
              {primaryCtaLabel}
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="px-8 py-3.5">
              Explore Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Engineered to boost your confidence and interview technical performance.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="hover:border-indigo-500/50 hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              AI Practice Interviews
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Simulate realistic interview scenarios tailored for Frontend, Backend, Full Stack, and DevOps roles.
            </p>
          </Card>

          <Card className="hover:border-indigo-500/50 hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Instant Feedback
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Get immediate scoring breakdowns, technical accuracy analysis, and key areas of improvement.
            </p>
          </Card>

          <Card className="hover:border-indigo-500/50 hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Track Progress
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Monitor your average score trends, past interview history, and skill improvements over time.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-b from-indigo-50/50 to-transparent p-10 dark:border-indigo-900/50 dark:from-indigo-950/30">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
            Ready for your next interview?
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Join thousands of developers leveling up their interview readiness.
          </p>

          <Link href={secondaryCtaHref} className="mt-6 inline-block">
            <Button size="lg" className="px-8 py-3.5 shadow-lg shadow-indigo-500/25">
              {secondaryCtaLabel}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
