"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import LoadingSpinner from "@/components/LoadingSpinner";
import CreateQuiz, {
  buildQuizPayload,
  type CreateQuizFormData,
} from "@/components/CreateQuiz";
import { useCreateGame } from "@/src/queries/games.mutations";
import { useCreateQuiz } from "@/src/queries/quizzes.mutations";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "@/src/queries/keys";
import type { Quiz, Document } from "@/src/types/api";
import toast from "react-hot-toast";
import { MAX_PLAYERS_LIMIT } from "@/lib/constants";
import { useJoinCode } from "@/src/hooks/join-code";

type TabType = "select" | "create";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  studySetId: string;
  quizzes?: Quiz[];
  description?: string;
  documents?: Document[];
}

export default function CreateGameModal({
  isOpen,
  onClose,
  studySetId,
  quizzes = [],
  description,
  documents = [],
}: CreateGameModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("select");
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<number>(MAX_PLAYERS_LIMIT);
  const [pointsPerQuestion, setPointsPerQuestion] = useState<number>(1);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(30);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [gameCreated, setGameCreated] = useState(false);
  const [createdGameId, setCreatedGameId] = useState<string>("");
  const [createdGameCode, setCreatedGameCode] = useState<string>("");
  const { joinUrl, handleCopyCode, handleCopyUrl } = useJoinCode(
    createdGameCode || ""
  );
  const queryClient = useQueryClient();
  const createGame = useCreateGame();
  const createQuiz = useCreateQuiz();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveTab("select");
        setSelectedQuizId("");
        setMaxPlayers(MAX_PLAYERS_LIMIT);
        setPointsPerQuestion(1);
        setTimePerQuestion(30);
        setShowAdvancedSettings(false);
        setGameCreated(false);
        setCreatedGameId("");
        setCreatedGameCode("");
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoToLobby = () => {
    router.push(`/study-sets/${studySetId}/games/${createdGameId}`);
    onClose();
  };

  const handleCreateQuiz = (formData: CreateQuizFormData) => {
    const payload = buildQuizPayload(studySetId, formData, description);
    createQuiz.mutate(payload, {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({
          queryKey: qk.studySets.detail(studySetId),
        });
        setSelectedQuizId(data.id);
        setActiveTab("select");
        toast.success("Quiz created! Now create your game.");
      },
    });
  };

  const handleCreateGame = () => {
    if (!selectedQuizId) {
      toast.error("Please select or create a quiz first", { duration: 3000 });
      return;
    }
    createGame.mutate(
      {
        studySetId,
        quizId: selectedQuizId,
        title: quizzes.find((quiz) => quiz.id === selectedQuizId)?.title,
        maxPlayers: maxPlayers > 0 ? maxPlayers : undefined,
        pointsPerQuestion: pointsPerQuestion > 0 ? pointsPerQuestion : undefined,
        timePerQuestion: timePerQuestion > 0 ? timePerQuestion : undefined,
      },
      {
        onSuccess: (data) => {
          setCreatedGameId(data.id);
          setCreatedGameCode(data.code);
          setGameCreated(true);
        },
      }
    );
  };

  const isPending = createGame.isPending || createQuiz.isPending;

  // Success state — Stitch "Game Created Modal"
  if (gameCreated) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F9F2E9]/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[520px] bg-white rounded-xl shadow-2xl overflow-hidden border border-[#66023C]/5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-[#1E1E1E]/40 hover:text-[#66023C] transition-colors duration-200 z-10"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>

          <div className="px-8 pt-12 pb-10 flex flex-col items-center">
            <div className="size-16 bg-[#66023C]/10 rounded-full flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-[#66023C] text-3xl">
                celebration
              </span>
            </div>
            <h1 className="text-[#1E1E1E] text-3xl font-bold leading-tight tracking-tight text-center mb-3">
              Your Game is Ready
            </h1>
            <p className="text-[#1E1E1E]/60 text-base font-normal leading-relaxed text-center max-w-[340px] mb-10">
              Share this code with your group or scan the QR code to join the
              lobby.
            </p>

            <div className="w-full bg-[#F9F2E9] rounded-xl p-8 mb-8 flex flex-col items-center border border-[#66023C]/10">
              <span className="text-[#66023C] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                Game Code
              </span>
              <div className="flex items-center gap-4">
                <span className="text-[#1E1E1E] text-5xl font-bold tracking-widest font-display">
                  {createdGameCode}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center mb-10">
              <div className="p-4 bg-white border border-zinc-100 rounded-xl shadow-sm mb-4">
                <QRCodeSVG value={joinUrl || ""} size={128} />
              </div>
              <p className="text-[#1E1E1E]/40 text-xs font-medium uppercase tracking-wider">
                Quick Join QR
              </p>
            </div>

            <div className="w-full flex flex-col gap-4">
              <button
                type="button"
                onClick={handleGoToLobby}
                className="w-full py-4 bg-[#66023C] text-white rounded-lg font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Go to Game Lobby
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full py-4 bg-transparent border-2 border-[#66023C]/20 text-[#66023C] rounded-lg font-bold text-base hover:bg-[#66023C]/5 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">
                  content_copy
                </span>
                Copy Code
              </button>
            </div>

            <p className="mt-8 text-[#1E1E1E]/30 text-xs font-medium text-center">
              Need help? Contact the game organizer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main form state
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[640px] bg-white rounded-xl shadow-sm overflow-hidden border border-[#E5DACE] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-[#E5DACE] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#66023C]/10 flex items-center justify-center text-[#66023C]">
              <span className="material-symbols-outlined text-2xl">
                videogame_asset
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1E1E1E]">
                Create Live Game
              </h1>
              <p className="text-xs text-[#1E1E1E]/60 uppercase tracking-widest font-semibold">
                Shingul Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F9F2E9] transition-colors text-[#1E1E1E]/40 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-[#E5DACE] px-6 sm:px-8 shrink-0">
          <button
            onClick={() => setActiveTab("select")}
            disabled={isPending}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              activeTab === "select"
                ? "text-[#66023C] border-b-2 border-[#66023C]"
                : "text-[#1E1E1E]/40 hover:text-[#1E1E1E]/70"
            } disabled:opacity-50`}
          >
            Select Quiz
          </button>
          <button
            onClick={() => setActiveTab("create")}
            disabled={isPending}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              activeTab === "create"
                ? "text-[#66023C] border-b-2 border-[#66023C]"
                : "text-[#1E1E1E]/40 hover:text-[#1E1E1E]/70"
            } disabled:opacity-50`}
          >
            Create New Quiz
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8">
          {activeTab === "select" && (
            <div className="space-y-6">
              {quizzes.length > 0 ? (
                <section className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1E1E1E]/40 px-1">
                    Available Quizzes
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {quizzes.map((quiz) => (
                      <button
                        key={quiz.id}
                        type="button"
                        onClick={() => setSelectedQuizId(quiz.id)}
                        disabled={createGame.isPending}
                        className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
                          selectedQuizId === quiz.id
                            ? "border-[#66023C]/40 bg-[#66023C]/5"
                            : "border-[#E5DACE] hover:border-[#66023C]/40"
                        } disabled:opacity-50`}
                      >
                        <div>
                          <h3 className="font-semibold text-sm">
                            {quiz.title}
                          </h3>
                          <p className="text-xs text-[#1E1E1E]/50 mt-1">
                            {quiz.questionsCount} question
                            {quiz.questionsCount === 1 ? "" : "s"}
                          </p>
                        </div>
                        {selectedQuizId === quiz.id && (
                          <div className="w-5 h-5 rounded-full bg-[#66023C] flex items-center justify-center shrink-0">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-4xl text-[#1E1E1E]/20 mb-4 block">
                    quiz
                  </span>
                  <p className="text-sm font-semibold text-[#1E1E1E]/40 mb-2">
                    No quizzes available
                  </p>
                  <p className="text-xs text-[#1E1E1E]/30">
                    Switch to &quot;Create New Quiz&quot; tab to generate one
                  </p>
                </div>
              )}

              {/* Game Settings (shown when quiz selected) */}
              {selectedQuizId && (
                <>
                  <section className="space-y-3 pt-4 border-t border-[#E5DACE]">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#1E1E1E]/40 px-1">
                      Game Settings
                    </h3>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold block text-[#1E1E1E]/80">
                        Max Players
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          value={maxPlayers}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (
                              !isNaN(value) &&
                              value > 0 &&
                              value <= MAX_PLAYERS_LIMIT
                            ) {
                              setMaxPlayers(value);
                            }
                          }}
                          min={1}
                          max={MAX_PLAYERS_LIMIT}
                          disabled={createGame.isPending}
                          className="w-full bg-[#F9F2E9] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#66023C]/20 focus:outline-none disabled:opacity-50"
                        />
                        <span className="absolute right-4 text-xs font-bold text-[#1E1E1E]/30 uppercase tracking-tighter">
                          Players
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Advanced Settings */}
                  <section className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowAdvancedSettings(!showAdvancedSettings)
                      }
                      disabled={createGame.isPending}
                      className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#1E1E1E]/40 hover:text-[#66023C] transition-colors disabled:opacity-50 px-1"
                    >
                      <span>Advanced Settings</span>
                      <span
                        className={`material-symbols-outlined text-lg transition-transform ${
                          showAdvancedSettings ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {showAdvancedSettings && (
                      <div className="mt-4 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-sm font-semibold block text-[#1E1E1E]/80">
                              Points Per Question
                            </label>
                            <input
                              type="number"
                              value={pointsPerQuestion}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0)
                                  setPointsPerQuestion(value);
                              }}
                              min={1}
                              disabled={createGame.isPending}
                              className="w-full bg-[#F9F2E9] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#66023C]/20 focus:outline-none disabled:opacity-50"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-semibold block text-[#1E1E1E]/80">
                              Time Per Question (s)
                            </label>
                            <input
                              type="number"
                              value={timePerQuestion}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0)
                                  setTimePerQuestion(value);
                              }}
                              min={1}
                              disabled={createGame.isPending}
                              className="w-full bg-[#F9F2E9] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#66023C]/20 focus:outline-none disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          )}

          {activeTab === "create" && (
            <div>
              <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Create Quiz for Game
                </h2>
                <p className="text-[#1E1E1E]/60 leading-relaxed max-w-md text-sm">
                  Generate a new quiz, then use it to create your live game.
                </p>
              </div>
              <CreateQuiz
                studySetId={studySetId}
                description={description}
                documents={documents}
                isLoading={createQuiz.isPending}
                onSubmit={handleCreateQuiz}
                showSubmitButton={true}
                submitButtonText={
                  createQuiz.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" />
                      Creating Quiz...
                    </span>
                  ) : (
                    "Create Quiz"
                  )
                }
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === "select" && selectedQuizId && (
          <footer className="px-6 sm:px-8 py-6 sm:py-8 bg-[#F9F2E9]/50 border-t border-[#E5DACE] shrink-0">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-xs text-[#1E1E1E]/40 italic">
                Players will join using a code or QR.
              </p>
              <button
                onClick={handleCreateGame}
                disabled={createGame.isPending || !selectedQuizId}
                className="w-full sm:w-auto px-10 py-4 bg-[#66023C] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#66023C]/20 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createGame.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Creating Game...
                  </span>
                ) : (
                  "Create Game"
                )}
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
