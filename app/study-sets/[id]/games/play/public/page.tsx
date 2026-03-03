"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGameAndQuestions } from "@/src/queries/games.queries";
import { useSubmitAnswer } from "@/src/queries/games.mutations";
import { EmptyState } from "@/components/ui";
import toast from "react-hot-toast";
import { useGameService } from "@/src/hooks/use-game-service";

const PARTICIPANT_TOKEN_KEY = (code: string) => `game:${code}:participantToken`;

// Shingul branding colors for options
const OPTION_COLORS = [
  { bg: "bg-[#7c6fff]", hover: "hover:bg-[#6b5ce6]", letter: "A" }, // Primary purple
  { bg: "bg-[#4dd0e1]", hover: "hover:bg-[#3bc0d1]", letter: "B" }, // Accent cyan
  { bg: "bg-[#9a8fff]", hover: "hover:bg-[#8a7fff]", letter: "C" }, // Primary light
  { bg: "bg-[#6dd9e8]", hover: "hover:bg-[#5dc9d8]", letter: "D" }, // Accent light
];

export default function ParticipantPlayPage({
  params,
}: {
  params: Promise<{ id: string; gameId: string }>;
}) {
  const { id: studySetId } = use(params);
  const { mutate: submitAnswerMutation, isPending: isSubmitting } = useSubmitAnswer();
  const searchParams = useSearchParams();
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(new Set());
  // const studySetId = searchParams.get("studySetId") || "";
  const gameId = searchParams.get("gameId") || "";
  const router = useRouter();
  const { data: gameAndQuestions, isLoading: isLoadingGameAndQuestions } = useGameAndQuestions(gameId);
  const game = gameAndQuestions?.game;
  const quiz = gameAndQuestions?.questions;
  const currentQuestionIndex = game?.currentQuestionIndex ?? 0;

 useGameService.publicGameSession(gameId);
  // Subscribe to game state changes
  useEffect(() => {
    if (!game) return;

    // Update current question if game state changes
    if (game.currentQuestion !== undefined) {
      // setCurrentQuestionIndex(game.currentQuestion - 1);
    }

    // If game completed, show results (or redirect to results page)
    if (game.status === "ended") {
      // TODO: Navigate to results page
      toast.success("Game ended!");
    }
    if(game.status === "lobby") {
      router.push(`/lobby?gameId=${gameId}&studySetId=${studySetId}`);
      return;
    }
  }, [game, studySetId, gameId, router]);

  const handleAnswerSelect = (choice: string) => {
    // if (isSubmitting || submittedAnswers.has(currentQuestionIndex)) return;
    // setSelectedAnswer(answerIndex);
    
    // Auto-submit on selection (Kahoot-style)
    handleSubmitAnswer(choice);
  };

  const handleSubmitAnswer = async (choice: string) => {
    const now = new Date();
    const timeUsedSeconds = Math.floor((now.getTime() - (game?.questionStartedAt ? new Date(game.questionStartedAt).getTime() : 0)) / 1000);
    console.log("timeUsedSeconds", timeUsedSeconds);
    console.log("game?.questionStartedAt", game?.questionStartedAt);
    console.log("now", now);
      submitAnswerMutation({
        gameSessionId: game?.id || "",
        questionId: quiz?.[currentQuestionIndex].id || "",
        choice,
        timeUsedSeconds,
      });
      setSubmittedAnswers(new Set([...submittedAnswers, currentQuestionIndex]));
  };
  const isDisabled = submittedAnswers.has(currentQuestionIndex) || isSubmitting || game?.status !== "live";
  console.log("submittedAnswers", submittedAnswers, isDisabled);

  if (isLoadingGameAndQuestions) {
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

  const currentQuestion = quiz?.[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / (quiz?.length || 0)) * 100;

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-0">
          <EmptyState
            title="Question not found"
            description="This question doesn't exist or the game has moved on."
            actionLabel="Back to Lobby"
            actionHref={`/lobby?gameId=${gameId}&studySetId=${studySetId}`}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-0 flex flex-col">
        {/* Progress Bar - Fixed at top */}
        <div className="shrink-0 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-text">
              Question {currentQuestionIndex + 1} of {quiz.length}
            </span>
            <span className="text-xs sm:text-sm text-text-muted">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-bg-1 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-primary h-1.5 sm:h-2 rounded-full transition-all"
              style={{ width: `${progress}%`, transitionDuration: "300ms" }}
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
              {currentQuestion.choices.map((choice, index) => {
                const colorConfig = OPTION_COLORS[index] || OPTION_COLORS[0];
                return (
                  <button key={choice} onClick={() => handleAnswerSelect(choice)} disabled={isDisabled} className={`${colorConfig.bg} ${colorConfig.hover} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""} aspect-square rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-200 transform shadow-xl hover:shadow-2xl active:scale-95`}>
                    <div className="text-white font-bold text-3xl sm:text-4xl md:text-5xl">
                      {colorConfig.letter}
                    </div>
                  </button>
                );
              })}
            </div>
        </div>
      </main>
    </div>
  );
}
