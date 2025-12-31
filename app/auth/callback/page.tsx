"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface User {
  email: string;
}

interface AuthMeResponse {
  user: User | null;
}

async function fetchUser(): Promise<User | null> {
  try {
    const response = await apiFetch<AuthMeResponse>("/auth/me");
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "ok") {
      // Fetch user data to verify authentication
      fetchUser()
        .then((user) => {
          if (user) {
            // Update React Query cache
            queryClient.setQueryData(["user"], user);
            // Redirect to home
            router.push("/");
          } else {
            setError("Login cookie missing—check CORS/cookies");
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error("Auth callback error:", err);
          setError("Login cookie missing—check CORS/cookies");
          setIsLoading(false);
        });
    } else {
      // Handle error status (expired/invalid/locked)
      let errorMessage = "Authentication failed. Please try again.";
      if (status === "expired") {
        errorMessage =
          "The sign-in link has expired. Please request a new one.";
      } else if (status === "invalid") {
        errorMessage = "The sign-in link is invalid. Please request a new one.";
      } else if (status === "locked") {
        errorMessage = "Your account has been locked. Please contact support.";
      }

      setTimeout(() => {
        setError(errorMessage);
        setIsLoading(false);
      }, 0);
    }
  }, [searchParams, router, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <main className="w-full max-w-md">
          <div className="glass rounded-2xl p-8 text-center glow-primary">
            <div className="mb-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
            <p className="text-text">Completing sign in...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <main className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 glow-primary">
          {error ? (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-text">
                Authentication Error
              </h1>
              <div className="rounded-xl bg-red-500/20 p-4 text-red-400 border border-red-500/30">
                {error}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push("/login")}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary"
                >
                  Back to login
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 px-6 py-3 glass border border-muted/30 text-text rounded-xl font-semibold hover:bg-bg-1 transition-colors"
                >
                  Go home
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-text">Redirecting...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4">
          <main className="w-full max-w-md">
            <div className="glass rounded-2xl p-8 text-center glow-primary">
              <p className="text-text">Loading...</p>
            </div>
          </main>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
