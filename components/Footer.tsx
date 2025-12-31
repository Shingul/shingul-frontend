import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="glass border-t border-muted/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Shingul"
                width={120}
                height={40}
                className="h-24 w-auto"
              />
            </Link>
            <p className="text-muted text-sm max-w-md">
              Turn your PDFs into interactive study games. Study smarter with
              AI-powered flashcards and quizzes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/study-sets/new"
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Create Study Set
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-text font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/settings"
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Settings
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} Shingul. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-muted hover:text-text transition-colors text-sm"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-muted hover:text-text transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-muted hover:text-text transition-colors text-sm"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
