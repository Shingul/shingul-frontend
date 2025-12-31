export interface StudySet {
  id: string;
  title: string;
  status: "draft" | "ready" | "processing";
  createdAt: string;
  updatedAt: string;
  documentCount: number;
  flashcardCount: number;
  quizCount: number;
}

export const mockStudySets: StudySet[] = [
  {
    id: "1",
    title: "Introduction to Astronomy",
    status: "ready",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    documentCount: 3,
    flashcardCount: 45,
    quizCount: 2,
  },
  {
    id: "2",
    title: "World History - Ancient Civilizations",
    status: "ready",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    documentCount: 5,
    flashcardCount: 78,
    quizCount: 3,
  },
  {
    id: "3",
    title: "Organic Chemistry Basics",
    status: "processing",
    createdAt: "2024-01-22T11:00:00Z",
    updatedAt: "2024-01-22T11:15:00Z",
    documentCount: 2,
    flashcardCount: 0,
    quizCount: 0,
  },
  {
    id: "4",
    title: "Spanish Vocabulary - Chapter 5",
    status: "draft",
    createdAt: "2024-01-25T08:00:00Z",
    updatedAt: "2024-01-25T08:00:00Z",
    documentCount: 1,
    flashcardCount: 0,
    quizCount: 0,
  },
];

export function getStudySetById(id: string): StudySet | undefined {
  return mockStudySets.find((set) => set.id === id);
}

