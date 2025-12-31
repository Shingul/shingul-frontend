"use client";

import Sidebar from "@/components/Sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

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
    return null;
  }
}

async function logout(): Promise<void> {
  await apiFetch("/auth/logout", {
    method: "POST",
  });
}

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/");
    },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-text mb-8">Settings</h1>

          <div className="glass rounded-2xl p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text mb-4">Account</h2>
              {user ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Email
                    </label>
                    <div className="glass rounded-xl px-4 py-3 text-text">
                      {user.email}
                    </div>
                  </div>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="px-6 py-3 bg-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted">
                    You&apos;re signed in as a guest.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-muted/20 pt-6">
              <h2 className="text-xl font-bold text-text mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text font-semibold">Dark Mode</p>
                    <p className="text-sm text-muted">Always enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
