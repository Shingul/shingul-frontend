"use client";

import { use, useState, useRef, useCallback } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useStudySet } from "@/src/queries/studySets.queries";
import DescriptionModal from "@/components/modals/DescriptionModal";
import GenerateFlashcardsModal from "@/components/modals/GenerateFlashcardsModal";
import GenerateQuizModal from "@/components/modals/GenerateQuizModal";
import CreateGameModal from "@/components/modals/CreateGameModal";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import {
  HiOutlineDocumentText,
  HiOutlineBookOpen,
  HiOutlineClipboardDocumentList,
  HiOutlinePlay,
} from "react-icons/hi2";
import { useUploadDocuments } from "@/src/queries/documents.mutations";
import { MAX_PDF_FILES } from "@/lib/constants";

export default function StudySetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: studySet, isLoading: loadingSet } = useStudySet(id, {
    enabled: !!id,
  });

  const [activeTab, setActiveTab] = useState<
    "documents" | "flashcards" | "quizzes" | "games"
  >("documents");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showGenerateFlashcardsModal, setShowGenerateFlashcardsModal] =
    useState(false);
  const [showGenerateQuizModal, setShowGenerateQuizModal] = useState(false);
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadDocuments = useUploadDocuments();

  const handleFiles = useCallback(
    (files: File[]) => {
      if (files.length > MAX_PDF_FILES) {
        alert(`You can only upload up to ${MAX_PDF_FILES} files at once.`);
        return;
      }
      setSelectedFiles(files);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleUpload = useCallback(() => {
    if (selectedFiles.length === 0) return;
    uploadDocuments.mutate(
      { studySetId: id, files: selectedFiles },
      { onSuccess: () => setSelectedFiles([]) }
    );
  }, [selectedFiles, id, uploadDocuments]);

  if (loadingSet) {
    return (
      <div className="min-h-screen bg-[#F9F2E9]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!studySet) {
    return (
      <div className="min-h-screen bg-[#F9F2E9]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-20 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1E1E1E] mb-4">
            Study set not found
          </h2>
          <p className="text-[#1E1E1E]/60 mb-8">
            The study set you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/dashboard"
            className="text-sm font-bold uppercase tracking-widest text-[#66023C] hover:opacity-80 transition-opacity"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const totalPages =
    studySet.documents?.reduce(
      (sum, doc) => sum + (doc.pageCount || 0),
      0
    ) || 0;
  const totalTerms =
    studySet.flashcardDecks?.reduce(
      (sum, deck) => sum + (deck.cardCount || 0),
      0
    ) || 0;
  const totalQuestions =
    studySet.quizzes?.reduce(
      (sum, quiz) => sum + (quiz.questionsCount || 0),
      0
    ) || 0;

  const statusLabels: Record<string, string> = {
    draft: "Draft",
    ready: "Ready",
    processing: "Processing",
  };

  const tabs = ["documents", "flashcards", "quizzes", "games"] as const;

  return (
    <div className="min-h-screen bg-[#F9F2E9] text-[#1E1E1E]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-8">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: studySet.title },
          ]}
        />
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── Left Column: Content ── */}
          <div className="lg:col-span-8 space-y-12">
            {/* Title */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 gap-2">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter lowercase leading-none">
                  {studySet.title}
                </h1>
                <span className="text-xs sm:text-sm font-medium text-[#1E1E1E]/40 uppercase tracking-widest shrink-0">
                  {statusLabels[studySet.status] || studySet.status}
                </span>
              </div>
              <div className="h-1 w-24 bg-[#66023C]" />
            </section>

            {/* AI Quick Summary */}
            {studySet.description && (
              <section
                className="p-6 sm:p-8 rounded-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(102, 2, 60, 0.05)",
                }}
              >
                <div className="flex items-center gap-2 mb-6 text-[#66023C]">
                  <HiOutlineDocumentText className="w-5 h-5" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
                    AI Quick Summary
                  </h2>
                </div>
                <p className="text-lg sm:text-xl leading-relaxed font-light text-[#1E1E1E]/80">
                  {studySet.description}
                </p>
                {studySet.description.length > 100 && (
                  <button
                    onClick={() => setShowDescriptionModal(true)}
                    className="mt-4 text-sm font-semibold text-[#66023C] hover:opacity-80 transition-opacity"
                  >
                    Read full description
                  </button>
                )}
              </section>
            )}

            {/* Tabs */}
            <div>
              <div className="flex gap-4 sm:gap-8 mb-8 border-b border-black/5 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "text-[#66023C] border-b-2 border-[#66023C]"
                        : "text-[#1E1E1E]/40 hover:text-[#1E1E1E]/70"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* ── Documents ── */}
              {activeTab === "documents" && (
                <div>
                  {studySet?.documents && studySet.documents.length > 0 ? (
                    <>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-[#1E1E1E]/40">
                        Resource Files
                      </h3>
                      <div className="space-y-3">
                        {studySet.documents.map((doc) => {
                          const handleDownload = () => {
                            if (doc.url && doc.status === "extracted") {
                              const link = document.createElement("a");
                              link.href = doc.url;
                              link.download = doc.filename;
                              link.target = "_blank";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          };

                          const canDownload =
                            doc.status === "extracted" && doc.url;

                          return (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-4 sm:p-5 bg-white/50 border border-black/5 rounded-lg hover:border-[#66023C]/20 transition-all group"
                            >
                              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                <HiOutlineDocumentText className="w-5 h-5 text-[#66023C]/60 shrink-0" />
                                <span className="text-sm font-semibold truncate">
                                  {doc.filename}
                                </span>
                                <span className="text-xs text-[#1E1E1E]/40 shrink-0 hidden sm:inline">
                                  {doc.pageCount} pages
                                </span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs font-medium text-[#1E1E1E]/40 uppercase tracking-widest hidden sm:inline">
                                  {doc.status}
                                </span>
                                {canDownload && (
                                  <button
                                    onClick={handleDownload}
                                    className="text-[#1E1E1E]/20 group-hover:text-[#66023C] transition-colors"
                                    title="Download"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Drop zone */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`mt-6 w-full border-2 border-dashed rounded-xl py-10 px-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group ${
                          isDragging
                            ? "border-[#66023C]/50 bg-[#66023C]/5"
                            : "border-[#1E1E1E]/10 hover:border-[#66023C]/30 hover:bg-[#66023C]/2"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.docx,.txt"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            handleFiles(files);
                            e.target.value = "";
                          }}
                        />
                        <svg
                          className={`w-10 h-10 transition-colors ${
                            isDragging
                              ? "text-[#66023C]/60"
                              : "text-[#1E1E1E]/15 group-hover:text-[#66023C]/40"
                          }`}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-semibold text-[#1E1E1E]/40 group-hover:text-[#1E1E1E]/60 transition-colors">
                          Drag and drop more files here
                        </p>
                        <p className="text-xs text-[#1E1E1E]/25">
                          Supports PDF, DOCX, TXT (up to 50MB)
                        </p>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="mt-4 p-4 bg-white/50 border border-black/5 rounded-lg space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {selectedFiles.map((f, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#66023C]/5 border border-[#66023C]/10 rounded-full text-xs font-medium text-[#1E1E1E]/70"
                              >
                                <HiOutlineDocumentText className="w-3.5 h-3.5 text-[#66023C]/60" />
                                {f.name}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpload();
                              }}
                              disabled={uploadDocuments.isPending}
                              className="px-4 py-2 bg-[#66023C] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                            >
                              {uploadDocuments.isPending
                                ? "Uploading..."
                                : `Upload ${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"}`}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFiles([]);
                              }}
                              disabled={uploadDocuments.isPending}
                              className="px-4 py-2 bg-white border border-[#1E1E1E]/10 text-[#1E1E1E]/60 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1E1E1E]/5 transition-all disabled:opacity-50"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <HiOutlineDocumentText className="w-12 h-12 text-[#1E1E1E]/20 mx-auto mb-4" />
                      <p className="text-sm font-semibold text-[#1E1E1E]/40 mb-6">
                        No documents yet
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm font-bold uppercase tracking-widest text-[#66023C] hover:opacity-80 transition-opacity"
                      >
                        Add PDF
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Flashcards ── */}
              {activeTab === "flashcards" && (
                <div>
                  {studySet?.flashcardDecks &&
                  studySet.flashcardDecks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {studySet.flashcardDecks.map((deck) => (
                        <Link
                          key={deck.id}
                          href={`/study-sets/${id}/flashcards/${deck.id}`}
                        >
                          <div className="p-5 bg-white/50 border border-black/5 rounded-lg hover:border-[#66023C]/20 transition-all">
                            <div className="flex items-start justify-between mb-3">
                              <HiOutlineBookOpen className="w-5 h-5 text-[#66023C]/60" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E1E1E]/40">
                                {deck.cardCount} cards
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold mb-1">
                              {deck.title}
                            </h3>
                            {deck.description && (
                              <p className="text-xs text-[#1E1E1E]/50 line-clamp-2">
                                {deck.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <HiOutlineBookOpen className="w-12 h-12 text-[#1E1E1E]/20 mx-auto mb-4" />
                      <p className="text-sm font-semibold text-[#1E1E1E]/40 mb-6">
                        No flashcard decks yet
                      </p>
                      <button
                        onClick={() => setShowGenerateFlashcardsModal(true)}
                        className="text-sm font-bold uppercase tracking-widest text-[#66023C] hover:opacity-80 transition-opacity"
                      >
                        Generate Flashcards
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Quizzes ── */}
              {activeTab === "quizzes" && (
                <div>
                  {studySet?.quizzes && studySet.quizzes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {studySet.quizzes.map((quiz) => (
                        <Link
                          key={quiz.id}
                          href={`/study-sets/${id}/quizzes/${quiz.id}`}
                        >
                          <div className="p-5 bg-white/50 border border-black/5 rounded-lg hover:border-[#66023C]/20 transition-all">
                            <HiOutlineClipboardDocumentList className="w-5 h-5 text-[#66023C]/60 mb-3" />
                            <h3 className="text-sm font-semibold mb-1">
                              {quiz.title}
                            </h3>
                            <p className="text-xs text-[#1E1E1E]/50">
                              {quiz.questionsCount} questions
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <HiOutlineClipboardDocumentList className="w-12 h-12 text-[#1E1E1E]/20 mx-auto mb-4" />
                      <p className="text-sm font-semibold text-[#1E1E1E]/40 mb-6">
                        No quizzes yet
                      </p>
                      <button
                        onClick={() => setShowGenerateQuizModal(true)}
                        className="text-sm font-bold uppercase tracking-widest text-[#66023C] hover:opacity-80 transition-opacity"
                      >
                        Generate Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Games ── */}
              {activeTab === "games" && (
                <div>
                  <div className="mb-6">
                    <button
                      onClick={() => setShowCreateGameModal(true)}
                      className="py-3 px-6 bg-[#66023C] text-[#F9F2E9] rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                    >
                      Create Live Game
                    </button>
                  </div>
                  {studySet?.games && studySet.games.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {studySet.games.map((game) => (
                        <Link
                          key={game.id}
                          href={`/study-sets/${id}/games/${game.id}`}
                        >
                          <div className="p-5 bg-white/50 border border-black/5 rounded-lg hover:border-[#66023C]/20 transition-all">
                            <div className="flex items-center justify-between mb-3">
                              <HiOutlinePlay className="w-5 h-5 text-[#66023C]/60" />
                              <span
                                className={`text-[10px] font-bold uppercase tracking-widest ${
                                  game.status === "live"
                                    ? "text-green-700"
                                    : "text-[#1E1E1E]/40"
                                }`}
                              >
                                {game.status}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold mb-1">
                              {game.title || `Game ${game.code}`}
                            </h3>
                            <p className="text-xs text-[#1E1E1E]/50">
                              Code: {game.code} &middot; {game.playersCount}{" "}
                              player
                              {game.playersCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <HiOutlinePlay className="w-12 h-12 text-[#1E1E1E]/20 mx-auto mb-4" />
                      <p className="text-sm font-semibold text-[#1E1E1E]/40">
                        No games yet. Create one above.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Actions ── */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-8">
              {/* Study Tools */}
              <div
                className="p-6 sm:p-8 rounded-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(102, 2, 60, 0.05)",
                }}
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-[#1E1E1E]/40 text-center">
                  Study Tools
                </h3>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setShowGenerateFlashcardsModal(true)}
                    className="w-full py-4 px-6 bg-[#66023C] text-[#F9F2E9] rounded-lg font-bold text-xs sm:text-sm tracking-widest uppercase hover:opacity-90 transition-all shadow-lg shadow-[#66023C]/20 flex items-center justify-center gap-2"
                  >
                    <HiOutlineBookOpen className="w-4 h-4" />
                    Generate Flashcards
                  </button>
                  <button
                    onClick={() => setShowGenerateQuizModal(true)}
                    className="w-full py-4 px-6 bg-white border border-[#66023C]/20 text-[#66023C] rounded-lg font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-[#66023C]/5 transition-all flex items-center justify-center gap-2"
                  >
                    <HiOutlineClipboardDocumentList className="w-4 h-4" />
                    Generate Quiz
                  </button>
                  <button
                    onClick={() => setShowCreateGameModal(true)}
                    className="w-full py-4 px-6 bg-white border border-[#66023C]/20 text-[#66023C] rounded-lg font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-[#66023C]/5 transition-all flex items-center justify-center gap-2"
                  >
                    <HiOutlinePlay className="w-4 h-4" />
                    Start Game
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6 sm:p-8 border border-black/5 rounded-xl bg-white/30 flex justify-around">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalPages}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E1E1E]/40">
                    Pages
                  </p>
                </div>
                <div className="w-px h-8 bg-black/5 self-center" />
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalTerms}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E1E1E]/40">
                    Terms
                  </p>
                </div>
                <div className="w-px h-8 bg-black/5 self-center" />
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalQuestions}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E1E1E]/40">
                    Questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {studySet.description && (
        <DescriptionModal
          isOpen={showDescriptionModal}
          onClose={() => setShowDescriptionModal(false)}
          description={studySet.description}
        />
      )}

      <GenerateFlashcardsModal
        isOpen={showGenerateFlashcardsModal}
        onClose={() => setShowGenerateFlashcardsModal(false)}
        studySetId={id}
        description={studySet.description}
        documents={studySet.documents}
      />

      <GenerateQuizModal
        isOpen={showGenerateQuizModal}
        onClose={() => setShowGenerateQuizModal(false)}
        studySetId={id}
        description={studySet.description}
        documents={studySet.documents}
      />

      <CreateGameModal
        isOpen={showCreateGameModal}
        onClose={() => setShowCreateGameModal(false)}
        studySetId={id}
        quizzes={studySet.quizzes}
        description={studySet.description}
        documents={studySet.documents}
      />
    </div>
  );
}
