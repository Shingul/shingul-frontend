"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await apiFetch("/auth/email/start", {
        method: "POST",
        data: { email },
      });
      setMessage("Check your email (or backend logs) for the sign-in link.");
    } catch (error: unknown) {
      console.error("Login error:", error);
      // Still show success message even on error (security best practice)
      setMessage("Check your email (or backend logs) for the sign-in link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <main className="w-full max-w-md">
        <div className="glass rounded-2xl p-6 sm:p-8 glow-primary">
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold text-text">
            Sign in to Shingul
          </h1>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted">
            Enter your email address and we&apos;ll send you a magic link to
            sign in. Or continue as a guest to explore the app.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-text mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full glass rounded-xl px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            {message && (
              <div
                className={`rounded-xl p-3 text-sm ${
                  message.includes("Check your email")
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full px-6 py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send magic link"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-bg-0 text-muted">Or</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full px-6 py-3 glass border-2 border-primary/50 text-primary rounded-xl font-semibold hover:bg-primary/10 transition-colors"
          >
            Continue as Guest
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-muted hover:text-text transition-colors"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
