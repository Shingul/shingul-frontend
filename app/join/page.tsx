"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import JoinGameForm from "@/components/JoinGameForm";
import { resumeRoom } from "@/src/api/games.api";
import { useJoinRoom } from "@/src/queries/games.mutations";
import { getApiErrorMessage } from "@/src/lib/apiError";

const PARTICIPANT_TOKEN_KEY = (code: string) => `game:${code}:participantToken`;
const PARTICIPANT_ID_KEY = (code: string) => `game:${code}:participantId`;

export default function JoinGamePage({
  params,
}: {
  params: Promise<{ id: string; code: string }>;
}) {
  const { code } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex justify-center items-center py-20 flex-1">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      }
    >
      <JoinGameContent code={code} />
    </Suspense>
  );
}

function JoinGameContent({ code }: { code: string }) {
  const router = useRouter();
  const {
    mutateAsync: joinRoom,
    isPending: isJoining,
    error: joinRoomError,
  } = useJoinRoom();
  const searchParams = useSearchParams();
  const codeFromQuery = searchParams.get("code") || code;

  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem(PARTICIPANT_TOKEN_KEY(codeFromQuery));

      if (!token) {
        setIsCheckingToken(false);
        return;
      }

      try {
        const response = await resumeRoom(codeFromQuery, token);

        // Token is valid, route to appropriate page
        if (response.status === "active") {
          router.push(
            `/study-sets/${response.studySetId}/games/${response.gameId}/play`
          );
        } else {
          router.push(
            `/study-sets/${response.studySetId}/games/${response.gameId}/lobby`
          );
        }
      } catch {
        // Token is invalid, clear it and show form
        localStorage.removeItem(PARTICIPANT_TOKEN_KEY(codeFromQuery));
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, [codeFromQuery, router]);

  const handleJoin = async (gameCode: string, nickname: string) => {
    const response = await joinRoom({ code: gameCode, nickname: nickname });
    localStorage.setItem(
      PARTICIPANT_TOKEN_KEY(gameCode),
      response.participantToken
    );
    localStorage.setItem(
      PARTICIPANT_ID_KEY(gameCode),
      response.participantId
    );

    if(response.redirect){
      router.push(response.redirectUrl || "");
    } else{
      router.push(`/lobby?gameId=${response.gameId}&studySetId=${response.studySetId}`);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex justify-center items-center py-20 flex-1">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-0">
        <div className="max-w-md mx-auto flex flex-col justify-center min-h-full">
          <div className="glass rounded-2xl p-6 sm:p-8 glow-primary">
            <div className="text-center mb-6">
              {/* <div className="relative w-full aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4">
                <Image
                  src="/banner.png"
                  alt="Shingul mascot"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div> */}
              <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
                Join Game
              </h1>
            </div>

            <JoinGameForm
              code={codeFromQuery}
              onSubmit={handleJoin}
              isLoading={isJoining}
              error={joinRoomError ? getApiErrorMessage(joinRoomError) : undefined}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
