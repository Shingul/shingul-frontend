"use client";

import Sidebar from "@/components/Sidebar";
import StudySetCard from "@/components/StudySetCard";
import { useStudySets } from "@/src/queries/studySets.queries";
import Link from "next/link";

export default function DashboardPage() {
  const { data: studySets, isLoading } = useStudySets();

  const totalDocs =
    studySets?.reduce((sum, s) => sum + (s.documentCount || 0), 0) || 0;
  const totalCards =
    studySets?.reduce((sum, s) => sum + (s.flashcardCount || 0), 0) || 0;
  const totalQuizzes =
    studySets?.reduce((sum, s) => sum + (s.quizCount || 0), 0) || 0;

  return (
    <div className="flex min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
      <Sidebar />
      <main className="flex-1 flex flex-col px-6 md:px-12 py-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-end mb-12 md:mb-16 gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Your Study Sets
            </h2>
            <p className="text-base md:text-lg text-[#1E1E1E]/60 font-light italic">
              Welcome back to your relaxing study space.
            </p>
          </div>
          <Link
            href="/study-sets/new"
            className="bg-[#66023C] text-white px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg shadow-[#66023C]/20 hover:opacity-90 transition-all w-fit shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create New
          </Link>
        </header>

        {/* Study Sets Grid */}
        {isLoading ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-20">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-xl bg-[#1E1E1E]/5 aspect-16/10 mb-6" />
                <div className="h-6 bg-[#1E1E1E]/5 rounded w-2/3 mb-3" />
                <div className="h-4 bg-[#1E1E1E]/5 rounded w-1/2" />
              </div>
            ))}
          </section>
        ) : studySets && studySets.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-20">
            {studySets.map((studySet) => (
              <StudySetCard key={studySet.id} studySet={studySet} />
            ))}
          </section>
        ) : (
          <section className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#66023C]/5 text-[#66023C] mb-6">
              <span className="material-symbols-outlined text-3xl">
                library_books
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-3">No study sets yet</h3>
            <p className="text-[#1E1E1E]/50 font-medium max-w-md mb-8">
              Create your first study set to start turning PDFs into interactive
              learning materials. You&apos;ve got this.
            </p>
            <Link
              href="/study-sets/new"
              className="bg-[#66023C] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-[#66023C]/20 hover:opacity-90 transition-all"
            >
              Create your first study set
            </Link>
          </section>
        )}

        {/* Performance Metrics */}
        {studySets && studySets.length > 0 && (
          <section className="mt-auto pt-10 border-t border-[#66023C]/5">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#66023C]/60 mb-8">
              Performance Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white/40 border border-[#66023C]/5 p-6 md:p-8 rounded-xl flex flex-col gap-4">
                <span className="text-xs font-bold text-[#1E1E1E]/40 uppercase tracking-wider">
                  Total Documents
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light">{totalDocs}</span>
                </div>
                <div className="w-full h-1 bg-[#66023C]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#66023C] transition-all duration-500"
                    style={{ width: `${Math.min(totalDocs * 5, 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-white/40 border border-[#66023C]/5 p-6 md:p-8 rounded-xl flex flex-col gap-4">
                <span className="text-xs font-bold text-[#1E1E1E]/40 uppercase tracking-wider">
                  Flashcards
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light">{totalCards}</span>
                  <span className="text-xs font-bold text-[#66023C]">
                    cards
                  </span>
                </div>
                <div className="w-full h-1 bg-[#66023C]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#66023C] transition-all duration-500"
                    style={{ width: `${Math.min(totalCards, 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-white/40 border border-[#66023C]/5 p-6 md:p-8 rounded-xl flex flex-col gap-4">
                <span className="text-xs font-bold text-[#1E1E1E]/40 uppercase tracking-wider">
                  Quizzes
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light">{totalQuizzes}</span>
                  <span className="text-xs font-bold text-[#66023C]">
                    total
                  </span>
                </div>
                <div className="w-full h-1 bg-[#66023C]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#66023C] transition-all duration-500"
                    style={{ width: `${Math.min(totalQuizzes * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
