"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthUser } from "@/src/queries/auth.queries";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user } = useAuthUser();

  return (
    <header className="glass border-b border-muted/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo.png"
              alt="Shingul"
              width={220}
              height={80}
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
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

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user && !user.isGuest ? (
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted hover:text-text transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-muted/20 py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted hover:text-text transition-colors text-sm font-medium px-2"
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted hover:text-text transition-colors text-sm font-medium px-2"
              >
                Pricing
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted hover:text-text transition-colors text-sm font-medium px-2"
              >
                Dashboard
              </Link>
              {user ? (
                <>
                  <Link
                    href="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-muted hover:text-text transition-colors px-2"
                  >
                    {user.email}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-muted hover:text-text transition-colors px-2"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 glass border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors text-sm mx-2"
                  >
                    Try as Guest
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
