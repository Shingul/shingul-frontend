/**
 * Shared API types
 */

export interface User {
  email: string;
  name: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  emailVerified: boolean;
  isGuest: boolean;
}

export interface AuthMeResponse {
  user: User | null;
}

export interface StudySet {
  id: string;
  title: string;
  status: "draft" | "ready" | "processing";
  createdAt: string;
  updatedAt: string;
  documentCount: number;
  flashcardCount: number;
  quizCount: number;
  description?: string;
}

export interface Flashcard {
  id: string;
  flashcardDeckId: string;
  front: string;
  back: string;
  difficulty?: "again" | "hard" | "good" | "easy";
  lastReviewed?: string;
}

export interface FlashcardDeck {
  id: string;
  studySetId: string;
  title: string;
  description?: string;
  cardCount: number;
  createdAt: string;
  flashcards: Flashcard[];
}

export interface StudySetDetail extends StudySet {
  documents: Document[];
  quizzes: Quiz[];
  games: Game[];
  flashcardDecks: FlashcardDeck[];
}

export interface Quiz {
  id: string;
  studySetId: string;
  title: string;
  questionsCount: number;
  questions: QuizQuestion[];
  createdAt: string;
  timeLimit?: number; // in seconds
}

export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Game {
  id: string;
  code: string;
  studySetId: StudySet["id"];
  title?: string;
  hostUserId: User["id"];
  isHost?: boolean;
  quizId: Quiz["id"];
  status: "lobby" | "live" | "ended" | "cancelled";
  players: Player[];
  playersCount: number;
  currentQuestion?: number;
  currentQuestionIndex?: number;
  currentQuestionNumber?: number;
  questionStartedAt?: string; // ISO timestamp
  secondsPerQuestion?: number;
  totalQuestions?: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

export interface Player {
  id: string;
  nickname: string;
  avatar?: string;
  score: number;
  isHost: boolean;
  status: "active" | "left" | "kicked";
}

export interface Document {
  id: string;
  studySetId: StudySet["id"];
  filename: string;
  status: "uploaded" | "extracting" | "extracted" | "error" | "queued";
  pageCount: number;
  url: string;
  uploadedAt: string;
}

export interface CreateStudySetPayload {
  title: string;
  description?: string;
  files?: File[];
}

export interface CreateStudySetResponse {
  id: string;
  title: string;
  status: string;
}

export interface CreateFlashcardDeckPayload {
  studySetId: StudySet["id"];
  documentIds?: number[];
  text?: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  count?: number;
}

export interface CreateFlashcardDeckResponse {
  id: string;
  studySetId: StudySet["id"];
  flashcardCount: number;
}

export interface CreateQuizPayload {
  studySetId: StudySet["id"];
  documentIds?: number[];
  text?: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  count?: number;
}

export interface CreateQuizResponse {
  id: string;
  studySetId: StudySet["id"];
  questionsCount: number;
}

export interface CreateGamePayload {
  studySetId: StudySet["id"];
  quizId: Quiz["id"];
  title?: string;
  maxPlayers?: number;
  pointsPerQuestion?: number;
  timePerQuestion?: number; // in seconds
}

export interface CreateGameResponse {
  id: string;
  code: string;
  studySetId: StudySet["id"];
  quizId: Quiz["id"];
  status: "waiting" | "active" | "completed";
}

export interface JoinRoomPayload {
  code: string;
  nickname: string;
}

export interface JoinRoomResponse {
  participantId: string;
  participantToken: string;
  gameId: string;
  studySetId: string;
  redirectUrl?: string;
  redirect?: boolean;
}

export interface ResumeRoomPayload {
  participantToken: string;
}

export interface ResumeRoomResponse {
  participantId: string;
  gameId: string;
  studySetId: string;
  status: "waiting" | "active" | "completed";
  currentQuestionIndex?: number;
  questionStartedAt?: string;
}

export interface SubmitAnswerPayload {
  gameSessionId: string;
  questionId: string;
  choice: string;
  timeUsedSeconds?: number;
}

export interface SubmitAnswerResponse {
  success: boolean;
  correct: boolean;
  pointsEarned: number;
  timeUsedSeconds: number;
  answeredAt: string;
}

export interface StartGameResponse {
  message: string;
  game: Game;
}

export interface GameAndQuestionsResponse {
  game: Game;
  questions: QuizQuestion[];
}

export interface JoinedMessage {
  id: string;
  nickname: string;
  score: number;
  isHost: boolean;
  status: Player["status"];
}

export interface GameUpdatedMessage {
  id: string;
  currentQuestionIndex?: Game["currentQuestionIndex"];
  code?: Game["code"];
  status?: Game["status"];
}

export interface KickoutPlayerPayload {
  gameSessionId: Game["id"];
  participantId: Player["id"];
}

export interface KickoutPlayerResponse {
  success: boolean;
  message: string;
}

// useEffect(() => {
//   const checkToken = async () => {
//     if (!game) return;

//     const token = localStorage.getItem(PARTICIPANT_TOKEN_KEY(game.code));

//     if (!token) {
//       // No token, redirect to join page
//       router.push(`/study-sets/${id}/games/join/${game.code}`);
//       return;
//     }

//     try {
//       const response = await resumeRoom(game.code, token);

//       // If game is active, route to play page
//       if (response.status === "active") {
//         router.push(
//           `/study-sets/${response.studySetId}/games/${response.gameId}/play`
//         );
//         return;
//       }

//       // Game is waiting, stay on lobby
//       setIsResuming(false);
//     } catch {
//       // Token is invalid, redirect to join
//       localStorage.removeItem(PARTICIPANT_TOKEN_KEY(game.code));
//       router.push(`/study-sets/${id}/games/join/${game.code}`);
//     }
//   };

//   if (game) {
//     checkToken();
//   }
// }, [game, id, router]);
