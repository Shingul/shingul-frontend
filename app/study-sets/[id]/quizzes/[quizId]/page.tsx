"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import QuizQuestion from "@/components/QuizQuestion";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getQuizById } from "@/lib/mocks/quizzes";
import Link from "next/link";

async function fetchQuiz(quizId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getQuizById(quizId);
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id, quizId } = use(params);
  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => fetchQuiz(quizId),
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(quiz?.timeLimit || 0);

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

  if (!quiz) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col justify-center items-center py-20 flex-1">
          <p className="text-text mb-4">Quiz not found</p>
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

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: quiz.questions.length };
  };

  const score = calculateScore();

  if (showResults) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-12 text-center glow-primary">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-4xl font-bold text-text mb-4">
                Quiz Complete!
              </h2>
              <div className="text-6xl font-bold text-primary2 mb-2">
                {score.correct}/{score.total}
              </div>
              <p className="text-muted mb-8">
                {Math.round((score.correct / score.total) * 100)}% Correct
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers([]);
                    setShowResults(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary"
                >
                  Retry
                </button>
                <Link
                  href={`/study-sets/${id}`}
                  className="px-6 py-3 glass border border-primary/50 text-primary rounded-xl font-semibold hover:bg-primary/10 transition-colors"
                >
                  Back to Study Set
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">{quiz.title}</h1>
              <p className="text-muted">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
            {quiz.timeLimit && (
              <div className="glass rounded-xl px-6 py-3">
                <span className="text-primary2 font-bold">
                  ⏱️ {Math.floor(timeRemaining / 60)}:
                  {(timeRemaining % 60).toString().padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-bg-1 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary2 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
            showResult={false}
          />

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 glass border border-muted/30 text-text rounded-xl font-semibold hover:bg-bg-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === quiz.questions.length - 1
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

