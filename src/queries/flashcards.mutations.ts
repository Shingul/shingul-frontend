import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFlashcardDeck } from "@/src/api/flashcards.api";
import { qk } from "./keys";
import { getApiErrorMessage } from "@/src/lib/apiError";
import type {
  CreateFlashcardDeckPayload,
  CreateFlashcardDeckResponse,
} from "@/src/types/api";
import { AxiosError } from "axios";

export function useCreateFlashcardDeck() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateFlashcardDeckResponse,
    AxiosError<{ message: string; errors?: { message: string }[] }>,
    CreateFlashcardDeckPayload
  >({
    mutationFn: createFlashcardDeck,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.studySets.detail(variables.studySetId),
      });
      toast.success("Flashcards generated successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
