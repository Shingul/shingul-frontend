"use client";

import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import StudySetCard from "@/components/StudySetCard";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { mockStudySets } from "@/lib/mocks/studySets";
import Link from "next/link";

async function fetchStudySets() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockStudySets;
}

export default function DashboardPage() {
  const { data: studySets, isLoading } = useQuery({
    queryKey: ["studySets"],
    queryFn: fetchStudySets,
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">
              Your Study Sets
            </h1>
            <Link
              href="/study-sets/new"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary text-sm sm:text-base text-center"
            >
              Create new
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : studySets && studySets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {studySets.map((studySet) => (
                <StudySetCard key={studySet.id} studySet={studySet} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No study sets yet"
              description="Create your first study set to start turning PDFs into interactive learning materials."
              actionLabel="Create new study set"
              actionHref="/"
            />
          )}
        </div>
      </main>
    </div>
  );
}
