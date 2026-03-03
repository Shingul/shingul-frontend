/**
 * Flashcard Decks React Query queries
 */

import { useQuery } from "@tanstack/react-query";
import { getFlashcardDeck } from "@/src/api/flashcards.api";
import { qk } from "./keys";
import type { FlashcardDeck } from "@/src/types/api";

/**
 * Get a flashcard deck by ID with all its flashcards
 */
export function useFlashcardDeck(id: string, options?: { enabled?: boolean }) {
  return useQuery<FlashcardDeck>({
    queryKey: qk.flashcardDecks.detail(id),
    queryFn: () => getFlashcardDeck(id),
    enabled: options?.enabled !== false && !!id,
  });
}
