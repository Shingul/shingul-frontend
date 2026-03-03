import { useQuery } from "@tanstack/react-query";
import { getQuiz } from "@/src/api/quizzes.api";
import { qk } from "./keys";
import type { Quiz } from "@/src/types/api";

export function useQuiz(id: string, options?: { enabled?: boolean }) {
  return useQuery<Quiz>({
    queryKey: qk.quizzes.detail(id),
    queryFn: () => getQuiz(id),
    enabled: options?.enabled !== false && !!id,
  });
}
