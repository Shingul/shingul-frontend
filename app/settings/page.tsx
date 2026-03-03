"use client";

import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthUser } from "@/src/queries/auth.queries";
import { useSignOut } from "@/src/queries/auth.mutations";

export default function SettingsPage() {
  const router = useRouter();
  const { data: user } = useAuthUser();
  const signOutMutation = useSignOut();

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      // Error toast is handled by the mutation hook
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-0">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-6 sm:mb-8">
            Settings
          </h1>

          <div className="glass rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
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
                    onClick={handleSignOut}
                    disabled={signOutMutation.isPending}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    {signOutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-muted">
                    You&apos;re signed in as a guest.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary text-sm sm:text-base"
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
