/**
 * Games React Query mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createGame, joinRoom, startGame, submitAnswer, kickoutPlayer } from "@/src/api/games.api";
import { qk } from "./keys";
import { getApiErrorMessage } from "@/src/lib/apiError";
import type {
  CreateGamePayload,
  CreateGameResponse,
  JoinRoomPayload,
  JoinRoomResponse,
  StartGameResponse,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
  KickoutPlayerPayload,
  KickoutPlayerResponse,
} from "@/src/types/api";
import { AxiosError } from "axios";

/**
 * Create a new game
 * Invalidates study set detail cache on success
 */
export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation<CreateGameResponse, AxiosError<{ message: string; errors?: { message: string }[] }>, CreateGamePayload>({
    mutationFn: createGame,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.studySets.detail(variables.studySetId),
      });
      toast.success("Game created successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useJoinRoom() {
  const queryClient = useQueryClient();

  return useMutation<JoinRoomResponse, AxiosError<{ message: string; errors?: { message: string }[] }>, JoinRoomPayload>({
    mutationFn: joinRoom,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: qk.studySets.detail(data.studySetId),
      });
      toast.success("Joined game successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useStartGame() {
  const queryClient = useQueryClient();
  return useMutation<StartGameResponse, AxiosError<{ message: string; errors?: { message: string }[] }>, string>({
    mutationFn: startGame,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: qk.games.detail(data.game.id),
      });

    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSubmitAnswer() {
  return useMutation<SubmitAnswerResponse, AxiosError<{ message: string; errors?: { message: string }[] }>, SubmitAnswerPayload>({
    mutationFn: submitAnswer,
    onSuccess: () => {
      toast.success("Answer submitted successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useKickoutPlayer() {
  const queryClient = useQueryClient();

  return useMutation<KickoutPlayerResponse, AxiosError<{ message: string; errors?: { message: string }[] }>, KickoutPlayerPayload>({
    mutationFn: kickoutPlayer,
    onSuccess: (data, variables) => {
      console.log("data", data);
      console.log("variables", variables);  
      // Invalidate game queries to refresh player list
      queryClient.invalidateQueries({
        queryKey: qk.games.detail(variables.gameSessionId),
      });
      queryClient.invalidateQueries({
        queryKey: qk.games.participants(variables.gameSessionId),
      });
      toast.success(data.message || "Player removed successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}