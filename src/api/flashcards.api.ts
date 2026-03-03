import { httpClient } from "@/src/lib/http";
import type {
  CreateFlashcardDeckPayload,
  CreateFlashcardDeckResponse,
  FlashcardDeck,
} from "@/src/types/api";

const FLASHCARD_DECKS_API_URL = "/flashcard-decks";

export async function getFlashcardDeck(id: string): Promise<FlashcardDeck> {
  const response = await httpClient.get<FlashcardDeck>(
    `${FLASHCARD_DECKS_API_URL}/${id}`
  );
  return response.data;
}

export async function createFlashcardDeck(
  payload: CreateFlashcardDeckPayload
): Promise<CreateFlashcardDeckResponse> {
  const response = await httpClient.post<CreateFlashcardDeckResponse>(
    FLASHCARD_DECKS_API_URL,
    payload
  );
  return response.data;
}
