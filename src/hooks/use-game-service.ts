import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Game,
  GameAndQuestionsResponse,
  JoinedMessage,
  Player,
} from "../types/api";
import { qk } from "../queries/keys";
import toast from "react-hot-toast";
import { useTransmit } from "./use-transmit";

type GameSessionBroadcast = {
  id: string;
  code: string;
  currentQuestionIndex: number | null;
  status: "lobby" | "live" | "ended" | "cancelled";
  players: Player[];
  timePerQuestionSeconds: number;
  pointsPerQuestion: number;
  questionStartedAt?: string | null;
};
function useGameSessionTransmit(gameId: string) {
  const queryClient = useQueryClient();

  const onMessage = useCallback(
    (msg: GameSessionBroadcast) => {
      console.log("msg host", msg);
      queryClient.setQueryData<Game>(qk.games.detail(gameId), (old) => {
        if (!old) return old;
        console.log("msg host", msg);

        return {
          ...old,
          code: msg.code ?? old.code,
          status: msg.status ?? old.status,
          currentQuestionIndex:
            msg.currentQuestionIndex ?? old.currentQuestionIndex,
          questionStartedAt: msg.questionStartedAt ?? old.questionStartedAt,
          secondsPerQuestion:
            msg.timePerQuestionSeconds ?? old.secondsPerQuestion,
          players: msg.players ?? old.players,
          playersCount: msg.players?.length ?? old.playersCount,
        };
      });

      queryClient.setQueryData<Game>(qk.games.participants(gameId), (old) => {
        if (!old) return old;
        return {
          ...old,
          status: msg.status ?? old.status,
          currentQuestionIndex:
            msg.currentQuestionIndex ?? old.currentQuestionIndex,
          questionStartedAt: msg.questionStartedAt ?? old.questionStartedAt,
          secondsPerQuestion:
            msg.timePerQuestionSeconds ?? old.secondsPerQuestion,
          players: msg.players ?? old.players,
          playersCount: msg.players?.length ?? old.playersCount,
        };
      });

      if (msg.status === "ended") {
        toast.success("Game ended!");
      }
    },
    [gameId, queryClient],
  );

  useTransmit<GameSessionBroadcast>({
    channel: `game_session:${gameId}`,
    onMessage,
  });
}

function useServerTimer(
  questionStartedAt?: string,
  secondsPerQuestion?: number,
) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!questionStartedAt || !secondsPerQuestion) {
      //   setTimeRemaining(null);
      return;
    }

    const startMs = new Date(questionStartedAt).getTime();

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startMs) / 1000);
      setTimeRemaining(Math.max(0, secondsPerQuestion - elapsed));
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [questionStartedAt, secondsPerQuestion]);

  return timeRemaining;
}

function useParticipantJoined(gameId: string, page: "participant" | "host") {
  const queryClient = useQueryClient();
  const onMessage = useCallback(
    (message: JoinedMessage) => {
      console.log("message participant joined", message);
      if (message.status === "left" || message.status === "kicked") {
        queryClient.invalidateQueries({
          queryKey: qk.games.participants(gameId),
        });
        queryClient.invalidateQueries({
          queryKey: qk.games.detail(gameId),
        });
        if (page === "participant")
          toast.success(`${message.nickname} left the game!`);
      } else {
        if (page === "host") {
          queryClient.setQueryData<Game>(qk.games.detail(gameId), (old) => {
            if (!old) return old;
            return {
              ...old,
              players: [
                ...old.players,
                {
                  id: message.id,
                  nickname: message.nickname,
                  score: message.score ?? 0,
                  isHost: message.isHost ?? false,
                  status: message.status ?? "active",
                },
              ],
            };
          });
        } else {
          queryClient.setQueryData<Game>(
            qk.games.participants(gameId),
            (old) => {
              if (!old) return old;
              const players = old.players ?? [];
              if (players.some((p) => p.id === message.id)) return old;
              const newPlayer: Player = {
                id: message.id,
                nickname: message.nickname,
                score: message.score ?? 0,
                isHost: message.isHost ?? false,
                status: message.status ?? "active",
              };
              return { ...old, players: [...players, newPlayer] };
            },
          );
        }
      }
    },
    [gameId, queryClient, page],
  );
  useTransmit<JoinedMessage>({
    channel: `game_participant:${gameId}:joined`,
    onMessage,
  });
}

function usePublicGameSession(gameId: string) {
  const queryClient = useQueryClient();
  const onMessage = useCallback(
    (message: GameSessionBroadcast) => {
      console.log("message public game session", message);

      queryClient.setQueryData<GameAndQuestionsResponse>(
        qk.games.gameAndQuestions(gameId),
        (old: GameAndQuestionsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            game: {
              ...old?.game,
              status: message.status ?? old?.game?.status,
              currentQuestionIndex:
                message.currentQuestionIndex ?? old?.game?.currentQuestionIndex,
              questionStartedAt:
                message.questionStartedAt ?? old?.game?.questionStartedAt,
              secondsPerQuestion:
                message.timePerQuestionSeconds ?? old?.game?.secondsPerQuestion,
              players: message.players ?? old?.game?.players,
              playersCount: message.players?.length ?? old?.game?.playersCount,
            },
          } as GameAndQuestionsResponse;
        },
      );
    },
    [gameId, queryClient],
  );

  useTransmit<GameSessionBroadcast>({
    channel: `game_session:${gameId}`,
    onMessage,
    autoCleanup: false,
  });
}
export const useGameService = {
  gameSessionTransmit: useGameSessionTransmit,
  serverTimer: useServerTimer,
  participantJoined: useParticipantJoined,
  publicGameSession: usePublicGameSession,
};
