"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const redirectUrl = typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : "http://localhost:3000/reset-password";

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message || "Password reset failed. Please check your email.");
        return;
      }

      setSuccessMessage("✓ Reset instructions sent to your email! Please check your inbox.");
    } catch (err: any) {
      console.error("Supabase password reset error:", err);
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md p-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Reset Your Password
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Enter your email to receive real-time password reset instructions
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          ⚠️ {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} action="javascript:void(0);" className="space-y-4">
        <Input
          label="Registered Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
          Send Reset Instructions
        </Button>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            ← Back to Login
          </Link>
        </div>
      </form>
    </Card>
  );
}
