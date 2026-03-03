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
  const { joinUrl, handleCopyCode, handleCopyUrl } = useJoinCode(createdGameCode || "");
  const queryClient = useQueryClient();
  const createGame = useCreateGame();
  const createQuiz = useCreateQuiz();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Defer state updates to avoid cascading renders
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

  // Success state
  if (gameCreated) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="glass rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto glow-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <p className="text-sm sm:text-base text-muted">
              Share the code or QR code for players to join
            </p>
          </div>

          {/* Game Code */}
          <div className="glass rounded-xl p-6 sm:p-8 mb-6 text-center">
            <p className="text-xs sm:text-sm text-muted mb-3">Game Code</p>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary2 mb-4">
              {createdGameCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 glass border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Code
            </button>
          </div>

          {/* QR Code */}
          <div className="glass rounded-xl p-6 sm:p-8 mb-6 text-center">
            <p className="text-xs sm:text-sm text-muted mb-4">Scan to Join</p>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG value={joinUrl || ""} size={200} />
              </div>
            </div>
            <button
              onClick={handleCopyUrl}
              className="px-4 py-2 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Join URL
            </button>
            <p className="text-xs text-muted mt-3 break-all">{joinUrl}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoToLobby}
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary text-sm"
            >
              Go to Game Lobby
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main form state
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto glow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            Create Live Game
          </h2>
          <button
            onClick={onClose}
            disabled={createGame.isPending || createQuiz.isPending}
            className="p-2 glass rounded-lg text-muted hover:text-text hover:bg-bg-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-muted/20">
          <button
            onClick={() => setActiveTab("select")}
            disabled={createGame.isPending || createQuiz.isPending}
            className={`px-4 py-2 font-semibold transition-colors text-sm ${
              activeTab === "select"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-text"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Select Quiz
          </button>
          <button
            onClick={() => setActiveTab("create")}
            disabled={createGame.isPending || createQuiz.isPending}
            className={`px-4 py-2 font-semibold transition-colors text-sm ${
              activeTab === "create"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-text"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Create New Quiz
          </button>
        </div>

        {/* Select Quiz Tab */}
        {activeTab === "select" && (
          <div className="space-y-6">
            {quizzes.length > 0 ? (
              <div>
                <label className="block text-sm font-semibold text-text mb-3">
                  Select a Quiz
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {quizzes.map((quiz) => (
                    <button
                      key={quiz.id}
                      type="button"
                      onClick={() => setSelectedQuizId(quiz.id)}
                      disabled={createGame.isPending}
                      className={`w-full p-4 glass rounded-xl border-2 transition-all text-left ${
                        selectedQuizId === quiz.id
                          ? "border-primary bg-primary/20"
                          : "border-transparent hover:border-muted/30"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-text text-sm sm:text-base">
                            {quiz.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted mt-1">
                            {quiz.questionsCount} question
                            {quiz.questionsCount === 1 ? "" : "s"}
                          </p>
                        </div>
                        {selectedQuizId === quiz.id && (
                          <div className="text-primary">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted mb-4">No quizzes available</p>
                <p className="text-sm text-muted">
                  Switch to &quot;Create New Quiz&quot; tab to generate one
                </p>
              </div>
            )}

            {/* Max Players Input */}
            {selectedQuizId && (
              <div>
                <label
                  htmlFor="max-players"
                  className="block text-sm font-semibold text-text mb-2"
                >
                  Max Players
                </label>
                <input
                  id="max-players"
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
                  className="w-full px-4 py-2 glass rounded-lg text-text border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted mt-1">
                  Maximum number of players that can join this game (1-
                  {MAX_PLAYERS_LIMIT})
                </p>
              </div>
            )}

            {/* Advanced Settings */}
            {selectedQuizId && (
              <div className="mt-6 pt-6 border-t border-muted/20">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  disabled={createGame.isPending}
                  className="w-full flex items-center justify-between text-sm font-semibold text-text hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Advanced Settings</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      showAdvancedSettings ? "rotate-180" : ""
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showAdvancedSettings && (
                  <div className="mt-4 space-y-4">
                    {/* Points Per Question */}
                    <div>
                      <label
                        htmlFor="points-per-question"
                        className="block text-sm font-semibold text-text mb-2"
                      >
                        Points Per Question
                      </label>
                      <input
                        id="points-per-question"
                        type="number"
                        value={pointsPerQuestion}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            setPointsPerQuestion(value);
                          }
                        }}
                        min={1}
                        disabled={createGame.isPending}
                        className="w-full px-4 py-2 glass rounded-lg text-text border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-muted mt-1">
                        Points awarded for each correct answer
                      </p>
                    </div>

                    {/* Time Per Question */}
                    <div>
                      <label
                        htmlFor="time-per-question"
                        className="block text-sm font-semibold text-text mb-2"
                      >
                        Time Per Question (seconds)
                      </label>
                      <input
                        id="time-per-question"
                        type="number"
                        value={timePerQuestion}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            setTimePerQuestion(value);
                          }
                        }}
                        min={1}
                        disabled={createGame.isPending}
                        className="w-full px-4 py-2 glass rounded-lg text-text border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-muted mt-1">
                        Time limit in seconds for each question
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Create Quiz Tab */}
        {activeTab === "create" && (
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
        )}

        {/* Create Game Button (shown when quiz is selected) */}
        {activeTab === "select" && selectedQuizId && (
          <div className="mt-6 pt-6 border-t border-muted/20">
            <button
              onClick={handleCreateGame}
              disabled={createGame.isPending || !selectedQuizId}
              className="w-full px-4 py-2.5 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
        )}
      </div>
    </div>
  );
}
