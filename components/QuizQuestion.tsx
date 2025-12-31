"use client";

import { QuizQuestion as QuizQuestionType } from "@/lib/mocks/quizzes";
import { useState } from "react";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answerIndex: number) => void;
  selectedAnswer?: number;
  showResult?: boolean;
}

export default function QuizQuestion({
  question,
  onAnswer,
  selectedAnswer,
  showResult = false,
}: QuizQuestionProps) {
  const getOptionClass = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
        ? "bg-primary/30 border-primary glow-primary"
        : "hover:bg-bg-1 border-muted/30";
    }

    if (index === question.correctAnswer) {
      return "bg-green-500/30 border-green-500 glow-blue";
    }
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return "bg-red-500/30 border-red-500";
    }
    return "opacity-50 border-muted/20";
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 md:p-8 glow-primary">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text mb-4 sm:mb-6 break-words">
        {question.question}
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && onAnswer(index)}
            disabled={showResult}
            className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all ${getOptionClass(
              index
            )} ${!showResult ? "cursor-pointer" : "cursor-default"}`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm sm:text-base text-text break-words">
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
      {showResult && question.explanation && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-primary/10 rounded-xl border border-primary/20">
          <p className="text-xs sm:text-sm font-semibold text-primary2 mb-2">
            Explanation:
          </p>
          <p className="text-xs sm:text-sm text-muted">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

