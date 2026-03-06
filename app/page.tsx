"use client";

import Link from "next/link";
import CreateStudySetForm from "@/components/CreateStudySetForm";

const FEATURES = [
  {
    icon: "eco",
    title: "Gentle Interface",
    description:
      "A space designed for your mind to breathe. No notifications, no clutter, just clarity.",
  },
  {
    icon: "air",
    title: "Focused Sessions",
    description:
      "Timed intervals that respect your natural pace, helping you achieve deep flow states effortlessly.",
  },
  {
    icon: "auto_awesome_motion",
    title: "Smart Organization",
    description:
      "Our AI gently categorizes your PDF insights into logical, easy-to-digest study blocks.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
      <main className="flex flex-col items-center px-6 py-12 md:py-24 max-w-[1200px] mx-auto w-full">
        {/* Hero */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl">
          <h2 className="text-[#66023C] text-sm md:text-base font-bold uppercase tracking-[0.3em] mb-4">
            Search + Study Companion
          </h2>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8">
            Making Studying{" "}
            <span className="text-[#66023C] italic font-medium">Relaxing</span>
          </h1>
          <p className="text-[#1E1E1E]/60 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Shingul turns messy notes and heavy PDFs into gentle, focused study
            sessions. Nothing loud, nothing frantic &ndash; just a calm rhythm
            you can come back to every day.
          </p>
        </div>

        {/* Oversized Textbox Area */}
        <div className="w-full max-w-4xl">
          <CreateStudySetForm />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-24 md:mt-32 w-full">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-6 p-8 rounded-2xl transition-all hover:bg-white/30 border border-transparent hover:border-white/50"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#66023C]/5 text-[#66023C]">
                <span className="material-symbols-outlined text-2xl">
                  {feature.icon}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#1E1E1E]/50 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 md:mt-32 w-full bg-[#1E1E1E] rounded-[2.5rem] p-12 md:p-24 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#66023C]/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#e6a83d]/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
              Ready for a calmer way to learn?
            </h2>
            <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
              Join over 10,000 students who have traded stress for focus. Start
              your first session today.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link
                href="/login"
                className="w-full md:w-auto flex min-w-[240px] items-center justify-center rounded-full h-14 px-10 bg-[#66023C] text-white text-base font-bold transition-all hover:scale-[1.02] shadow-2xl shadow-[#66023C]/40"
              >
                Try Shingul Free
              </Link>
              <Link
                href="/dashboard"
                className="w-full md:w-auto flex min-w-[240px] items-center justify-center rounded-full h-14 px-10 border border-white/20 text-white text-base font-bold transition-all hover:bg-white/5"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="px-6 md:px-20 py-12 border-t border-[#1E1E1E]/5 mt-24">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-[#66023C]/40">
            <div className="size-5">
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
            <span className="text-[#1E1E1E]/40 text-sm font-bold tracking-tight">
              &copy; 2024 Shingul
            </span>
          </div>
          <div className="flex gap-8 md:gap-10">
            <Link
              href="#"
              className="text-[#1E1E1E]/40 text-xs font-bold uppercase tracking-widest hover:text-[#66023C] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[#1E1E1E]/40 text-xs font-bold uppercase tracking-widest hover:text-[#66023C] transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-[#1E1E1E]/40 text-xs font-bold uppercase tracking-widest hover:text-[#66023C] transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-[#1E1E1E]/40 text-xs font-bold uppercase tracking-widest hover:text-[#66023C] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
