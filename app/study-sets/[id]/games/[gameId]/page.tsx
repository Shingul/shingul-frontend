"use client";

import { use } from "react";
import { QRCodeSVG } from "qrcode.react";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
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
  const { joinUrl, handleCopyUrl } = useJoinCode(game?.code || ""); 
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
        <Sidebar activeTab="Study Sets" />
        <div className="flex justify-center items-center py-20 flex-1">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex min-h-screen">
        <Sidebar activeTab="Study Sets" />
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

  // const isHost = game.players.some((p) => p.isHost);
  const isHost = game.isHost;

  const questionCount = game.totalQuestions ?? 0;
  const timeLimit = game.secondsPerQuestion ?? 0;

  return (
    <div className="flex min-h-screen bg-[#F9F2E9]">
      <Sidebar activeTab="Study Sets" />
      <main className="flex-1 lg:ml-0 flex flex-col px-4 sm:px-6 md:px-10 py-6">
        <div className="max-w-5xl w-full mx-auto flex flex-col flex-1">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Study Set", href: `/study-sets/${id}` },
                { label: game.title || "Game Lobby" },
              ]}
            />
          </div>

          {/* Hero: Code + QR + Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: Lobby title, code, URL, QR */}
            <div className="flex flex-col items-center md:items-start space-y-8">
              <div className="space-y-3 text-center md:text-left">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#66023C]/60">
                  Game Lobby
                </span>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-[#1E1E1E] leading-none">
                  {game.code}
                </h1>
                <p className="text-sm sm:text-base text-[#1E1E1E]/60 font-medium">
                  Join at{" "}
                  <span className="text-[#66023C] font-semibold underline">
                    shingul.app
                  </span>
                </p>
              </div>

              <div className="group relative p-6 bg-white rounded-[1.75rem] shadow-xl shadow-[#66023C]/5 border border-[#66023C]/5">
                <div className="w-44 h-44 sm:w-48 sm:h-48 bg-white flex items-center justify-center overflow-hidden rounded-xl">
                  <QRCodeSVG value={joinUrl} size={180} />
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#1E1E1E]/40">
                    Scan to Join
                  </span>
                  <button
                    onClick={handleCopyUrl}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#66023C]/5 text-[11px] font-semibold text-[#66023C] hover:bg-[#66023C]/10 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy join link
                  </button>
                  <p className="mt-2 text-[10px] sm:text-xs text-[#1E1E1E]/35 break-all line-clamp-2">
                    {joinUrl}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Game info + primary action */}
            <div className="bg-white/60 backdrop-blur-sm rounded-[2.25rem] p-8 sm:p-10 border border-white flex flex-col justify-between min-h-[260px]">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#1E1E1E]">
                      {game.status === "live"
                        ? "Game in progress"
                        : "Waiting for players"}
                    </h3>
                    <p className="mt-1 text-sm text-[#1E1E1E]/60">
                      {game.status === "live"
                        ? "Players are answering questions in real time."
                        : "Share the code so everyone can join before you begin."}
                    </p>
                  </div>
                  <div className="relative h-3 w-3">
                    <span className="absolute inline-flex h-3 w-3 rounded-full bg-[#66023C] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#66023C]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-2xl border border-[#66023C]/5">
                    <span className="block text-2xl sm:text-3xl font-bold text-[#66023C]">
                      {questionCount}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E1E1E]/40">
                      Questions
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#66023C]/5">
                    <span className="block text-2xl sm:text-3xl font-bold text-[#66023C]">
                      {timeLimit || "—"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E1E1E]/40">
                      Seconds / Question
                    </span>
                  </div>
                </div>
              </div>
              {/* Live Game Link */}
            {game.status === "live" && (
                <Link href={`/study-sets/${id}/games/play/host?gameId=${gameId}`} className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-[#66023C] text-[#F9F2E9] px-4 py-3 rounded-2xl text-sm sm:text-base font-bold tracking-[0.18em] uppercase hover:opacity-95 transition-all shadow-lg shadow-[#66023C]/25">
                <span className="material-symbols-outlined text-base mr-2">
                  play_arrow
                </span>
                Live Game
                </Link>
            )}

              <div className="mt-8">
                {isHost ? (
                  <>
                    {game.status === "lobby" && (
                      <button
                        onClick={handleStartGame}
                        className="w-full bg-[#66023C] text-[#F9F2E9] py-4 rounded-2xl text-sm sm:text-base font-bold tracking-[0.18em] uppercase hover:opacity-95 transition-all shadow-lg shadow-[#66023C]/25"
                      >
                        Start Game Now
                      </button>
                    )}
                    {game.status === "live" && (
                      <button
                        onClick={handleEndGame}
                        className="w-full bg-red-600/90 text-white py-4 rounded-2xl text-sm sm:text-base font-bold tracking-[0.18em] uppercase hover:bg-red-600 transition-all shadow-lg shadow-red-500/25"
                      >
                        End Game
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-[#1E1E1E]/60">
                    <span>Waiting for host to start the game.</span>
                    <HiOutlineClock className="w-5 h-5 text-[#66023C]" />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Game Leaderboard */}
          {game.status == "ended" && (
              <section className="mt-8 backdrop-blur-sm bg-white/60 rounded-2xl p-6 border border-[#66023C]/5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#1E1E1E]">
                    Game Leaderboard
                  </h2>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#66023C]/60">
                    {game.endedAt ? new Date(game.endedAt).toLocaleString() : "N/A"}
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {game.players.sort((a, b) => b.score - a.score).map((player) => (
                    <div key={player.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#66023C]/8 flex items-center justify-center text-[#66023C] font-bold text-sm sm:text-base">
                        {player.nickname[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-sm sm:text-base text-[#1E1E1E]">
                        {player.nickname}
                      </span>
                      <span className="text-xs font-bold text-[#1E1E1E] shrink-0 ml-2">
                        {player.score.toLocaleString()} pt
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Players list */}
          <section className="mt-14 sm:mt-16 flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-6 px-1">
              <h2 className="text-sm sm:text-base font-semibold text-[#1E1E1E] flex items-center gap-2">
                <span className="material-symbols-outlined text-base sm:text-lg text-[#66023C]">
                  group
                </span>
                Players Joined ({game.players.length})
              </h2>
              <div className="hidden sm:block flex-1 h-px bg-[#66023C]/10" />
            </div>

            {game.players.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-sm font-semibold text-[#1E1E1E]/40 mb-2">
                  No one has joined yet.
                </p>
                <p className="text-xs text-[#1E1E1E]/50">
                  Share the game code{" "}
                  <span className="font-semibold text-[#66023C]">
                    {game.code}
                  </span>{" "}
                  or the join link above.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                {game.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-[#66023C]/8 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    {isHost && !player.isHost && game.status === "lobby" && (
                      <button
                        onClick={() => handleKickPlayer(player.id, player.nickname)}
                        disabled={isKickingPlayer}
                        className="absolute -top-1 -right-1 p-1 rounded-full bg-white/80 hover:bg-red-50 text-red-500 hover:text-red-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title={`Remove ${player.nickname}`}
                      >
                        <svg
                          className="w-3 h-3"
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
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#66023C]/8 flex items-center justify-center text-[#66023C] font-bold text-sm sm:text-base">
                      {player.nickname[0].toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-[#1E1E1E]">
                      {player.nickname}
                    </span>
                    {player.isHost && (
                      <span className="px-2 py-0.5 rounded-full bg-[#66023C]/5 text-[#66023C] text-[10px] font-semibold uppercase tracking-[0.18em]">
                        Host
                      </span>
                    )}
                  </div>
                ))}

                {/* Placeholder pill */}
                <div className="flex items-center gap-3 bg-[#E5E1DA]/40 px-5 py-3 rounded-full border border-dashed border-[#1E1E1E]/20">
                  <div className="w-9 h-9 rounded-full border-2 border-dashed border-[#1E1E1E]/30 flex items-center justify-center text-[#1E1E1E]/40">
                    <span className="material-symbols-outlined text-xs">
                      hourglass_empty
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#1E1E1E]/40 italic">
                    Waiting for more players…
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>

        <GamePreparationModal
          isOpen={showPreparationModal}
          onContinue={handleContinueToGame}
          onClose={() => setShowPreparationModal(false)}
        />
      </main>
    </div>
  );
}
