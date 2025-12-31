"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getGameById } from "@/lib/mocks/games";
import Link from "next/link";

async function fetchGame(gameId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getGameById(gameId);
}

export default function GameLobbyPage({
  params,
}: {
  params: Promise<{ id: string; gameId: string }>;
}) {
  const { id, gameId } = use(params);
  const { data: game, isLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => fetchGame(gameId),
  });

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

  if (!game) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col justify-center items-center py-20 flex-1">
          <p className="text-text mb-4">Game not found</p>
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

  const statusColors = {
    waiting: "bg-primary2/20 text-primary2",
    active: "bg-green-500/20 text-green-400",
    completed: "bg-gray-500/20 text-gray-300",
  };

  const statusLabels = {
    waiting: "Waiting",
    active: "Active",
    completed: "Completed",
  };

  const isHost = game.players.some((p) => p.isHost);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-0">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <Link
              href={`/study-sets/${id}`}
              className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
            >
              ← Back to Study Set
            </Link>
          </div>

          {/* Game Code */}
          <div className="glass rounded-2xl p-6 sm:p-8 text-center mb-6 sm:mb-8 glow-primary">
            <p className="text-xs sm:text-sm text-muted mb-2">Game Code</p>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary2 mb-3 sm:mb-4">
              {game.code}
            </div>
            <span
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${statusColors[game.status]}`}
            >
              {statusLabels[game.status]}
            </span>
          </div>

          {/* Players List */}
          <div className="glass rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-text mb-4 sm:mb-6">
              Players ({game.players.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {game.players.map((player) => (
                <div
                  key={player.id}
                  className="glass rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary to-primary2 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                    {player.nickname[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-text text-sm sm:text-base truncate">
                        {player.nickname}
                      </span>
                      {player.isHost && (
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold flex-shrink-0">
                          Host
                        </span>
                      )}
                    </div>
                    {game.status !== "waiting" && (
                      <p className="text-xs sm:text-sm text-muted">
                        Score: {player.score}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Info */}
          {game.status === "active" && (
            <div className="glass rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-text mb-3 sm:mb-4">
                Game Progress
              </h3>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="w-full bg-bg-1 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-primary2 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          game.currentQuestion && game.totalQuestions
                            ? (game.currentQuestion / game.totalQuestions) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-muted flex-shrink-0">
                  {game.currentQuestion}/{game.totalQuestions}
                </span>
              </div>
            </div>
          )}

          {/* Host Controls */}
          {isHost && game.status === "waiting" && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary text-sm sm:text-base">
                Start Game
              </button>
              <button className="px-4 sm:px-6 py-3 sm:py-4 glass border border-muted/30 text-text rounded-xl font-semibold hover:bg-bg-1 transition-colors text-sm sm:text-base">
                Settings
              </button>
            </div>
          )}

          {/* Waiting Message */}
          {game.status === "waiting" && !isHost && (
            <div className="glass rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⏳</div>
              <p className="text-base sm:text-lg text-text font-semibold mb-2">
                Waiting for host to start...
              </p>
              <p className="text-sm sm:text-base text-muted">
                Share the game code with friends to join!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

