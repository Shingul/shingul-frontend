"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
      <Sidebar />
      <main className="flex-1 lg:ml-0 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-black text-[#66023C]/90 tracking-tighter leading-none">
              404
            </h1>
          </div>

          {/* Card */}
          <div className="w-full bg-white rounded-2xl shadow-lg border border-[#66023C]/10 p-8 sm:p-12 mb-8">
            <div className="flex justify-center mb-6">
              <div className="size-16 sm:size-20 rounded-2xl bg-[#66023C]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#66023C] text-4xl sm:text-5xl">
                  search_off
                </span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-3">
              Page Not Found
            </h2>
            <p className="text-base sm:text-lg text-[#1E1E1E]/60 mb-8 max-w-md mx-auto leading-relaxed">
              The page you’re looking for doesn’t exist. It may have been moved,
              removed, or the URL might be incorrect.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#66023C] text-[#F9F2E9] font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-[#66023C]/20 transition-all"
              >
                <span className="material-symbols-outlined text-xl">home</span>
                Go to Dashboard
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border-2 border-[#66023C]/20 text-[#66023C] font-bold text-sm hover:bg-[#66023C]/5 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  arrow_back
                </span>
                Go Back
              </button>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-[#1E1E1E]/50">
            <Link
              href="/dashboard"
              className="font-medium hover:text-[#66023C] transition-colors"
            >
              Study Sets
            </Link>
            <span className="text-[#1E1E1E]/30">•</span>
            <Link
              href="/"
              className="font-medium hover:text-[#66023C] transition-colors"
            >
              Home
            </Link>
            <span className="text-[#1E1E1E]/30">•</span>
            <Link
              href="/settings"
              className="font-medium hover:text-[#66023C] transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
