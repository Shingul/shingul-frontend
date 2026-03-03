"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface JoinGameFormProps {
  code?: string;
  onSubmit: (code: string, nickname: string) => void;
  isLoading?: boolean;
  error?: string;
}

export default function JoinGameForm({
  code: initialCode = "",
  onSubmit,
  isLoading = false,
  error,
}: JoinGameFormProps) {
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !nickname.trim()) return;
    onSubmit(code.trim().toUpperCase(), nickname.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="game-code"
          className="block text-sm font-semibold text-text mb-2"
        >
          Game Code
        </label>
        <input
          id="game-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter game code"
          maxLength={6}
          className="w-full px-4 py-3 glass rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !!initialCode}
          required
        />
      </div>

      <div>
        <label
          htmlFor="nickname"
          className="block text-sm font-semibold text-text mb-2"
        >
          Your Nickname
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your nickname"
          maxLength={20}
          className="w-full px-4 py-3 glass rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
          required
        />
      </div>

      {error && (
        <div className="p-3 glass rounded-lg border border-red-500/50 bg-red-500/10">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !code.trim() || !nickname.trim()}
        className="w-full px-4 py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Joining...</span>
          </>
        ) : (
          "Join Game"
        )}
      </button>
    </form>
  );
}
