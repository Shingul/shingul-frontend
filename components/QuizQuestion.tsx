"use client";

import type { QuizQuestion as QuizQuestionType } from "@/src/types/api";
import Card from "./ui/Card";

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
        ? "bg-primary/15 border-primary/30 text-primary"
        : "hover:bg-bg-1 border-border text-text";
    }

    if (index === question.correctAnswer) {
      return "bg-success-light border-success/30 text-success";
    }
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return "bg-error/15 border-error/30 text-error";
    }
    return "opacity-40 border-border text-text-muted";
  };

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-heading text-xl md:text-2xl text-text mb-6 wrap-break-word">
        {question.question}
      </h2>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && onAnswer(index)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${getOptionClass(
              index
            )} ${!showResult ? "cursor-pointer" : "cursor-default"}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-bg-2 border border-border text-text-muted flex items-center justify-center font-semibold text-sm shrink-0">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-base text-current wrap-break-word">
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
      {showResult && question.explanation && (
        <div className="mt-6 p-4 bg-bg-1 rounded-xl border border-border">
          <p className="text-sm font-medium text-text mb-2">Explanation</p>
          <p className="text-sm text-text-muted">{question.explanation}</p>
        </div>
      )}
    </Card>
  );
}
