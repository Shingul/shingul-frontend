"use client";

import { use } from "react";
import { QRCodeSVG } from "qrcode.react";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGame } from "@/src/queries/games.queries";
// import StartGameModal from "@/components/modals/StartGameModal";
import Link from "next/link";
import toast from "react-hot-toast";
import { useStartGame, useEndGame, useKickoutPlayer } from "@/src/queries/games.mutations";
import { getApiErrorMessage } from "@/src/lib/apiError";
import { useJoinCode } from "@/src/hooks/join-code";
import { useGameService } from "@/src/hooks/use-game-service";
import { useState } from "react";
import GamePreparationModal from "@/components/modals/GamePreparationModal";
import { HiOutlineClock } from "react-icons/hi";
import { useRouter } from "next/navigation";


export default function GameLobbyPage({
  params,
}: {
  params: Promise<{ id: string; gameId: string }>;
}) {
  const { id, gameId } = use(params);
  const { data: game, isLoading } = useGame(gameId);
  const { mutate: startGame, isPending: isStarting } = useStartGame();
  const { mutate: endGame, isPending: isEnding } = useEndGame();
  const { mutate: kickoutPlayer, isPending: isKickingPlayer } = useKickoutPlayer();
  const [showPreparationModal, setShowPreparationModal] = useState(false);
  const router = useRouter();
  useGameService.participantJoined(gameId, "host");
  const { joinUrl, handleCopyCode, handleCopyUrl } = useJoinCode(game?.code || ""); 
  console.log("players", game?.players);
  

  const handleStartGame = () => {
    setShowPreparationModal(true);
  };

  const handleContinueToGame = () => {
    startGame(gameId, {
      onSuccess: () => {
        setShowPreparationModal(false);
        router.push(`/study-sets/${id}/games/play/host?gameId=${gameId}`);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      },
    });
  };

  const handleKickPlayer = (playerId: string, playerNickname: string) => {
    if (!game || !isHost) return;
    
    if (window.confirm(`Are you sure you want to remove ${playerNickname} from the game?`)) {
      kickoutPlayer(
        {
          gameSessionId: game.id,
          participantId: playerId,
        },
      );
    }
  };

  const handleEndGame = () => {
    if (!game || !isHost) return;
    const confirmed = window.confirm(
      "Ending the game will stop it for all participants and show final results. Are you sure you want to end the game?"
    );
    if (!confirmed) return;

    endGame(gameId, {
      onSuccess: () => {
        toast.success("Game ended.");
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      },
    });
  };
// TYRAN Purple colors
  // const TYRAN_PURPLE = "#7c6fff";
  // const TYRAN_PURPLE_DARK = "#6b5ce6";
  // const TYRAN_PURPLE_LIGHT = "#9a8fff";
  // const TYRAN_PURPLE_LIGHTER = "#8a7fff";
  // const TYRAN_PURPLE_LIGHTEST = "#6dd9e8";
  // const TYRAN_PURPLE_LIGHTEST_DARK = "#5dc9d8";
  // const TYRAN_PURPLE_LIGHTEST_LIGHTER = "#4dd0e1";
  if (isLoading || isStarting || isEnding) {
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
            className="px-6 py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary"
          >
            Back to Study Set
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    lobby: "bg-primary2/20 text-primary2",
    live: "bg-green-500/20 text-green-400",
    ended: "bg-gray-500/20 text-gray-300",
    cancelled: "bg-gray-500/20 text-gray-300",
  };

  const statusLabels = {
    lobby: "Waiting",
    live: "Active",
    ended: "Ended",
    cancelled: "Cancelled",
    completed: "Completed",
  };

  // const isHost = game.players.some((p) => p.isHost);
  const isHost = game.isHost;
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-0 flex flex-col overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col h-full overflow-hidden w-full">
          {/* Fixed Header Section */}
          <div className="shrink-0">
            <div className="mb-2 sm:mb-3">
              <Link
                href={`/study-sets/${id}`}
                className="text-muted hover:text-text transition-colors text-xs sm:text-sm"
              >
                ← Back to Study Set
              </Link>
            </div>

            {/* Host Controls */}
            {isHost && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                {game.status === "lobby" && (
                  <button
                    onClick={handleStartGame}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary text-xs sm:text-sm"
                  >
                    Start Game
                  </button>
                )}
                {game.status === "live" && (
                  <button
                    onClick={handleEndGame}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-error/90 text-white rounded-lg font-semibold hover:bg-error transition-colors text-xs sm:text-sm"
                  >
                    End Game
                  </button>
                )}
                <button className="px-3 sm:px-4 py-2 sm:py-2.5 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors text-xs sm:text-sm">
                  Settings
                </button>
              </div>
            )}

            {/* Game Code and QR Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {/* Game Code */}
              <div className="glass rounded-xl p-4 sm:p-5 text-center glow-primary">
                <p className="text-xs text-muted mb-1.5">Game Code</p>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary2 mb-2 sm:mb-3">
                  {game.code}
                </div>
                <span
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold mb-3 inline-block ${statusColors[game.status]}`}
                >
                  {statusLabels[game.status]}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="w-full mt-2 px-3 py-1.5 glass border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </button>
              </div>

              {/* QR Code */}
              <div className="glass rounded-xl p-4 sm:p-5 text-center glow-primary">
                <p className="text-xs text-muted mb-2 sm:mb-3">Scan to Join</p>
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="bg-white p-2 sm:p-3 rounded-xl">
                    <QRCodeSVG value={joinUrl} size={120} />
                  </div>
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="w-full px-3 py-1.5 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy URL
                </button>
                <p className="text-[10px] sm:text-xs text-muted mt-2 break-all line-clamp-2">{joinUrl}</p>
              </div>
            </div>

            {/* Game Info - Fixed */}
            {game.status === "live" && (
              <div className="glass rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
               <div className="flex items-center justify-between">
               <h3 className="text-sm sm:text-base font-bold text-text mb-2 sm:mb-3">
                  Game Progress
                </h3>
                <Link
                    href={`/study-sets/${id}/games/play/host?gameId=${gameId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    prefetch
                    className="text-xs text-muted hover:text-text transition-colors inline-flex items-center gap-2 text-primary"
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
                    Host View
                  </Link>
               </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-bg-1 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-linear-to-r from-primary to-primary2 h-1.5 sm:h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            game.currentQuestionNumber && game.totalQuestions
                              ? (game.currentQuestionNumber / game.totalQuestions) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted shrink-0">
                    {game.currentQuestionNumber}/{game.totalQuestions}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Players List Section - Optimized to show 10-20 players without scrolling */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="glass rounded-2xl p-3 sm:p-4 flex-1 flex flex-col min-h-0">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3 shrink-0">
                Players ({game?.players.length})
              </h2>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 auto-rows-max">
                {game.players.map((player) => (
                  <div
                    key={player.id}
                    className="glass rounded-xl p-2.5 sm:p-3 flex flex-col items-center text-center relative group"
                  >
                    {/* Kick button - only visible to host and not for host themselves */}
                    {isHost && !player.isHost && game.status === "lobby" && (
                      <button
                        onClick={() => handleKickPlayer(player.id, player.nickname)}
                        disabled={isKickingPlayer}
                        className="absolute top-1 right-1 p-1 rounded-full hover:bg-error/20 text-error hover:text-error/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title={`Remove ${player.nickname}`}
                      >
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-r from-primary to-primary2 flex items-center justify-center text-white font-bold text-base sm:text-lg mb-2 shadow-md shrink-0">
                      {player.nickname[0].toUpperCase()}
                    </div>
                    <div className="w-full min-w-0">
                      <div className="flex items-center justify-center gap-1.5 mb-1 flex-wrap">
                        <span className="font-semibold text-text text-xs sm:text-sm truncate max-w-full">
                          {player.nickname}
                        </span>
                        {player.isHost && (
                          <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-[10px] font-semibold shrink-0">
                            Host
                          </span>
                        )}
                      </div>
                      {game.status !== "lobby" && (
                        <p className="text-xs text-muted">
                          Score: {player.score}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Footer Section */}
            {game.status === "lobby" && !isHost && (
              <div className="glass rounded-2xl p-4 sm:p-6 text-center shrink-0 mt-3">
                <div className="text-2xl sm:text-3xl mb-2 flex justify-center"><HiOutlineClock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" /></div>
                <p className="text-sm sm:text-base text-text font-semibold mb-1">
                  Waiting for host to start...
                </p>
                <p className="text-xs sm:text-sm text-muted">
                  Share the game code with friends to join!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <GamePreparationModal
        isOpen={showPreparationModal}
        onContinue={handleContinueToGame}
      />
    </div>
  );
}
