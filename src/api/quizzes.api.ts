/**
 * Quiz API functions
 */

import { httpClient } from "@/src/lib/http";
import type {
  Quiz,
  CreateQuizPayload,
  CreateQuizResponse,
} from "@/src/types/api";

const QUIZZES_API_URL = "/quizzes";

/**
 * Get a single quiz by ID with all questions
 */
export async function getQuiz(id: string): Promise<Quiz> {
  const response = await httpClient.get<Quiz>(`${QUIZZES_API_URL}/${id}`);
  return response.data;
}

/**
 * Create a new quiz
 */
export async function createQuiz(
  payload: CreateQuizPayload
): Promise<CreateQuizResponse> {
  const response = await httpClient.post<CreateQuizResponse>(
    QUIZZES_API_URL,
    payload
  );
  return response.data;
}
