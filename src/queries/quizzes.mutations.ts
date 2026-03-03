import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createQuiz } from "@/src/api/quizzes.api";
import { qk } from "./keys";
import { getApiErrorMessage } from "@/src/lib/apiError";
import type { CreateQuizPayload, CreateQuizResponse } from "@/src/types/api";
import { AxiosError } from "axios";

export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation<CreateQuizResponse, AxiosError<{ message: string; errors?: { message: string }[] }>, CreateQuizPayload>({
    mutationFn: createQuiz,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.studySets.detail(variables.studySetId),
      });
      toast.success("Quiz generated successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
