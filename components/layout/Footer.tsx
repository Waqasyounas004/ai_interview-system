import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 py-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row text-sm text-zinc-500 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} AI Interview Platform. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</Link>
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</Link>
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Support</Link>
        </div>
      </div>
    </footer>
  );
}
