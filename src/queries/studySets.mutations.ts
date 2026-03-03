/**
 * Study Sets React Query mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createStudySet } from "@/src/api/studySets.api";
import { qk } from "./keys";
import { getApiErrorMessage } from "@/src/lib/apiError";
import type {
  CreateStudySetPayload,
  CreateStudySetResponse,
} from "@/src/types/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

/**
 * Create a new study set
 * Invalidates study sets list cache on success
 */
export function useCreateStudySet() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<CreateStudySetResponse, AxiosError<{ message: string; errors?: { message: string }[] }>, CreateStudySetPayload>({
    mutationFn: createStudySet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: qk.studySets.lists() });
      queryClient.invalidateQueries({ queryKey: qk.studySets.detail(data.id) });
      toast.success("Study set created successfully!");

      router.push(`/study-sets/${data.id}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
