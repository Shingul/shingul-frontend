import { httpClient } from "@/src/lib/http";
import type {
  CreateGamePayload,
  CreateGameResponse,
  Game,
  JoinRoomPayload,
  JoinRoomResponse,
  ResumeRoomResponse,
  GameAndQuestionsResponse,
  StartGameResponse,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
  KickoutPlayerPayload,
  KickoutPlayerResponse,
} from "@/src/types/api";

const GAMES_API_URL = "/games";

export async function createGame(
  payload: CreateGamePayload
): Promise<CreateGameResponse> {
  const response = await httpClient.post<CreateGameResponse>(
    GAMES_API_URL,
    payload
  );
  return response.data;
}

export async function getGame(id: string): Promise<Game> {
  const response = await httpClient.get<Game>(`${GAMES_API_URL}/${id}`);
  return response.data;
}

export async function getGameByCode(code: string): Promise<Game> {
  const response = await httpClient.get<Game>(
    `${GAMES_API_URL}/code/${code.toUpperCase()}`
  );
  return response.data;
}

/**
 * Room/Game participant API functions
 */
const ROOMS_API_URL = "/rooms";

/**
 * Join a game room with code and nickname
 */
export async function joinRoom(
  payload: JoinRoomPayload
): Promise<JoinRoomResponse> {
  const response = await httpClient.post<JoinRoomResponse>(
    `${GAMES_API_URL}/join`,
    payload
  );
  return response.data;
}

export async function getParticipants(gameId: string): Promise<Game> {
  const response = await httpClient.get<Game>(`${GAMES_API_URL}/${gameId}/players`);
  return response.data;
}

export async function startGame(gameId: string): Promise<StartGameResponse> {
  const response = await httpClient.put<StartGameResponse>(
    `${GAMES_API_URL}/${gameId}/start`
  );
  return response.data;
}

export async function getGameAndQuestions(gameId: string): Promise<GameAndQuestionsResponse> {
  const response = await httpClient.get<GameAndQuestionsResponse>(`${GAMES_API_URL}/${gameId}/game-and-questions`);
  return response.data;
}

/**
 * Resume a game session using participant token
 */
export async function resumeRoom(
  code: string,
  participantToken: string
): Promise<ResumeRoomResponse> {
  const response = await httpClient.post<ResumeRoomResponse>(
    `${ROOMS_API_URL}/${code.toUpperCase()}/resume`,
    { participantToken }
  );
  return response.data;
}

/**
 * Submit an answer to a question
 */
export async function submitAnswer(
  payload: SubmitAnswerPayload
): Promise<SubmitAnswerResponse> {
  const response = await httpClient.post<SubmitAnswerResponse>(
    `${GAMES_API_URL}/game-response`,
    payload
  );
  return response.data;
}

/**
 * Kick out a player from the game
 */
export async function kickoutPlayer(
  payload: KickoutPlayerPayload
): Promise<KickoutPlayerResponse> {
  const response = await httpClient.put<KickoutPlayerResponse>(
    `${GAMES_API_URL}/${payload.gameSessionId}/kickout`,
    {
      gameSessionId: payload.gameSessionId,
      participantId: payload.participantId,
    }
  );
  return response.data;
}
