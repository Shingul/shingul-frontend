"use client";

import { use, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import QuizQuestion from "@/components/QuizQuestion";
import { PageContainer, Section, Card, EmptyState } from "@/components/ui";

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
  console.log("gameId on host page", gameId);

  const router = useRouter();
    const { data: game, isLoading: isLoadingGame } = useGame( gameId, { 
        enabled: !!gameId,
        refetchOnMount: true,
    });
    console.log("game on host page", game);
  useGameService.gameSessionTransmit(gameId);

  const quizId = game?.quizId;
  const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(quizId || "", {
    enabled: !!quizId,
  });

  const currentQuestionIndex = game?.currentQuestionIndex ?? 0;
  const timeRemaining = useGameService.serverTimer(game?.questionStartedAt, game?.secondsPerQuestion);
  console.log("timeRemaining", timeRemaining);
  console.log("game?.questionStartedAt", game?.questionStartedAt);
  console.log("game?.secondsPerQuestion", game?.secondsPerQuestion);

  useEffect(() => {
    if (!game) return;
    console.log("game inside useEffect", game);

    if (!game.isHost) {
      router.push(`/study-sets/${studySetId}/games/${gameId}/play/public`);
      return;
    }

    // if (game.status === "lobby" && game.isHost) {
    //   router.push(`/study-sets/${studySetId}/games/${gameId}`);
    //   return;
    // }

    if (game.status === "ended") {
      // TODO: route to results
      return;
    }
  }, [game, gameId, router, studySetId]);

  // Leaderboard
  const sortedPlayers = useMemo(() => {
    const players = game?.players ?? [];
    return [...players].sort((a, b) => b.score - a.score);
  }, [game?.players]);

  const top10Players = sortedPlayers.slice(0, 10);
  const remainingPlayers = sortedPlayers.slice(10);

  if (isLoadingGame || isLoadingQuiz || !game || !quiz) {
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

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        <PageContainer>
          <div className="mb-4">
            <Link
              href={`/study-sets/${studySetId}/games/${gameId}`}
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
              Back to Lobby
            </Link>
          </div>

          {/* Header with Timer */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-text">{game.title || "Live Game"}</h1>

              {timeRemaining !== null && (
                <div className="flex items-center gap-2">
                  <div
                    className={`px-4 py-2 rounded-lg font-bold text-lg ${
                      timeRemaining <= 10
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-primary/20 text-primary border border-primary/30"
                    }`}
                  >
                    {timeRemaining}s
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm text-text-muted">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question */}
            <div className="lg:col-span-2 space-y-6">
              <Section>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text">Progress</span>
                  <span className="text-sm text-text-muted">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-bg-1 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress}%`, transitionDuration: "300ms" }}
                  />
                </div>
              </Section>

              <Section>
                <QuizQuestion question={currentQuestion} onAnswer={() => {}} showResult={false} />
              </Section>
            </div>

            {/* Leaderboard */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <div className="shrink-0 p-4 border-b border-muted/20">
                  <h2 className="text-lg font-bold text-text">Leaderboard</h2>
                  <p className="text-xs text-text-muted mt-1">
                    {sortedPlayers.length} player{sortedPlayers.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {top10Players.map((player, index) => (
                    <LeaderboardItem key={player.id} player={player} rank={index + 1} isTop10 />
                  ))}

                  {remainingPlayers.length > 0 && (
                    <>
                      <div className="my-3 border-t border-muted/20"></div>
                      <div className="text-xs font-semibold text-text-muted mb-2 px-2">Others</div>
                      {remainingPlayers.map((player, index) => (
                        <LeaderboardItem
                          key={player.id}
                          player={player}
                          rank={index + 11}
                          isTop10={false}
                        />
                      ))}
                    </>
                  )}

                  {sortedPlayers.length === 0 && (
                    <div className="text-center py-8 text-text-muted text-sm">No players yet</div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}

function LeaderboardItem({
  player,
  rank,
  isTop10,
}: {
  player: Player;
  rank: number;
  isTop10: boolean;
}) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (rank === 2) return "bg-gray-400/20 text-gray-300 border-gray-400/30";
    if (rank === 3) return "bg-orange-600/20 text-orange-400 border-orange-600/30";
    return "bg-muted/10 text-text-muted border-muted/20";
  };

  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
        isTop10 ? getRankColor(rank) : "bg-transparent border-transparent hover:bg-bg-1"
      }`}
    >
      <div className="flex items-center justify-center w-8 h-8 shrink-0">
        <span className={`font-bold text-sm ${rank <= 3 ? "text-current" : "text-text-muted"}`}>
          {rank}
        </span>
      </div>

      <div className="w-8 h-8 rounded-full bg-linear-to-r from-primary to-primary2 flex items-center justify-center text-white font-bold text-xs shrink-0">
        {player.nickname[0].toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-text truncate">{player.nickname}</span>
          {player.isHost && (
            <span className="px-1.5 py-0.5 bg-primary/15 text-primary rounded text-[10px] font-semibold shrink-0 border border-primary/20">
              Host
            </span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="font-bold text-sm text-text">{player.score}</div>
        <div className="text-xs text-text-muted">pts</div>
      </div>
    </div>
  );
}
