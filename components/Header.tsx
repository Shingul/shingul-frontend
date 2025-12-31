"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
  } catch {
    // Guest mode - return null
    return null;
  }
}

export default function Header() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  return (
    <header className="glass border-b border-muted/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Shingul"
              width={220}
              height={80}
              className="h-24 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#features"
              className="text-muted hover:text-text transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-muted hover:text-text transition-colors text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="text-muted hover:text-text transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/settings"
                  className="text-sm text-muted hover:text-text transition-colors"
                >
                  {user.email}
                </Link>
                <Link href="/settings">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-primary to-primary2 flex items-center justify-center text-white font-bold hover:opacity-90 transition-opacity">
                    {user.email[0].toUpperCase()}
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-muted hover:text-text transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 glass border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors text-sm"
                >
                  Try as Guest
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
