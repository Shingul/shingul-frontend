export interface Player {
  id: string;
  nickname: string;
  avatar?: string;
  score: number;
  isHost: boolean;
}

export interface Game {
  id: string;
  code: string;
  studySetId: string;
  status: "waiting" | "active" | "completed";
  players: Player[];
  currentQuestion?: number;
  totalQuestions?: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

export const mockGames: Game[] = [
  {
    id: "game1",
    code: "SHINGUL",
    studySetId: "1",
    status: "waiting",
    players: [
      {
        id: "p1",
        nickname: "SpaceExplorer",
        score: 0,
        isHost: true,
      },
      {
        id: "p2",
        nickname: "StarGazer",
        score: 0,
        isHost: false,
      },
      {
        id: "p3",
        nickname: "CosmicKid",
        score: 0,
        isHost: false,
      },
    ],
    createdAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "game2",
    code: "QUIZ123",
    studySetId: "2",
    status: "active",
    players: [
      {
        id: "p4",
        nickname: "HistoryBuff",
        score: 450,
        isHost: true,
      },
      {
        id: "p5",
        nickname: "AncientFan",
        score: 380,
        isHost: false,
      },
      {
        id: "p6",
        nickname: "Pharaoh",
        score: 520,
        isHost: false,
      },
      {
        id: "p7",
        nickname: "Pyramid",
        score: 290,
        isHost: false,
      },
    ],
    currentQuestion: 3,
    totalQuestions: 10,
    createdAt: "2024-01-25T09:00:00Z",
    startedAt: "2024-01-25T09:05:00Z",
  },
];

export function getGameById(id: string): Game | undefined {
  return mockGames.find((game) => game.id === id);
}

export function getGameByCode(code: string): Game | undefined {
  return mockGames.find((game) => game.code === code.toUpperCase());
}

export function getGamesByStudySetId(studySetId: string): Game[] {
  return mockGames.filter((game) => game.studySetId === studySetId);
}

/**
 * Generate a random 6-character uppercase alphanumeric game code
 */
export function generateGameCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Check if a game code is unique (for mock purposes)
 */
function isCodeUnique(code: string): boolean {
  return !mockGames.some((game) => game.code === code);
}

/**
 * Create a new game with auto-generated code
 * Mock implementation - will be replaced with real API
 */
export function createGame(studySetId: string, quizId: string): Game {
  // Generate unique code
  let code = generateGameCode();
  while (!isCodeUnique(code)) {
    code = generateGameCode();
  }

  // Generate unique game ID
  const gameId = `game${Date.now()}`;

  // Create game object
  const newGame: Game = {
    id: gameId,
    code,
    studySetId,
    status: "waiting",
    players: [
      {
        id: "p-host",
        nickname: "Host",
        score: 0,
        isHost: true,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  // Add to mock games array
  mockGames.push(newGame);

  return newGame;
}
