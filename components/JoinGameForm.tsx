"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="game-code"
          className="block text-[#66023C] text-xs font-bold uppercase tracking-widest mb-2 ml-1"
        >
          Game Code
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">
            key
          </span>
          <input
            id="game-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex: 882-X91"
            maxLength={6}
            className="w-full pl-12 pr-4 py-4 rounded-lg border border-zinc-200 bg-zinc-50 text-[#1E1E1E] focus:ring-2 focus:ring-[#66023C]/20 focus:border-[#66023C] outline-none transition-all placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            disabled={isLoading || !!initialCode}
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="nickname"
          className="block text-[#66023C] text-xs font-bold uppercase tracking-widest mb-2 ml-1"
        >
          Your Nickname
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">
            person
          </span>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter name"
            maxLength={20}
            className="w-full pl-12 pr-4 py-4 rounded-lg border border-zinc-200 bg-zinc-50 text-[#1E1E1E] focus:ring-2 focus:ring-[#66023C]/20 focus:border-[#66023C] outline-none transition-all placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-500/50 bg-red-500/10">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading || !code.trim() || !nickname.trim()}
          className="w-full bg-[#66023C] hover:bg-[#66023C]/90 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-[#66023C]/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Joining...</span>
            </>
          ) : (
            <>
              Enter Game
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-100 flex flex-col items-center gap-4">
        <p className="text-zinc-400 text-xs font-medium uppercase tracking-tighter">
          New here?
        </p>
        <Link
          href="/dashboard"
          className="text-[#66023C] font-bold text-sm hover:underline underline-offset-4"
        >
          Host a new game
        </Link>
      </div>
    </form>
  );
}
