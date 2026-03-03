/**
 * Documents API module
 *
 * Handles document-related API calls
 * All functions return unwrapped data (not axios response)
 */

import { httpClient } from "@/src/lib/http";
import type { Document } from "@/src/types/api";

/**
 * Get a single document by ID
 */
export async function getDocument(id: string): Promise<Document> {
  const response = await httpClient.get<Document>(`/documents/${id}`);
  return response.data;
}

/**
 * Get all documents for a study set
 */
export async function getDocumentsByStudySetId(
  studySetId: string
): Promise<Document[]> {
  const response = await httpClient.get<Document[]>(
    `/study-sets/${studySetId}/documents`
  );
  return response.data;
}

/**
 * Upload documents to a study set
 */
export async function uploadDocuments(
  studySetId: string,
  files: File[]
): Promise<Document[]> {
  const formData = new FormData();
  formData.append("studySetId", studySetId);
  files.forEach((file) => {
    formData.append("files[]", file);
  });

  const response = await httpClient.post<Document[]>(`/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

// TODO: Implement retryDocument endpoint when available
// export async function retryDocument(id: string): Promise<Document> {
//   const response = await httpClient.post<Document>(`/documents/${id}/retry`);
//   return response.data;
// }
