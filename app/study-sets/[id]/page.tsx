"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getStudySetById } from "@/lib/mocks/studySets";
import { getDocumentsByStudySetId } from "@/lib/mocks/documents";
import { getQuizzesByStudySetId } from "@/lib/mocks/quizzes";
import { getGamesByStudySetId } from "@/lib/mocks/games";
import Link from "next/link";

async function fetchStudySet(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getStudySetById(id);
}

async function fetchDocuments(studySetId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getDocumentsByStudySetId(studySetId);
}

async function fetchQuizzes(studySetId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getQuizzesByStudySetId(studySetId);
}

async function fetchGames(studySetId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getGamesByStudySetId(studySetId);
}

export default function StudySetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: studySet, isLoading: loadingSet } = useQuery({
    queryKey: ["studySet", id],
    queryFn: () => fetchStudySet(id),
  });
  const { data: documents, isLoading: loadingDocs } = useQuery({
    queryKey: ["documents", id],
    queryFn: () => fetchDocuments(id),
    enabled: !!studySet,
  });
  const { data: quizzes, isLoading: loadingQuizzes } = useQuery({
    queryKey: ["quizzes", id],
    queryFn: () => fetchQuizzes(id),
    enabled: !!studySet,
  });
  const { data: games, isLoading: loadingGames } = useQuery({
    queryKey: ["games", id],
    queryFn: () => fetchGames(id),
    enabled: !!studySet,
  });

  const [activeTab, setActiveTab] = useState<
    "documents" | "flashcards" | "quizzes" | "games"
  >("documents");

  if (loadingSet) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!studySet) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-text">Study set not found</p>
      </div>
    );
  }

  const statusColors = {
    draft: "bg-gray-500/20 text-gray-300",
    ready: "bg-primary2/20 text-primary2",
    processing: "bg-accent/20 text-accent",
  };

  const statusLabels = {
    draft: "Draft",
    ready: "Ready",
    processing: "Processing",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-text">{studySet.title}</h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[studySet.status]}`}
              >
                {statusLabels[studySet.status]}
              </span>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary">
                Generate Flashcards
              </button>
              <button className="px-6 py-2 glass border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Generate Quiz
              </button>
              <button className="px-6 py-2 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors">
                Add PDF
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-muted/20">
            {(["documents", "flashcards", "quizzes", "games"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Tab Content */}
          {activeTab === "documents" && (
            <div>
              {loadingDocs ? (
                <LoadingSpinner />
              ) : documents && documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="glass rounded-xl p-6 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">📄</div>
                        <div>
                          <h3 className="text-lg font-semibold text-text">
                            {doc.filename}
                          </h3>
                          <p className="text-sm text-muted">
                            {doc.pageCount} pages • {doc.status}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          doc.status === "extracted"
                            ? "bg-green-500/20 text-green-400"
                            : doc.status === "extracting"
                              ? "bg-accent/20 text-accent"
                              : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No documents yet</p>
              )}
            </div>
          )}

          {activeTab === "flashcards" && (
            <div>
              {studySet.flashcardCount > 0 ? (
                <Link
                  href={`/study-sets/${id}/flashcards`}
                  className="glass rounded-xl p-8 text-center hover:scale-105 transition-transform glow-primary"
                >
                  <div className="text-6xl mb-4">🎴</div>
                  <h3 className="text-xl font-bold text-text mb-2">
                    {studySet.flashcardCount} Flashcards Ready
                  </h3>
                  <p className="text-muted mb-4">Start studying now!</p>
                  <button className="px-6 py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary">
                    Study Flashcards
                  </button>
                </Link>
              ) : (
                <p className="text-muted">No flashcards generated yet</p>
              )}
            </div>
          )}

          {activeTab === "quizzes" && (
            <div>
              {loadingQuizzes ? (
                <LoadingSpinner />
              ) : quizzes && quizzes.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {quizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      href={`/study-sets/${id}/quizzes/${quiz.id}`}
                      className="glass rounded-xl p-6 hover:scale-105 transition-transform glow-primary/50"
                    >
                      <h3 className="text-xl font-bold text-text mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-muted">
                        {quiz.questions.length} questions
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No quizzes generated yet</p>
              )}
            </div>
          )}

          {activeTab === "games" && (
            <div>
              {loadingGames ? (
                <LoadingSpinner />
              ) : games && games.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {games.map((game) => (
                    <Link
                      key={game.id}
                      href={`/study-sets/${id}/games/${game.id}`}
                      className="glass rounded-xl p-6 hover:scale-105 transition-transform glow-primary/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">🎮</div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            game.status === "waiting"
                              ? "bg-primary2/20 text-primary2"
                              : game.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {game.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-text mb-2">
                        Game: {game.code}
                      </h3>
                      <p className="text-muted">
                        {game.players.length} players
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted mb-4">No games created yet</p>
                  <button className="px-6 py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary">
                    Create Live Game
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
