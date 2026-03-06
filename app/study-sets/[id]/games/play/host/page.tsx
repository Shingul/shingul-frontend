"use client";

import { use, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PageContainer, EmptyState } from "@/components/ui";

import { useGame } from "@/src/queries/games.queries";
import { useQuiz } from "@/src/queries/quizzes.queries";

import type { Player } from "@/src/types/api";
import { useGameService } from "@/src/hooks/use-game-service";

export default function HostPlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studySetId } = use(params);

  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") || "";

  const router = useRouter();
  const { data: game, isLoading: isLoadingGame } = useGame(gameId, {
    enabled: !!gameId,
    refetchOnMount: true,
  });
  useGameService.gameSessionTransmit(gameId);

  const quizId = game?.quizId;
  const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(quizId || "", {
    enabled: !!quizId,
  });

  const currentQuestionIndex = game?.currentQuestionIndex ?? 0;
  const timeRemaining = useGameService.serverTimer(
    game?.questionStartedAt,
    game?.secondsPerQuestion
  );

  useEffect(() => {
    if (!game) return;

    if (!game.isHost) {
      router.push(`/study-sets/${studySetId}/games/${gameId}/play/public`);
      return;
    }

    if (game.status === "ended") {
      return;
    }
  }, [game, gameId, router, studySetId]);

  const sortedPlayers = useMemo(() => {
    const players = game?.players ?? [];
    return [...players].sort((a, b) => b.score - a.score);
  }, [game?.players]);

  const activePlayers = sortedPlayers.length;

  if (isLoadingGame || isLoadingQuiz || !game || !quiz) {
    return (
      <div className="flex min-h-screen bg-[#F9F2E9]">
        <Sidebar activeTab="Study Sets" />
        <main className="flex-1 lg:ml-0">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen bg-[#F9F2E9]">
        <Sidebar activeTab="Study Sets" />
        <main className="flex-1 lg:ml-0">
          <PageContainer>
            <EmptyState
              title="Question not found"
              description="This question doesn't exist or the game has moved on."
              actionLabel="Back to Lobby"
              actionHref={`/study-sets/${studySetId}/games/${gameId}`}
            />
          </PageContainer>
        </main>
      </div>
    );
  }

  const timerDisplay =
    timeRemaining !== null
      ? `${String(Math.floor(timeRemaining / 60)).padStart(2, "0")}:${String(timeRemaining % 60).padStart(2, "0")}`
      : null;

  return (
    <div className="flex min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
      <Sidebar activeTab="Study Sets" />
      <main className="flex-1 lg:ml-0 flex flex-col">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#66023C]/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-[#66023C] rounded-lg flex items-center justify-center text-[#F9F2E9]">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <h2 className="text-[#1E1E1E] text-xl font-bold tracking-tight">
              {game.title || "Live Game"}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            {timerDisplay && (
              <div
                className={`flex items-center gap-2 ${
                  timeRemaining !== null && timeRemaining <= 10
                    ? "text-red-500"
                    : "text-[#66023C]"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  timer
                </span>
                <span className="text-sm font-semibold tracking-widest">
                  {timerDisplay}
                </span>
              </div>
            )}
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row p-4 sm:p-6 gap-6 max-w-[1440px] mx-auto w-full overflow-y-auto">
          {/* Left Side: Question Content */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="mb-2">
              <Breadcrumbs
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Study Set", href: `/study-sets/${studySetId}` },
                  {
                    label: "Game Lobby",
                    href: `/study-sets/${studySetId}/games/${gameId}`,
                  },
                  { label: "Host View" },
                ]}
              />
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#66023C]/5 overflow-hidden flex flex-col">
              {/* Decorative gradient header */}
              <div className="h-40 sm:h-56 relative bg-linear-to-br from-[#66023C]/20 via-[#F9F2E9] to-[#66023C]/10">
                <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#66023C] text-[#F9F2E9] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {game.title || "Quiz"}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-10 flex flex-col flex-1 justify-center items-center text-center">
                <p className="text-[#66023C]/60 text-sm font-semibold uppercase tracking-[0.2em] mb-4">
                  Question {currentQuestionIndex + 1} of{" "}
                  {quiz.questions.length}
                </p>
                <h1 className="text-[#1E1E1E] text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight max-w-3xl">
                  {currentQuestion.question}
                </h1>

                {/* Options display */}
                {currentQuestion.options && (
                  <div className="mt-8 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options.map(
                      (option: string, idx: number) => {
                        const letters = ["A", "B", "C", "D", "E", "F"]
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all ${
                            
                                "bg-[#66023C]/5 border-[#66023C]/30"
                            }`}
                          >
                            <span
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                "bg-[#66023C] text-white"
                              }`}
                            >
                              {letters[idx]}
                            </span>
                            <span
                              className={`text-sm font-medium ${
                                "text-[#66023C] font-bold"
                              }`}
                            >
                              {option}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#66023C]/5 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-[#66023C]/10 flex items-center justify-center text-[#66023C]">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <div>
                  <p className="text-[#1E1E1E]/60 text-xs font-medium uppercase">
                    Participants
                  </p>
                  <p className="text-[#1E1E1E] text-xl font-bold">
                    {activePlayers} Active
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#66023C]/5 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-[#66023C]/10 flex items-center justify-center text-[#66023C]">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                  <p className="text-[#1E1E1E]/60 text-xs font-medium uppercase">
                    Progress
                  </p>
                  <p className="text-[#1E1E1E] text-xl font-bold">
                    {Math.round(progress)}%
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#66023C]/5 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-[#66023C]/10 flex items-center justify-center text-[#66023C]">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <div>
                  <p className="text-[#1E1E1E]/60 text-xs font-medium uppercase">
                    Questions
                  </p>
                  <p className="text-[#1E1E1E] text-xl font-bold">
                    {currentQuestionIndex + 1} / {quiz.questions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Leaderboard Panel */}
          <aside className="w-full lg:w-96 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-[#66023C]/5 flex flex-col overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#66023C]/5 flex items-center justify-between bg-[#66023C]/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#66023C]">
                    emoji_events
                  </span>
                  <h3 className="text-[#1E1E1E] font-bold">Leaderboard</h3>
                </div>
                <span className="text-[#66023C]/60 text-xs font-bold uppercase tracking-tighter">
                  Q{currentQuestionIndex + 1}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[60vh]">
                {sortedPlayers.length === 0 && (
                  <div className="text-center py-8 text-[#1E1E1E]/40 text-sm">
                    No players yet
                  </div>
                )}
                {sortedPlayers.map((player, index) => (
                  <LeaderboardItem
                    key={player.id}
                    player={player}
                    rank={index + 1}
                  />
                ))}
              </div>
              {/* Host footer */}
              <div className="p-5 sm:p-6 bg-[#1E1E1E] text-[#F9F2E9]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest text-[#F9F2E9]/60">
                    Your Position
                  </p>
                  <span className="material-symbols-outlined text-sm text-[#F9F2E9]/60">
                    keyboard_arrow_up
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-full border border-[#F9F2E9]/20 flex items-center justify-center font-bold text-sm">
                    <span className="material-symbols-outlined text-base">
                      shield
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">Host View</p>
                    <p className="text-xs text-[#F9F2E9]/60 italic">
                      Moderating Quiz
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="p-4 sm:p-6 text-center text-[#1E1E1E]/40 text-xs shrink-0">
          <p>
            Game ID: {gameId.slice(0, 8).toUpperCase()} &bull; Powered by
            Shingul
          </p>
        </footer>
      </main>
    </div>
  );
}

function LeaderboardItem({
  player,
  rank,
}: {
  player: Player;
  rank: number;
}) {
  if (rank === 1) {
    return (
      <div className="flex items-center gap-4 p-4 bg-[#66023C] text-[#F9F2E9] rounded-xl shadow-md">
        <div className="size-8 rounded-full bg-[#F9F2E9]/20 flex items-center justify-center font-bold text-sm">
          1
        </div>
        <div className="bg-[#F9F2E9]/20 rounded-full size-10 flex items-center justify-center">
          <span className="material-symbols-outlined">face</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{player.nickname}</p>
          <p className="text-xs text-[#F9F2E9]/70">
            {player.score.toLocaleString()} points
          </p>
        </div>
        {player.isHost && (
          <span className="px-1.5 py-0.5 bg-[#F9F2E9]/20 rounded text-[10px] font-semibold shrink-0">
            Host
          </span>
        )}
      </div>
    );
  }

  if (rank <= 3) {
    return (
      <div className="flex items-center gap-4 p-4 bg-[#66023C]/5 border border-[#66023C]/10 rounded-xl">
        <div className="size-8 rounded-full bg-[#66023C]/10 text-[#66023C] flex items-center justify-center font-bold text-sm">
          {rank}
        </div>
        <div className="bg-[#66023C]/20 rounded-full size-10 flex items-center justify-center text-[#66023C]">
          <span className="material-symbols-outlined">
            {rank === 2 ? "face_2" : "face_3"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#1E1E1E] truncate">
            {player.nickname}
          </p>
          <p className="text-xs text-[#1E1E1E]/60">
            {player.score.toLocaleString()} points
          </p>
        </div>
        <div className="text-xs font-bold text-[#66023C] shrink-0">
          {player.isHost && (
            <span className="px-1.5 py-0.5 bg-[#66023C]/10 rounded text-[10px] font-semibold border border-[#66023C]/20">
              Host
            </span>
          )}
          {!player.isHost && `${player.score} pt`}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-3 hover:bg-[#66023C]/5 transition-colors rounded-lg group">
      <div className="size-8 text-center text-[#1E1E1E]/40 font-bold text-sm flex items-center justify-center">
        {rank}
      </div>
      <div className="bg-[#1E1E1E]/5 rounded-full size-10 flex items-center justify-center text-[#1E1E1E]/40">
        <span className="material-symbols-outlined">person</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium text-sm text-[#1E1E1E] truncate">
            {player.nickname}
          </p>
          <p className="text-xs font-bold text-[#1E1E1E] shrink-0 ml-2">
            {player.score.toLocaleString()} pt
          </p>
        </div>
      </div>
    </div>
  );
}
