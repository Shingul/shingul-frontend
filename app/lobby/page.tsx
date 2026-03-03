"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useParticipants } from "@/src/queries/games.queries";
import { PageContainer, Section, Card } from "@/components/ui";
import type { Player } from "@/src/types/api";
import { HiOutlineUserGroup, HiOutlineClock } from "react-icons/hi";
import { Suspense, use, useEffect } from "react";
import { useGameService } from "@/src/hooks/use-game-service";

export default function ParticipantLobbyPage({
  params,
}: {
  params: Promise<{ id: string; gameId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen">
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
  // const studySetId = searchParams.get("studySetId");
  // console.log("gameId", gameId);
  // console.log("studySetId", studySetId);

  const { data: game, isLoading: isLoadingParticipants } = useParticipants(
    gameId || "",
  );

  const participants = game?.players || [];
  const router = useRouter();
  useGameService.participantJoined(gameId || "", "participant");
  useGameService.gameSessionTransmit(gameId || ""); 

  useEffect(() => {
    if (!gameId) return;
    if (game?.status === "live") {
      router.replace(`/study-sets/${studySetId}/games/play/public?gameId=${gameId}`);
    }
  }, [gameId, studySetId, router, game?.status]);

  return (
    <div className="flex min-h-screen bg-bg-0">
      <Sidebar />
      <main className="flex-1 lg:ml-0 flex flex-col">
        <PageContainer className="flex flex-col h-full gap-3 sm:gap-4 pb-4">
          {/* Header */}
          <header className="shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text">
                Game Lobby
              </h1>
              {game && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted">
                  <span className="font-mono bg-bg-1 px-2 py-1 rounded-md border border-muted/30">
                    Code: <span className="font-semibold text-text">{game.code}</span>
                  </span>
                  <span className="px-2 py-1 rounded-md bg-primary/5 text-primary text-[11px] sm:text-xs font-semibold border border-primary/20 capitalize">
                    {game.status || "lobby"}
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-text-muted">
              Wait here until the host starts the game.
            </p>
          </header>

          {/* Participants */}
          <div className="flex-1 flex flex-col min-h-0">
            <Section className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <h2 className="text-sm sm:text-base font-semibold text-text">
                  Participants ({participants.length})
                </h2>
              </div>

              {participants.length === 0 ? (
                <Card className="text-center px-4 py-6 sm:px-6 sm:py-8 shrink-0">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 flex justify-center">
                    <HiOutlineUserGroup className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                  </div>
                  <p className="text-sm sm:text-base text-text mb-1 font-semibold">
                    No participants yet
                  </p>
                  <p className="text-xs sm:text-sm text-text-muted">
                    Share the game code so others can join from their devices.
                  </p>
                </Card>
              ) : (
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5 auto-rows-max">
                  {participants.map((player: Player) => (
                    <Card
                      key={player.id}
                      className="p-2.5 sm:p-3 hover:border-primary/30 transition-all"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-linear-to-r from-primary to-primary2 flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl mb-2 shadow-md">
                          {player.nickname[0].toUpperCase()}
                        </div>
                        <div className="w-full">
                          <div className="flex items-center justify-center gap-1.5 mb-1 flex-wrap">
                            <span className="font-semibold text-text text-[11px] sm:text-xs md:text-sm truncate max-w-full">
                              {player.nickname}
                            </span>
                            {player.isHost && (
                              <span className="px-1.5 py-0.5 bg-primary/15 text-primary rounded text-[9px] sm:text-[10px] font-semibold shrink-0 border border-primary/20">
                                Host
                              </span>
                            )}
                          </div>
                          {game?.status !== "lobby" && (
                            <p className="text-[11px] sm:text-xs text-text-muted">
                              Score:{" "}
                              <span className="font-semibold text-text">
                                {player.score}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Section>

            {/* Footer */}
            {game?.status === "lobby" && (
              <Card className="text-center px-4 py-3 sm:px-5 sm:py-4 bg-primary/5 border-primary/20 shrink-0 mt-3">
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2 flex justify-center">
                  <HiOutlineClock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-text mb-1 font-semibold">
                  Waiting for host to start
                </p>
                <p className="text-[11px] sm:text-xs text-text-muted">
                  You’ll automatically move to the game when it begins.
                </p>
              </Card>
            )}
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
