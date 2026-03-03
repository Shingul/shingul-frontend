"use client";

import { use } from "react";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Flashcard from "@/components/Flashcard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useFlashcardDeck } from "@/src/queries/flashcards.queries";
import {
  PageContainer,
  PageHeader,
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
        <Sidebar />
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
        <Sidebar />
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
        <Sidebar />
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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        <PageContainer>
          <div className="mb-6">
            <Link
              href={`/study-sets/${id}`}
              className="text-sm text-text-muted hover:text-text transition-colors inline-flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Back to Study Set
            </Link>
          </div>

          <PageHeader
            title={flashcardDeck.title}
            subtitle={
              flashcardDeck.description ||
              "Take your time. Review at your own pace."
            }
          />

          {/* Progress Bar */}
          <Section className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              <span className="text-sm text-text-muted">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-bg-1 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%`, transitionDuration: "300ms" }}
              />
            </div>
          </Section>

          {/* Flashcard */}
          <Section className="mb-8">
            <Flashcard key={currentIndex} flashcard={currentCard} />
          </Section>

          {/* Navigation */}
          {!isComplete && (
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
              >
                Next
              </Button>
            </div>
          )}

          {/* Completion Message */}
          {isComplete && (
            <Card className="mt-8 text-center p-8">
              <div className="text-5xl mb-4 flex justify-center"><HiOutlineSparkles className="w-14 h-14 text-primary" /></div>
              <h2 className="text-heading text-2xl text-text mb-2">
                You&apos;ve completed this deck
              </h2>
              <p className="text-body text-base text-text-muted mb-6">
                Great work! You&apos;re making progress.
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
        </PageContainer>
      </main>
    </div>
  );
}
