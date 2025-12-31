"use client";

import { use } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Flashcard from "@/components/Flashcard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getFlashcardDeck } from "@/lib/mocks/flashcards";
import Link from "next/link";

async function fetchFlashcards(studySetId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getFlashcardDeck(studySetId);
}

export default function FlashcardDeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: flashcards, isLoading } = useQuery({
    queryKey: ["flashcards", id],
    queryFn: () => fetchFlashcards(id),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex justify-center items-center py-20 flex-1">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col justify-center items-center py-20 flex-1">
          <p className="text-text mb-4">No flashcards found</p>
          <Link
            href={`/study-sets/${id}`}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary"
          >
            Back to Study Set
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleRate = (difficulty: "again" | "hard" | "good" | "easy") => {
    setCompleted(new Set([...completed, currentIndex]));
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

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

  const isComplete =
    currentIndex === flashcards.length - 1 && completed.has(currentIndex);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href={`/study-sets/${id}`}
              className="text-muted hover:text-text transition-colors text-sm"
            >
              ← Back to Study Set
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              <span className="text-sm text-muted">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-bg-1 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary2 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <Flashcard
            flashcard={currentCard}
            onRate={handleRate}
            showControls={true}
          />

          {/* Navigation */}
          {!isComplete && (
            <div className="mt-8 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-6 py-3 glass border border-muted/30 text-text rounded-xl font-semibold hover:bg-bg-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="px-6 py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {/* Completion Message */}
          {isComplete && (
            <div className="mt-8 glass rounded-2xl p-8 text-center glow-primary">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-text mb-2">Great job!</h2>
              <p className="text-muted mb-6">
                You&apos;ve completed all flashcards in this deck.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setCompleted(new Set());
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary"
                >
                  Study Again
                </button>
                <Link
                  href={`/study-sets/${id}`}
                  className="px-6 py-3 glass border border-muted/30 text-text rounded-xl font-semibold hover:bg-bg-1 transition-colors"
                >
                  Back to Study Set
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

