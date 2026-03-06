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

const PARTICIPANT_ID_KEY = (code: string) => `game:${code}:participantId`;

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

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

  const [participantId, setParticipantId] = useState<string | null>(null);
  console.log("gameID", gameId);

  useGameService.publicGameSession(gameId);

  useEffect(() => {
    if (!game?.code) return;
    try {
      const storedId = localStorage.getItem(PARTICIPANT_ID_KEY(game.code));
      if (storedId) {
        setParticipantId(storedId);
      }
    } catch {
      // ignore storage failures
    }
  }, [game?.code]);
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
        participantId: participantId || undefined,
      });
      setSubmittedAnswers(new Set([...submittedAnswers, currentQuestionIndex]));
  };
  const isDisabled = submittedAnswers.has(currentQuestionIndex) || isSubmitting || game?.status !== "live";
  console.log("submittedAnswers", submittedAnswers, isDisabled);

  // Explicitly leave game session when navigating away from this page
  // useEffect(() => {
  //   return () => {
  //     if (gameId) {
  //       useGameService.leavePublicGameSession(gameId);
  //     }
  //   };
  // }, [gameId]);

  const currentQuestion = quiz?.[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / (quiz?.length || 0)) * 100;

  if (isLoadingGameAndQuestions) {
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

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen">
        <Sidebar activeTab="Study Sets" />
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
    <div className="flex h-screen overflow-hidden bg-[#F9F2E9] text-[#1E1E1E]">
      <Sidebar activeTab="Study Sets" />
      <main className="flex-1 lg:ml-0 flex flex-col">
        {/* Progress Bar - Fixed at top */}
        <div className="shrink-0 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-[#1E1E1E]">
              Question {currentQuestionIndex + 1} of {quiz.length}
            </span>
            <span className="text-xs sm:text-sm text-[#1E1E1E]/60">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-[#E5DACE] rounded-full h-1.5 sm:h-2">
            <div
              className="bg-[#66023C] h-1.5 sm:h-2 rounded-full transition-all"
              style={{ width: `${progress}%`, transitionDuration: "300ms" }}
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
            {currentQuestion.choices.map((choice, index) => {
              const letter = OPTION_LETTERS[index] ?? String(index + 1);
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => handleAnswerSelect(choice)}
                  disabled={isDisabled}
                  className={`aspect-square rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 transition-all duration-200 border-2 shadow-lg active:scale-[0.98] ${
                    isDisabled
                      ? "opacity-60 cursor-not-allowed border-[#E5DACE] bg-white"
                      : "border-[#66023C]/20 bg-white hover:border-[#66023C]/40 hover:bg-[#66023C]/5 hover:shadow-xl cursor-pointer"
                  }`}
                >
                  <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#66023C] text-[#F9F2E9] font-bold text-xl sm:text-2xl flex items-center justify-center shrink-0">
                    {letter}
                  </span>
                  <span className="text-[#1E1E1E] font-semibold text-sm sm:text-base text-center line-clamp-3 leading-tight">
                    {choice}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
