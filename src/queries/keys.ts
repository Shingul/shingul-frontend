/**
 * React Query keys
 *
 * Centralized query key factory for consistent cache management
 * All keys are typed using 'as const' for type safety
 */

export const qk = {
  /**
   * Auth query keys
   */
  auth: {
    me: ["auth", "me"] as const,
  },

  /**
   * Study Sets query keys
   */
  studySets: {
    all: ["studySets"] as const,
    lists: () => [...qk.studySets.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...qk.studySets.lists(), filters] as const,
    details: () => [...qk.studySets.all, "detail"] as const,
    detail: (id: string) => ["studySet", id] as const,
  },

  /**
   * Documents query keys
   */
  documents: {
    all: ["documents"] as const,
    details: () => [...qk.documents.all, "detail"] as const,
    detail: (id: string) => [...qk.documents.details(), id] as const,
    byStudySet: (studySetId: string) =>
      [...qk.documents.all, "studySet", studySetId] as const,
  },

  /**
   * Flashcard Decks query keys
   */
  flashcardDecks: {
    all: ["flashcardDecks"] as const,
    details: () => [...qk.flashcardDecks.all, "detail"] as const,
    detail: (id: string) => [...qk.flashcardDecks.details(), id] as const,
  },

  /**
   * Quizzes query keys
   */
  quizzes: {
    all: ["quizzes"] as const,
    details: () => [...qk.quizzes.all, "detail"] as const,
    detail: (id: string) => [...qk.quizzes.details(), id] as const,
  },

  /**
   * Games query keys
   */
  games: {
    all: ["games"] as const,
    details: () => [...qk.games.all, "detail"] as const,
    detail: (id: string) => [...qk.games.details(), id] as const,
    participants: (gameId: string) => [...qk.games.all, "participants", gameId] as const,
    gameAndQuestions: (gameId: string) => [...qk.games.all, "gameAndQuestions", gameId] as const,
  },
} as const;
