export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  studySetId: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
  timeLimit?: number; // in seconds
}

export const mockQuizzes: Quiz[] = [
  {
    id: "quiz1",
    studySetId: "1",
    title: "Astronomy Basics Quiz",
    questions: [
      {
        id: "q1",
        question: "What is the largest planet in our solar system?",
        options: ["Saturn", "Jupiter", "Neptune", "Earth"],
        correctAnswer: 1,
        explanation: "Jupiter is the largest planet, with a mass greater than all other planets combined.",
      },
      {
        id: "q2",
        question: "How many planets are in our solar system?",
        options: ["7", "8", "9", "10"],
        correctAnswer: 1,
        explanation: "There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
      },
      {
        id: "q3",
        question: "What is the closest star to Earth?",
        options: ["Proxima Centauri", "The Sun", "Alpha Centauri", "Sirius"],
        correctAnswer: 1,
        explanation: "The Sun is the closest star to Earth, located approximately 93 million miles away.",
      },
      {
        id: "q4",
        question: "What causes the seasons on Earth?",
        options: [
          "Distance from the Sun",
          "Earth's axial tilt",
          "Earth's rotation speed",
          "Ocean currents",
        ],
        correctAnswer: 1,
        explanation: "Earth's axial tilt of 23.5 degrees causes different parts of the planet to receive varying amounts of sunlight throughout the year.",
      },
    ],
    createdAt: "2024-01-20T14:30:00Z",
    timeLimit: 300, // 5 minutes
  },
  {
    id: "quiz2",
    studySetId: "2",
    title: "Ancient Egypt Quiz",
    questions: [
      {
        id: "q5",
        question: "Who was the first pharaoh of unified Egypt?",
        options: ["Tutankhamun", "Cleopatra", "Narmer", "Ramesses II"],
        correctAnswer: 2,
        explanation: "Narmer (also known as Menes) unified Upper and Lower Egypt around 3100 BCE.",
      },
      {
        id: "q6",
        question: "What was the primary writing system of ancient Egypt?",
        options: ["Cuneiform", "Hieroglyphics", "Latin", "Greek"],
        correctAnswer: 1,
        explanation: "Hieroglyphics was the primary writing system, using pictorial symbols.",
      },
    ],
    createdAt: "2024-01-18T16:45:00Z",
    timeLimit: 240, // 4 minutes
  },
];

export function getQuizById(quizId: string): Quiz | undefined {
  return mockQuizzes.find((quiz) => quiz.id === quizId);
}

export function getQuizzesByStudySetId(studySetId: string): Quiz[] {
  return mockQuizzes.filter((quiz) => quiz.studySetId === studySetId);
}

