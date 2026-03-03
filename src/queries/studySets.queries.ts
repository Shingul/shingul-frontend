/**
 * Study Sets React Query hooks
 */

import { useQuery } from "@tanstack/react-query";
import { listStudySets, getStudySet } from "@/src/api/studySets.api";
import { qk } from "./keys";
import type { StudySet, StudySetDetail } from "@/src/types/api";

/**
 * Get all study sets
 */
export function useStudySets() {
  return useQuery<StudySet[]>({
    queryKey: qk.studySets.list(),
    queryFn: listStudySets,
  });
}

/**
 * Get a single study set by ID with all nested data (documents, quizzes, games)
 */
export function useStudySet(id: string, options?: { enabled?: boolean }) {
  return useQuery<StudySetDetail>({
    queryKey: qk.studySets.detail(id),
    queryFn: () => getStudySet(id),
    enabled: options?.enabled !== false && !!id,
  });
}
