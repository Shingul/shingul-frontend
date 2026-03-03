/**
 * Documents React Query mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadDocuments } from "@/src/api/documents.api";
import { qk } from "./keys";
import { getApiErrorMessage } from "@/src/lib/apiError";
import type { Document } from "@/src/types/api";
import { AxiosError } from "axios";

/**
 * Upload documents to a study set
 * Invalidates study set detail cache on success
 */
export function useUploadDocuments() {
  const queryClient = useQueryClient();

  return useMutation<Document[], AxiosError<{ message: string; errors?: { message: string }[] }>, { studySetId: string; files: File[] }>({
    mutationFn: ({ studySetId, files }) => uploadDocuments(studySetId, files),
    onSuccess: (data, variables) => {
      // Invalidate study set detail to refresh documents list
      queryClient.invalidateQueries({
        queryKey: qk.studySets.detail(variables.studySetId),
      });
      toast.success(
        `${data.length} document${data.length === 1 ? "" : "s"} uploaded successfully!`
      );
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

// TODO: Implement retryDocument mutation when endpoint is available
// export function useRetryDocument() {
//   const queryClient = useQueryClient();
//
//   return useMutation<Document, Error, string>({
//     mutationFn: retryDocument,
//     onSuccess: (data) => {
//       // Invalidate document cache
//       queryClient.invalidateQueries({ queryKey: qk.documents.detail(data.id) });
//       toast.success("Document processing restarted");
//     },
//     onError: (error) => {
//       toast.error(getApiErrorMessage(error));
//     },
//   });
// }
