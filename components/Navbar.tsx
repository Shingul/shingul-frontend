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
  } catch (error) {
    console.error(error);
    // Guest mode - return null
    return null;
  }
}

export default function Navbar() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  return (
    <nav className="glass border-b border-muted/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Shingul"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted">{user.email}</span>
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-primary to-primary2 flex items-center justify-center text-white font-bold">
                  {user.email[0].toUpperCase()}
                </div>
              </>
            ) : (
              <span className="text-sm text-muted">Guest</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
