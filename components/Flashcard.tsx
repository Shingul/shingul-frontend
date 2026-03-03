"use client";

import { useState } from "react";
import type { Flashcard as FlashcardType } from "@/src/types/api";
import Card from "./ui/Card";

interface FlashcardProps {
  flashcard: FlashcardType;
}

export default function Flashcard({ flashcard }: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Card
        hover
        onClick={handleFlip}
        className="min-h-[320px] md:min-h-[400px] flex flex-col justify-center items-center cursor-pointer"
      >
        <div className="text-center px-4 md:px-8">
          {!showAnswer ? (
            <div>
              <p className="text-sm text-text-muted mb-4 font-medium">
                Question
              </p>
              <h2 className="text-heading text-xl md:text-2xl text-text wrap-break-word">
                {flashcard.front}
              </h2>
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-muted mb-4 font-medium">
                Answer
              </p>
              <p className="text-body text-lg md:text-xl text-text wrap-break-word">
                {flashcard.back}
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 text-center">
        <button
          onClick={handleFlip}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark active:scale-[0.98] transition-all text-base"
        >
          {!showAnswer ? "Show Answer" : "Show Question"}
        </button>
      </div>
    </div>
  );
}
