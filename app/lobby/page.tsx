"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useParticipants } from "@/src/queries/games.queries";
import type { Player } from "@/src/types/api";
import { Suspense, use, useEffect, useState } from "react";
import Image from "next/image";
import { useGameService } from "@/src/hooks/use-game-service";

const AVATAR_IMAGES = [
  "https://api.dicebear.com/9.x/notionists/svg?seed=Amara",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Julian",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Elara",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Rowan",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Leila",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Devon",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Kira",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Nico",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Sage",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Mika",
];

function getAvatarForPlayer(nickname: string): string {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_IMAGES[Math.abs(hash) % AVATAR_IMAGES.length];
}

export default function ParticipantLobbyPage({
  params,
}: {
  params: Promise<{ id: string; gameId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen bg-[#F9F2E9]">
          <Sidebar />
          <main className="flex-1 lg:ml-0">
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          </main>
        </div>
      }
    >
      <ParticipantLobbyContent params={params} />
    </Suspense>
  );
}

function ParticipantLobbyContent({
  params,
}: {
  params: Promise<{ id: string; gameId: string }>;
}) {
  const { id: studySetId } = use(params);
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const [chatMessage, setChatMessage] = useState("");

  const { data: game, isLoading: isLoadingParticipants } = useParticipants(
    gameId || ""
  );

  const participants = game?.players || [];
  const router = useRouter();
  useGameService.participantJoined(gameId || "", "participant");
  useGameService.gameSessionTransmit(gameId || "");

  useEffect(() => {
    if (!gameId) return;
    if (game?.status === "live") {
      router.replace(
        `/study-sets/${studySetId}/games/play/public?gameId=${gameId}`
      );
    }
  }, [gameId, studySetId, router, game?.status]);

  const hostPlayer = participants.find((p: Player) => p.isHost);
  const questionCount = game?.totalQuestions ?? 0;
  const timePerQ = game?.secondsPerQuestion ?? 30;
  console.log("timePerQ", timePerQ);
  console.log("questionCount", questionCount);
  const estimatedMinutes = Math.ceil((questionCount * timePerQ) / 60);

  if (isLoadingParticipants) {
    return (
      <div className="flex min-h-screen bg-[#F9F2E9]">
        <Sidebar />
        <main className="flex-1 lg:ml-0">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
      <Sidebar />
      <main className="flex-1 lg:ml-0 flex flex-col">
        <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 lg:px-16 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#66023C]/5 blur-[120px] rounded-full -z-10" />

          <div className="w-full max-w-4xl space-y-10">
            {/* Breadcrumbs */}
            <Breadcrumbs
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Game Lobby" },
              ]}
            />

            {/* Hero */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#66023C]/10 text-[#66023C] text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#66023C] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#66023C]" />
                </span>
                Waiting for host
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-[#1E1E1E] tracking-tighter">
                Preparing the Stage
              </h1>
              <p className="text-[#1E1E1E]/60 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                The game will begin once the host starts the session. Take a
                moment to breathe and focus.
              </p>
              {game && (
                <div className="inline-flex items-center gap-3 mt-2">
                  <span className="font-mono bg-white px-3 py-1.5 rounded-lg border border-[#66023C]/10 text-sm text-[#1E1E1E] shadow-sm">
                    Code:{" "}
                    <span className="font-bold text-[#66023C]">
                      {game.code}
                    </span>
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#66023C]/5 text-[#66023C] text-xs font-bold border border-[#66023C]/20 capitalize">
                    {game.status || "lobby"}
                  </span>
                </div>
              )}
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {participants.map((player: Player, index: number) => {
                const isCurrentUser = index === 0;
                const avatarUrl = getAvatarForPlayer(player.nickname);
                return (
                  <div
                    key={player.id}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="relative">
                      <div
                        className={`size-20 sm:size-24 md:size-28 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform ${
                          isCurrentUser
                            ? "bg-[#66023C] border-4 border-white shadow-xl"
                            : "bg-white border border-[#66023C]/10"
                        }`}
                      >
                        <Image
                          src={avatarUrl}
                          alt={player.nickname}
                          width={112}
                          height={112}
                          className={`size-full object-cover ${
                            isCurrentUser ? "opacity-90" : ""
                          }`}
                          unoptimized
                        />
                        {isCurrentUser && (
                          <div className="absolute bottom-0 right-0 p-1.5 bg-green-500 rounded-tl-lg border-t border-l border-white/20">
                            <span className="material-symbols-outlined text-[10px] text-white font-bold">
                              check
                            </span>
                          </div>
                        )}
                      </div>
                      {isCurrentUser && (
                        <div className="absolute -top-2 -left-2 bg-[#66023C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
                          YOU
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-bold text-sm sm:text-base truncate max-w-[100px] ${
                          isCurrentUser
                            ? "text-[#1E1E1E]"
                            : "text-[#1E1E1E]/80"
                        }`}
                      >
                        {player.nickname}
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          isCurrentUser
                            ? "text-[#66023C]"
                            : "text-[#1E1E1E]/40 uppercase tracking-widest"
                        }`}
                      >
                        {isCurrentUser
                          ? "Ready"
                          : player.isHost
                            ? "Host"
                            : "Joined"}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Invite placeholder */}
              <div className="flex flex-col items-center gap-3">
                <div className="size-20 sm:size-24 md:size-28 rounded-2xl border-2 border-dashed border-[#66023C]/20 flex flex-col items-center justify-center bg-[#66023C]/5 hover:bg-[#66023C]/10 transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-[#66023C]/40 text-3xl mb-1 group-hover:scale-110 transition-transform">
                    person_add
                  </span>
                  <p className="text-[10px] text-[#66023C]/60 font-bold uppercase tracking-widest">
                    Invite
                  </p>
                </div>
                <div className="h-8" />
              </div>
            </div>

            {/* Bottom Panels: Chat + Session Info */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Lobby Chat */}
              <div className="flex-1 bg-white/50 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#66023C]/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#66023C] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      chat_bubble
                    </span>
                    Lobby Chat
                  </h3>
                  <span className="text-[10px] text-[#1E1E1E]/40 font-bold uppercase">
                    Coming Soon
                  </span>
                </div>
                <div className="space-y-4 h-32 overflow-y-auto pr-2">
                  <div className="flex gap-3">
                    <div className="size-6 rounded-full bg-[#66023C]/20 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#1E1E1E]">
                        System
                        <span className="text-[10px] font-normal text-[#1E1E1E]/40 ml-2">
                          Just now
                        </span>
                      </p>
                      <p className="text-xs text-[#1E1E1E]/70 mt-1">
                        Welcome to the lobby! Chat will be available soon.
                      </p>
                    </div>
                  </div>
                  {participants.length > 1 && (
                    <div className="flex gap-3">
                      <div className="size-6 rounded-full bg-[#66023C]/30 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#1E1E1E]">
                          {participants[1]?.nickname || "Player"}
                          <span className="text-[10px] font-normal text-[#1E1E1E]/40 ml-2">
                            Just now
                          </span>
                        </p>
                        <p className="text-xs text-[#1E1E1E]/70 mt-1">
                          Ready for this round! Good luck everyone.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 bg-white border border-[#66023C]/10 rounded-lg px-4 py-2 text-xs focus:ring-1 focus:ring-[#66023C] focus:border-[#66023C] outline-none transition-all placeholder:text-[#1E1E1E]/30"
                    placeholder="Type a message..."
                    disabled
                  />
                  <button
                    type="button"
                    className="bg-[#66023C] text-white p-2 rounded-lg hover:bg-[#66023C]/90 transition-colors disabled:opacity-40"
                    disabled
                  >
                    <span className="material-symbols-outlined text-sm">
                      send
                    </span>
                  </button>
                </div>
              </div>

              {/* Session Info */}
              <div className="w-full md:w-80 bg-white/50 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#66023C]/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#66023C] flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-sm">
                      info
                    </span>
                    Session Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-[#1E1E1E]/60">
                        Game Mode
                      </span>
                      <span className="text-xs font-bold">Quiz Game</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-[#1E1E1E]/60">
                        Estimated Time
                      </span>
                      <span className="text-xs font-bold">
                        ~{estimatedMinutes} Min
                        {estimatedMinutes !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-[#1E1E1E]/60">
                        Questions
                      </span>
                      <span className="text-xs font-bold">
                        {questionCount > 0 ? questionCount : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-[#1E1E1E]/60">
                        Players
                      </span>
                      <span className="text-xs font-bold">
                        {participants.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-[#1E1E1E]/60">
                        Room Privacy
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">
                          lock
                        </span>
                        Private
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#66023C]/5">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[#1E1E1E]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">
                        person
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#66023C]">
                        Host
                      </p>
                      <p className="text-xs font-bold">
                        {hostPlayer?.nickname || "Waiting..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-6 border-t border-[#66023C]/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/30 shrink-0">
          <div className="flex items-center gap-6">
            <p className="text-xs text-[#1E1E1E]/40 font-medium">
              © Shingul Study Games
            </p>
            <div className="flex gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E1E1E]/40">
                Privacy
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E1E1E]/40">
                Terms
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((p: Player) => (
                <div
                  key={p.id}
                  className="size-6 rounded-full border-2 border-[#F9F2E9] bg-[#66023C]/20 flex items-center justify-center text-[8px] font-bold text-[#66023C]"
                >
                  {p.nickname[0].toUpperCase()}
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-[#66023C]">
              {participants.length} Player
              {participants.length !== 1 ? "s" : ""} in Lobby
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
