"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Reset link sent to:", email);
    setIsSubmitted(true);
  }

  return (
    <Card className="mx-auto w-full max-w-md p-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Forgot Password
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Enter your email to receive password reset instructions
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4 text-center">
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-4 text-sm text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Reset link sent to <span className="font-semibold">{email}</span>! Check your inbox.
          </div>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              Return to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" size="lg" className="w-full mt-2">
            Send Reset Link
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              ← Back to Login
            </Link>
          </div>
        </form>
      )}
    </Card>
  );
}
