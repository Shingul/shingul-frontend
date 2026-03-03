/**
 * Study Sets API module
 *
 * Handles study set-related API calls
 * All functions return unwrapped data (not axios response)
 */

import { httpClient } from "@/src/lib/http";
import type {
  StudySet,
  StudySetDetail,
  CreateStudySetPayload,
  CreateStudySetResponse,
} from "@/src/types/api";

/**
 * Get all study sets
 */
export async function listStudySets(): Promise<StudySet[]> {
  const response = await httpClient.get<StudySet[]>("/study-sets");
  return response.data;
}

/**
 * Get a single study set by ID with all nested data (documents, quizzes, games)
 */
export async function getStudySet(id: string): Promise<StudySetDetail> {
  const response = await httpClient.get<StudySetDetail>(`/study-sets/${id}`);
  return response.data;
}

/**
 * Create a new study set
 * Handles both text description and file uploads
 */
export async function createStudySet(
  payload: CreateStudySetPayload
): Promise<CreateStudySetResponse> {
  // If files are provided, use FormData
  if (payload.files && payload.files.length > 0) {
    const formData = new FormData();
    formData.append("title", payload.title);

    if (payload.description) {
      formData.append("description", payload.description);
    }

    payload.files.forEach((file) => {
      formData.append("files[]", file);
    });

    const response = await httpClient.post<CreateStudySetResponse>(
      "/study-sets",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  const response = await httpClient.post<CreateStudySetResponse>(
    "/study-sets",
    {
      title: payload.title,
      description: payload.description,
    }
  );

  return response.data;
}
