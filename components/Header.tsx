"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/src/queries/auth.queries";
import Image from "next/image";

const STUDY_TIME_KEY = "shingul:studyTimeMs";

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "Just started";
  if (minutes < 60) return `${minutes} min studied`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (rem === 0) return `${hours} hr studied`;
  return `${hours} hr ${rem} min studied`;
}

export default function Header() {
  const { data: user } = useAuthUser();
  const [now, setNow] = useState<Date>(new Date());
  const [studyMs, setStudyMs] = useState<number>(0);
  const [locationLabel, setLocationLabel] = useState("Local time");

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parts = tz.split("/");
    if (parts.length === 2) {
      setLocationLabel(parts[1].replace(/_/g, " "));
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STUDY_TIME_KEY);
      if (stored) setStudyMs(parseInt(stored, 10) || 0);
    } catch {
      // ignore
    }

    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const total = elapsed + studyMs;
      setStudyMs(total);
      try {
        localStorage.setItem(STUDY_TIME_KEY, String(total));
      } catch {
        // ignore
      }
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeString = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(now);

  const studyLabel = formatDuration(studyMs);

  const initial =
    user && !user.isGuest && user.email ? user.email[0].toUpperCase() : "";

  return (
    <header className="px-6 md:px-20 py-6 md:py-8">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Left: Logo + Dashboard */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center  text-[#66023C]">
            {/* <div className="size-6">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                  fill="currentColor"
                />
              </svg>
            </div> */}
            <Image
              src="/shingul-logo.png"
              alt="Shingul"
              width={50}
              height={50}
              priority
              className="object-contain"
            />
            <span className="text-[#1E1E1E] text-xl font-extrabold tracking-tight">
              Shingul
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="text-[#1E1E1E]/70 hover:text-[#66023C] text-sm font-semibold transition-colors"
          >
            Dashboard
          </Link>
        </div>

        {/* Right: Time + Profile */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-xs font-semibold text-[#1E1E1E]/50">
              {locationLabel} | {timeString}
            </span>
            <span className="text-[10px] font-medium text-[#1E1E1E]/30">
              {studyLabel}
            </span>
          </div>

          {user && !user.isGuest ? (
            <Link
              href="/settings"
              className="h-10 w-10 rounded-full border-2 border-[#66023C]/20 bg-[#66023C] text-white flex items-center justify-center text-sm font-bold hover:opacity-90 transition"
            >
              {initial}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-full h-10 px-5 bg-[#66023C] text-white text-sm font-bold transition-all hover:opacity-90 shadow-lg shadow-[#66023C]/20"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
