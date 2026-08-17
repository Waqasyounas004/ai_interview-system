"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Step 11 — Check session on mount and log data.session
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Supabase session:", data.session);

      const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setIsLoggedIn(!!data?.session || !!localToken);
    };

    checkAuthStatus();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Changed:", event, session);
      setIsLoggedIn(!!session);
      if (!session) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
      }
    });

    window.addEventListener("auth-change", checkAuthStatus);

    return () => {
      authListener?.subscription?.unsubscribe();
      window.removeEventListener("auth-change", checkAuthStatus);
    };
  }, []);

  // Step 10 — Handle Logout Flow
  const handleLogout = async () => {
    await supabase.auth.signOut();

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      window.dispatchEvent(new Event("auth-change"));
    }

    setIsLoggedIn(false);
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history", label: "History" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/20">
            AI
          </div>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            Interview<span className="text-indigo-600 dark:text-indigo-400">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Show Logout when Logged In, otherwise Show Login */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}

          <Link
            href="/interview/new"
            className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 sm:inline-block"
          >
            Start Practice
          </Link>
        </div>
      </div>
    </header>
  );
}
