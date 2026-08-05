import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <SignupForm />
    </main>
  );
}
