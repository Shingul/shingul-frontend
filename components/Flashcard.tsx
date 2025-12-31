"use client";

import { useState } from "react";
import { Flashcard as FlashcardType } from "@/lib/mocks/flashcards";

interface FlashcardProps {
  flashcard: FlashcardType;
  onRate?: (difficulty: "again" | "hard" | "good" | "easy") => void;
  showControls?: boolean;
}

export default function Flashcard({
  flashcard,
  onRate,
  showControls = true,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className={`glass rounded-2xl p-8 min-h-[400px] flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
          isFlipped ? "rotate-y-180" : ""
        } glow-primary`}
        onClick={handleFlip}
      >
        <div className="text-center">
          {!showAnswer ? (
            <div>
              <p className="text-sm text-muted mb-4">Question</p>
              <h2 className="text-2xl font-bold text-text">{flashcard.front}</h2>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted mb-4">Answer</p>
              <p className="text-xl text-text">{flashcard.back}</p>
            </div>
          )}
        </div>
      </div>

      {showControls && showAnswer && (
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => onRate?.("again")}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Again
          </button>
          <button
            onClick={() => onRate?.("hard")}
            className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
          >
            Hard
          </button>
          <button
            onClick={() => onRate?.("good")}
            className="px-4 py-2 bg-primary2/20 text-primary2 rounded-lg hover:bg-primary2/30 transition-colors"
          >
            Good
          </button>
          <button
            onClick={() => onRate?.("easy")}
            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            Easy
          </button>
        </div>
      )}

      {!showAnswer && (
        <div className="mt-6 text-center">
          <button
            onClick={handleFlip}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary"
          >
            Show Answer
          </button>
        </div>
      )}
    </div>
  );
}

