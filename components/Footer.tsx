import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="glass border-t border-muted/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4"
            >
              <Image
                src="/logo.png"
                alt="Shingul"
                width={120}
                height={40}
                className="h-16 sm:h-20 md:h-24 w-auto"
              />
            </Link>
            <p className="text-muted text-xs sm:text-sm max-w-md">
              Turn your PDFs into interactive study games. Study smarter with
              AI-powered flashcards and quizzes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Quick Links
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
                >
                  Create Study Set
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-text font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Support
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  href="/settings"
                  className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
                >
                  Settings
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted/20 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Shingul. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a
              href="#"
              className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
