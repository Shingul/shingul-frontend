"use client";

import { use, useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import LoadingSpinner from "@/components/LoadingSpinner";
import StartQuizModal from "@/components/modals/StartQuizModal";
import { useQuiz } from "@/src/queries/quizzes.queries";
import { PageContainer, Section, EmptyState } from "@/components/ui";
import Link from "next/link";

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id, quizId } = use(params);
  const { data: quiz, isLoading } = useQuiz(quizId);

  const [quizStarted, setQuizStarted] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userTimeLimit, setUserTimeLimit] = useState<number | undefined>(
    undefined
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Show start modal when quiz is loaded and not started
  useEffect(() => {
    if (!isLoading && quiz && !quizStarted) {
      setShowStartModal(true);
    }
  }, [isLoading, quiz, quizStarted]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && userTimeLimit && timeRemaining > 0 && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - auto submit
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, userTimeLimit, timeRemaining, showResults]);

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

  if (!quiz) {
    return (
      <div className="flex min-h-screen">
        <Sidebar activeTab="Study Sets" />
        <main className="flex-1 lg:ml-0">
          <PageContainer>
            <EmptyState
              title="Quiz not found"
              description="This quiz doesn't exist or has been removed."
              actionLabel="Back to Study Set"
              actionHref={`/study-sets/${id}`}
            />
          </PageContainer>
        </main>
      </div>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex min-h-screen">
        <Sidebar activeTab="Study Sets" />
        <main className="flex-1 lg:ml-0">
          <PageContainer>
            <EmptyState
              title="No questions in this quiz"
              description="This quiz doesn't have any questions yet."
              actionLabel="Back to Study Set"
              actionHref={`/study-sets/${id}`}
            />
          </PageContainer>
        </main>
      </div>
    );
  }

  const handleStartQuiz = (timeLimit?: number) => {
    setUserTimeLimit(timeLimit);
    setTimeRemaining(timeLimit || 0);
    setQuizStarted(true);
    setShowStartModal(false);
  };

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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
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
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (showResults) {
    const percentage = Math.round((score.correct / score.total) * 100);
    const totalQuestions = score.total;
    const correctCount = score.correct;
    const incorrectCount = totalQuestions - correctCount;

    let timeLabel = "—";
    if (userTimeLimit) {
      const usedSeconds = userTimeLimit - timeRemaining;
      if (usedSeconds > 0) {
        const mins = Math.floor(usedSeconds / 60);
        const secs = usedSeconds % 60;
        timeLabel = `${mins.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`;
      }
    }

    return (
      <div className="flex min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
        <Sidebar activeTab="Study Sets" />
        <main className="flex-1 lg:ml-0 flex flex-col">
          <PageContainer className="flex-1 flex flex-col">
            <Breadcrumbs
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Study Set", href: `/study-sets/${id}` },
                { label: quiz.title, href: `/study-sets/${id}/quizzes/${quizId}` },
                { label: "Results" },
              ]}
            />

            {/* Top summary cards */}
            <section className="mt-6 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white border border-[#F2E7D9] px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b5e4c]/70 mb-2">
                  Final Score
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {score.correct}/{score.total}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[11px] font-semibold text-[#DC2626]">
                    {percentage}%
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#F2E7D9] px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b5e4c]/70 mb-2">
                  Time Spent
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {timeLabel}
                  </p>
                  <span className="text-[11px] font-medium text-[#6b5e4c]">
                    mins
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#F2E7D9] px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b5e4c]/70 mb-2">
                  Percentile
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    12th
                  </p>
                  <span className="text-[11px] font-medium text-[#6b5e4c]">
                    top learners
                  </span>
                </div>
              </div>
            </section>

            {/* Review heading + counters */}
            <section className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-base sm:text-lg font-semibold tracking-tight">
                Review Questions
              </h2>
              <div className="flex items-center gap-3 text-xs sm:text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE2E2] px-3 py-1 text-[#DC2626]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  {incorrectCount} Incorrect
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1 text-[#15803D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                  {correctCount} Correct
                </span>
              </div>
            </section>

            {/* Review list */}
            <Section className="mb-10">
              <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const userAnswerIndex = selectedAnswers[index];
                  const correctIndex = question.correctAnswer;
                  const isCorrect = userAnswerIndex === correctIndex;
                  const questionNumber = (index + 1)
                    .toString()
                    .padStart(2, "0");

                  const userAnswerText =
                    userAnswerIndex === undefined
                      ? "No answer selected"
                      : question.options[userAnswerIndex];
                  const correctAnswerText = question.options[correctIndex];

                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl bg-white border border-[#F2E7D9] px-4 sm:px-6 py-5 sm:py-6 space-y-4"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                            isCorrect
                              ? "bg-[#DCFCE7] text-[#15803D]"
                              : "bg-[#FEE2E2] text-[#DC2626]"
                          }`}
                        >
                          {isCorrect ? "✓" : "✕"}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5e4c]/70">
                            Question {questionNumber}
                          </p>
                          <p className="text-sm sm:text-base font-medium">
                            {question.question}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!isCorrect && (
                          <div className="rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] px-4 py-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DC2626] mb-1.5">
                              Your Answer
                            </p>
                            <p className="text-sm text-[#7f1d1d]">
                              {userAnswerText}
                            </p>
                          </div>
                        )}
                        <div
                          className={`rounded-xl border px-4 py-3 ${
                            isCorrect
                              ? "border-[#DCFCE7] bg-[#F0FDF4]"
                              : "border-[#DCFCE7] bg-[#F0FDF4]"
                          }`}
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#15803D] mb-1.5">
                            Correct Answer
                          </p>
                          <p className="text-sm text-[#166534]">
                            {correctAnswerText}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-[#E5DACE]/70 pb-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers([]);
                  setShowResults(false);
                  setQuizStarted(false);
                  setUserTimeLimit(undefined);
                  setTimeRemaining(0);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#66023C] text-[#F9F2E9] text-sm font-bold tracking-[0.18em] uppercase hover:shadow-lg hover:shadow-[#66023C]/20 transition-all"
              >
                Try Again
                <span className="material-symbols-outlined text-base">
                  replay
                </span>
              </button>
              <Link
                href={`/study-sets/${id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#66023C] text-[#66023C] text-sm font-bold tracking-[0.18em] uppercase hover:bg-[#66023C]/5 transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  arrow_back
                </span>
                Back to Study Set
              </Link>
            </div>
          </PageContainer>
        </main>
      </div>
    );
  }

  // Show start screen if quiz hasn't started
  if (!quizStarted) {
    return (
      <div className="flex min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
        <Sidebar activeTab="Study Sets" />
        <main className="flex-1 lg:ml-0 flex flex-col">
          <PageContainer className="flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center">
              <Breadcrumbs
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Study Set", href: `/study-sets/${id}` },
                  { label: quiz.title },
                ]}
              />

              {/* Hero illustration block */}
              <div className="mt-8 mb-10 w-full max-w-md">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl shadow-[#66023C]/10 bg-white/60 border border-white/60 p-4">
                  <div className="w-full h-full rounded-xl bg-linear-to-br from-[#66023C]/20 via-[#F9F2E9] to-[#66023C]/10 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#66023C]/5" />
                    <div className="relative z-10 flex flex-col items-center gap-1 text-center px-6">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F9F2E9]/80">
                        Quiz Session
                      </span>
                      <p className="text-sm text-[#F9F2E9]/80">
                        Breathe. One question at a time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title + meta */}
              <div className="space-y-4 max-w-2xl text-center mb-10 px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight">
                  {quiz.title}
                </h1>
                <p className="text-base sm:text-lg text-[#6b5e4c] font-medium">
                  {quiz.questions.length} question
                  {quiz.questions.length === 1 ? "" : "s"} • Ready when you are
                </p>
              </div>

              {/* Primary call-to-action */}
              <div className="flex flex-col items-center gap-5">
                <button
                  type="button"
                  onClick={() => setShowStartModal(true)}
                  className="group relative flex min-w-[220px] items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-[#66023C] text-[#F9F2E9] text-sm sm:text-base font-bold tracking-[0.2em] uppercase transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#66023C]/30"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Quiz
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </span>
                </button>
                <p className="text-xs sm:text-sm font-medium text-[#6b5e4c]/70">
                  Take your time. There&apos;s no rush.
                </p>
              </div>
            </div>
          </PageContainer>

          <StartQuizModal
            isOpen={showStartModal}
            onClose={() => setShowStartModal(false)}
            onStart={handleStartQuiz}
            quizTitle={quiz.title}
            questionCount={quiz.questions.length}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
      <Sidebar activeTab="Study Sets" />
      <main className="flex-1 lg:ml-0 flex flex-col">
        <PageContainer className="flex-1 flex flex-col">
          <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
            <Breadcrumbs
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Study Set", href: `/study-sets/${id}` },
                { label: quiz.title },
              ]}
            />

            {/* Progress */}
            <div className="mb-10 mt-2">
              <div className="flex justify-between items-end mb-3">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#66023C]/70">
                  Current Progress
                </span>
                <div className="flex items-center gap-3">
                  {userTimeLimit && timeRemaining > 0 && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#E5DACE] text-[11px] font-semibold text-[#66023C]">
                      <span className="material-symbols-outlined text-xs">
                        schedule
                      </span>
                      {Math.floor(timeRemaining / 60)}:
                      {(timeRemaining % 60).toString().padStart(2, "0")}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm text-[#1E1E1E]/60 font-medium">
                    Question {currentQuestionIndex + 1}
                    <span className="mx-1 text-[#1E1E1E]/30">/</span>
                    {quiz.questions.length}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-[#E5DACE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#66023C] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-10">
              <h1 className="text-2xl md:text-3xl font-medium leading-snug text-center">
                {currentQuestion.question}
              </h1>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4 mb-10">
              {currentQuestion.options.map((option, index) => {
                const isSelected =
                  selectedAnswers[currentQuestionIndex] === index;
                const letter = String.fromCharCode(65 + index);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAnswer(index)}
                    className={`group flex w-full items-center justify-between p-5 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-[#66023C] bg-white shadow-sm"
                        : "border-[#E5DACE] bg-white/60 hover:border-[#66023C]/40 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                          isSelected
                            ? "bg-[#66023C] text-[#F9F2E9]"
                            : "bg-[#66023C]/5 text-[#66023C]"
                        }`}
                      >
                        {letter}
                      </span>
                      <p className="text-sm sm:text-base text-[#1E1E1E]">
                        {option}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-[#66023C]"
                          : "border-[#E5DACE]"
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full bg-[#66023C] transition-opacity ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5DACE]/70">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
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
                disabled={
                  selectedAnswers[currentQuestionIndex] === undefined
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#66023C] text-[#F9F2E9] text-sm font-bold tracking-[0.18em] uppercase hover:shadow-lg hover:shadow-[#66023C]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === quiz.questions.length - 1
                  ? "Submit Quiz"
                  : "Next Question"}
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
