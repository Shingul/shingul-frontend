"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSignOut } from "@/src/queries/auth.mutations";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const mainNav: NavItem[] = [
  { label: "Study Sets", href: "/dashboard", icon: "library_books" },
  // { label: "Quizzes", href: "/dashboard#quizzes", icon: "quiz" },
  // { label: "Recent Activity", href: "/dashboard#recent", icon: "history" },
];

const bottomNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: "settings" },
];

interface SidebarProps {
  activeTab?: string;
}

export default function Sidebar({ activeTab }: SidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const signOut = useSignOut();

  const handleLogout = () => {
    signOut.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  const isActive = (item: NavItem) => {
    if (activeTab) return item.label === activeTab;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-white/50 backdrop-blur border border-[#1E1E1E]/5 rounded-lg text-[#1E1E1E]/60 hover:text-[#1E1E1E] transition-colors"
        aria-label="Toggle sidebar"
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
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 border-r border-[#66023C]/10 bg-[#F9F2E9] flex flex-col justify-between p-8 lg:min-h-screen transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            {/* <Link href="/" className="flex items-center gap-2">
              <div className="size-5 text-[#66023C]">
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
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#66023C] uppercase">
                Shingul
              </h1>
            </Link> */}
            <p className="text-xs font-medium text-[#1E1E1E]/40 tracking-widest uppercase">
              Minimalist Learning
            </p>
          </div>

          {/* Main nav */}
          <nav className="flex flex-col gap-2">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive(item)
                    ? "bg-[#66023C] text-white"
                    : "text-[#1E1E1E]/70 hover:bg-[#66023C]/5 hover:text-[#66023C]"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            ))}

            <div className="h-px bg-[#66023C]/5 my-4" />

            {/* Settings */}
            {bottomNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive(item)
                    ? "bg-[#66023C] text-white"
                    : "text-[#1E1E1E]/70 hover:bg-[#66023C]/5 hover:text-[#66023C]"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout at very bottom */}
        <button
          onClick={handleLogout}
          disabled={signOut.isPending}
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#1E1E1E]/70 hover:text-[#66023C] transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span className="text-sm font-semibold">
            {signOut.isPending ? "Logging out..." : "Logout"}
          </span>
        </button>
      </aside>
    </>
  );
}
