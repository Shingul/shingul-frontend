"use client";

import { use, useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import QuizQuestion from "@/components/QuizQuestion";
import LoadingSpinner from "@/components/LoadingSpinner";
import StartQuizModal from "@/components/modals/StartQuizModal";
import { useQuiz } from "@/src/queries/quizzes.queries";
import {
  PageContainer,
  PageHeader,
  Section,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineSparkles } from "react-icons/hi";

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
        <Sidebar />
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
        <Sidebar />
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
        <Sidebar />
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

            {/* Score Summary */}
            <Card className="text-center p-8 md:p-12 mb-8">
              <div className="text-5xl mb-6 flex justify-center"><HiOutlineSparkles className="w-14 h-14 text-primary" /></div>
              <h2 className="text-heading text-3xl text-text mb-4">
                Quiz Complete
              </h2>
              <div className="text-5xl md:text-6xl font-semibold text-primary mb-2">
                {score.correct}/{score.total}
              </div>
              <p className="text-body text-base text-text-muted">
                {percentage}% correct
              </p>
            </Card>

            {/* Review Section */}
            <Section title="Review Your Answers" className="mb-8">
              <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  return (
                    <Card key={question.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-heading text-base text-text">
                          Question {index + 1}
                        </h4>
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            isCorrect
                              ? "bg-success-light text-success border border-success/30"
                              : "bg-error/15 text-error border border-error/30"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                      <QuizQuestion
                        question={question}
                        onAnswer={() => {}}
                        selectedAnswer={userAnswer}
                        showResult={true}
                      />
                    </Card>
                  );
                })}
              </div>
            </Section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers([]);
                  setShowResults(false);
                  setQuizStarted(false);
                  setUserTimeLimit(undefined);
                  setTimeRemaining(0);
                }}
              >
                Try Again
              </Button>
              <Link href={`/study-sets/${id}`}>
                <Button variant="secondary">Back to Study Set</Button>
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
            <Card className="text-center p-8 md:p-12">
              <h1 className="text-heading text-3xl text-text mb-4">
                {quiz.title}
              </h1>
              <p className="text-body text-base text-text-muted mb-8">
                {quiz.questions.length} question
                {quiz.questions.length === 1 ? "" : "s"} • Ready when you are
              </p>
              <Button onClick={() => setShowStartModal(true)} size="lg">
                Start Quiz
              </Button>
            </Card>
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
            title={quiz.title}
            subtitle={`Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`}
            action={
              userTimeLimit && timeRemaining > 0 ? (
                <Card className="px-6 py-3">
                  <span className="text-primary font-semibold text-base">
                    ⏱️ {Math.floor(timeRemaining / 60)}:
                    {(timeRemaining % 60).toString().padStart(2, "0")}
                  </span>
                </Card>
              ) : undefined
            }
          />

          {/* Progress Bar */}
          <Section className="mb-8">
            <div className="w-full bg-bg-1 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%`, transitionDuration: "300ms" }}
              />
            </div>
          </Section>

          {/* Question */}
          <Section className="mb-8">
            <QuizQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              selectedAnswer={selectedAnswers[currentQuestionIndex]}
              showResult={false}
            />
          </Section>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
            >
              {currentQuestionIndex === quiz.questions.length - 1
                ? "Submit"
                : "Next"}
            </Button>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
