import { useQuery } from "@tanstack/react-query";
import { getGame, getGameAndQuestions, getParticipants } from "@/src/api/games.api";
import { qk } from "./keys";
import type { Game, GameAndQuestionsResponse } from "@/src/types/api";

export function useGame(id: string, options?: { enabled?: boolean, staleTime?: number, refetchOnMount?: boolean, refetchOnWindowFocus?: boolean, refetchInterval?: number, refetchIntervalInBackground?: boolean }) {
  return useQuery<Game>({
    queryKey: qk.games.detail(id),
    queryFn: () => getGame(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: options?.staleTime ?? 60 * 1000, // 1 minute
    refetchOnMount: options?.refetchOnMount ?? false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchInterval: options?.refetchInterval ?? false, // 30 seconds
    refetchIntervalInBackground: options?.refetchIntervalInBackground ?? false,
  });
}

export function useParticipants(gameId: string) {
  return useQuery<Game>({
    queryKey: qk.games.participants(gameId),
    queryFn: () => getParticipants(gameId),
    enabled: !!gameId,
  });
}

export function useGameAndQuestions(gameId: string) {
  return useQuery<GameAndQuestionsResponse>({
    queryKey: qk.games.gameAndQuestions(gameId),
    queryFn: () => getGameAndQuestions(gameId),
    enabled: !!gameId,
  });
}