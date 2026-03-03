/**
 * Documents React Query hooks
 */

import { useQuery } from "@tanstack/react-query";
import { getDocument, getDocumentsByStudySetId } from "@/src/api/documents.api";
import { qk } from "./keys";
import type { Document } from "@/src/types/api";

/**
 * Get a single document by ID
 * Implements polling for processing status
 */
export function useDocument(id: string) {
  return useQuery<Document>({
    queryKey: qk.documents.detail(id),
    queryFn: () => getDocument(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;

      // Poll every 2 seconds while processing
      if (data.status === "queued" || data.status === "extracting") {
        return 2000;
      }

      // Stop polling when extracted or failed
      return false;
    },
  });
}

/**
 * Get all documents for a study set
 */
export function useDocumentsByStudySet(studySetId: string) {
  return useQuery<Document[]>({
    queryKey: qk.documents.byStudySet(studySetId),
    queryFn: () => getDocumentsByStudySetId(studySetId),
    enabled: !!studySetId,
  });
}
