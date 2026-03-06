"use client";

import { use } from "react";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Flashcard from "@/components/Flashcard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useFlashcardDeck } from "@/src/queries/flashcards.queries";
import {
  PageContainer,
  Section,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import Link from "next/link";
import { HiOutlineSparkles } from "react-icons/hi";

export default function FlashcardDeckPage({
  params,
}: {
  params: Promise<{ id: string; deckId: string }>;
}) {
  const { id, deckId } = use(params);
  const { data: flashcardDeck, isLoading } = useFlashcardDeck(deckId);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar activeTab="Study Sets" />
        <main className="flex-1 lg:ml-0">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    );
  }

  if (!flashcardDeck) {
    return (
      <div className="flex min-h-screen">
        <Sidebar activeTab="Study Sets" />
        <main className="flex-1 lg:ml-0">
          <PageContainer>
            <EmptyState
              title="Flashcard deck not found"
              description="This deck doesn't exist or has been removed."
              actionLabel="Back to Study Set"
              actionHref={`/study-sets/${id}`}
            />
          </PageContainer>
        </main>
      </div>
    );
  }

  const flashcards = flashcardDeck.flashcards;

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex min-h-screen">
        <Sidebar activeTab="Study Sets" />
        <main className="flex-1 lg:ml-0">
          <PageContainer>
            <EmptyState
              title="No flashcards in this deck"
              description="This deck is empty. You can generate flashcards from your study materials."
              actionLabel="Back to Study Set"
              actionHref={`/study-sets/${id}`}
            />
          </PageContainer>
        </main>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isComplete = currentIndex === flashcards.length - 1;

  return (
    <div className="flex min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
      <Sidebar activeTab="Study Sets" />
      <main className="flex-1 lg:ml-0 flex flex-col">
        <PageContainer className="flex-1 flex flex-col">
          <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col">
            <Breadcrumbs
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Study Set", href: `/study-sets/${id}` },
                { label: flashcardDeck.title },
              ]}
            />

            {/* Heading */}
            <div className="mt-4 mb-8 text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight">
                {flashcardDeck.title}
              </h1>
              <p className="text-sm sm:text-base text-[#6b5e4c] font-medium">
                {flashcardDeck.description ||
                  "Flip through, slowly. Let each card sink in."}
              </p>
            </div>

            {/* Progress */}
            <Section className="mb-8">
              <div className="flex items-end justify-between mb-3">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#66023C]/70">
                  Current Progress
                </span>
                <span className="text-xs sm:text-sm text-[#1E1E1E]/60 font-medium">
                  Card {currentIndex + 1}
                  <span className="mx-1 text-[#1E1E1E]/30">/</span>
                  {flashcards.length} • {Math.round(progress)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#E5DACE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#66023C] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Section>

            {/* Flashcard Surface */}
            <Section className="mb-10">
              <div className="relative">
                <div className="absolute inset-0 -z-10 translate-y-4 scale-[0.97] rounded-3xl bg-[#E5E1DA]/60 blur-xl" />
                <Card className="rounded-3xl border border-white/80 bg-white/80 shadow-xl shadow-[#66023C]/10 p-4 sm:p-6 md:p-8">
                  <Flashcard key={currentIndex} flashcard={currentCard} />
                </Card>
              </div>
            </Section>

            {/* Navigation */}
            {!isComplete && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5DACE]/70">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#66023C] text-[#66023C] text-sm font-bold tracking-[0.18em] uppercase hover:bg-[#66023C]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_back
                  </span>
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === flashcards.length - 1}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#66023C] text-[#F9F2E9] text-sm font-bold tracking-[0.18em] uppercase hover:shadow-lg hover:shadow-[#66023C]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next Card
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </button>
              </div>
            )}

            {/* Completion Message */}
            {isComplete && (
              <Card className="mt-10 text-center p-8 rounded-3xl bg-white/80 border border-white/80 shadow-lg shadow-[#66023C]/10">
                <div className="text-5xl mb-4 flex justify-center">
                  <HiOutlineSparkles className="w-14 h-14 text-[#66023C]" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  You&apos;ve completed this deck
                </h2>
                <p className="text-sm sm:text-base text-[#6b5e4c] mb-6">
                  Great work. Review again, or return to your study set.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setCurrentIndex(0);
                    }}
                  >
                    Study Again
                  </Button>
                  <Link href={`/study-sets/${id}`}>
                    <Button variant="secondary">Back to Study Set</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
