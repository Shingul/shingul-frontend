"use client";

import Sidebar from "@/components/Sidebar";
import StudySetCard from "@/components/StudySetCard";
import { EmptyState, PageContainer, PageHeader, Button, CardSkeleton } from "@/components/ui";
import { useStudySets } from "@/src/queries/studySets.queries";
import Link from "next/link";
import { HiOutlineBookOpen } from "react-icons/hi";

export default function DashboardPage() {
  const { data: studySets, isLoading } = useStudySets();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        <PageContainer>
          <PageHeader
            title="Your Study Sets"
            subtitle="Take this one step at a time. You're making progress."
            action={
              studySets && studySets.length > 0 ? (
                <Link href="/study-sets/new">
                  <Button>Create new</Button>
                </Link>
              ) : undefined
            }
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : studySets && studySets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studySets.map((studySet) => (
                <StudySetCard key={studySet.id} studySet={studySet} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No study sets yet"
              description="Create your first study set to start turning PDFs into interactive learning materials. You've got this."
              icon={<HiOutlineBookOpen className="w-16 h-16 text-primary" />}
              actionLabel="Create your first study set"
              actionHref="/study-sets/new"
            />
          )}
        </PageContainer>
      </main>
    </div>
  );
}
