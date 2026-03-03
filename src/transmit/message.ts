import { Game } from "../types/api";
import { JoinedMessage, Player } from "../types/api";

function applyParticipantJoined(old: Game, message: JoinedMessage): Game {
    if (!old) return old
  
    const players = old.players ?? []
    if (players.some((p) => p.id === message.id)) return old
  
    const newPlayer: Player = {
      id: message.id,
      nickname: message.nickname,
      score: message.score ?? 0,
      status: message.status ?? 'active',
      isHost: false,
    }
  
    return { ...old, players: [...players, newPlayer] }
  }

export const messagesHandlers = {
    joined: applyParticipantJoined,
}