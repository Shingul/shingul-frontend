export interface Flashcard {
  id: string;
  studySetId: string;
  front: string;
  back: string;
  difficulty?: "again" | "hard" | "good" | "easy";
  lastReviewed?: string;
}

export const mockFlashcards: Flashcard[] = [
  {
    id: "fc1",
    studySetId: "1",
    front: "What is the largest planet in our solar system?",
    back: "Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined.",
  },
  {
    id: "fc2",
    studySetId: "1",
    front: "How many moons does Saturn have?",
    back: "Saturn has 146 known moons, with Titan being the largest.",
  },
  {
    id: "fc3",
    studySetId: "1",
    front: "What is the distance from Earth to the Sun?",
    back: "The average distance from Earth to the Sun is approximately 93 million miles (150 million kilometers), known as 1 Astronomical Unit (AU).",
  },
  {
    id: "fc4",
    studySetId: "1",
    front: "What causes the phases of the Moon?",
    back: "The phases of the Moon are caused by the relative positions of the Earth, Moon, and Sun, and how much of the Moon's illuminated side we can see from Earth.",
  },
  {
    id: "fc5",
    studySetId: "2",
    front: "When did the ancient Egyptian civilization begin?",
    back: "Ancient Egyptian civilization began around 3100 BCE with the unification of Upper and Lower Egypt under the first pharaoh, Narmer.",
  },
  {
    id: "fc6",
    studySetId: "2",
    front: "What was the primary writing system of ancient Egypt?",
    back: "The primary writing system was hieroglyphics, a system of pictorial symbols used for religious texts and official inscriptions.",
  },
];

export function getFlashcardsByStudySetId(studySetId: string): Flashcard[] {
  return mockFlashcards.filter((card) => card.studySetId === studySetId);
}

export function getFlashcardDeck(deckId: string): Flashcard[] {
  // For now, deckId maps to studySetId
  return getFlashcardsByStudySetId(deckId);
}

