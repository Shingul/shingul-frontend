"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { PageContainer } from "@/components/ui";
import { Button } from "@/components/ui";
import { HiOutlineSearch } from "react-icons/hi";

export default function NotFound() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        <PageContainer>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {/* 404 Number with gradient effect */}
            <div className="mb-8">
              <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary to-primary2 bg-clip-text text-transparent glow-primary">
                404
              </h1>
            </div>

            {/* Error Message */}
            <div className="glass rounded-2xl p-8 sm:p-12 max-w-2xl mb-8 glow-primary">
              <div className="text-6xl sm:text-7xl mb-6 flex justify-center"><HiOutlineSearch className="w-16 h-16 sm:w-20 sm:h-20 text-primary" /></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-4">
                Page Not Found
              </h2>
              <p className="text-base sm:text-lg text-text-muted mb-8 max-w-md mx-auto">
                Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/dashboard">
                  <Button className="w-full sm:w-auto">
                    <svg
                      className="w-5 h-5 inline-block mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go to Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 glass border border-muted/30 text-text rounded-xl font-semibold hover:bg-bg-1 transition-colors text-sm sm:text-base"
                >
                  <svg
                    className="w-5 h-5 inline-block mr-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                  Go Back
                </button>
              </div>
            </div>

            {/* Helpful Links */}
            <div className="flex flex-wrap gap-4 justify-center text-sm text-text-muted">
              <Link
                href="/dashboard"
                className="hover:text-text transition-colors"
              >
                Study Sets
              </Link>
              <span className="text-muted">•</span>
              <Link
                href="/settings"
                className="hover:text-text transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}

