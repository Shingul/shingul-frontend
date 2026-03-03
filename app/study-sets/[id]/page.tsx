"use client";

import { use, useState } from "react";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useStudySet } from "@/src/queries/studySets.queries";
import DescriptionModal from "@/components/modals/DescriptionModal";
import UploadPdfModal from "@/components/modals/UploadPdfModal";
import GenerateFlashcardsModal from "@/components/modals/GenerateFlashcardsModal";
import GenerateQuizModal from "@/components/modals/GenerateQuizModal";
import CreateGameModal from "@/components/modals/CreateGameModal";
import {
  PageContainer,
  PageHeader,
  Section,
  Card,
  Button,
  EmptyState,
} from "@/components/ui";
import Link from "next/link";
import {
  HiOutlineDocumentText,
  HiOutlineBookOpen,
  HiOutlineClipboardDocumentList,
  HiOutlinePlay,
} from "react-icons/hi2";

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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGenerateFlashcardsModal, setShowGenerateFlashcardsModal] =
    useState(false);
  const [showGenerateQuizModal, setShowGenerateQuizModal] = useState(false);
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);

  if (loadingSet) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-0">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    );
  }

  if (!studySet) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-0">
          <PageContainer>
            <EmptyState
              title="Study set not found"
              description="The study set you're looking for doesn't exist or has been removed."
              actionLabel="Back to Dashboard"
              actionHref="/dashboard"
            />
          </PageContainer>
        </main>
      </div>
    );
  }

  const statusColors = {
    draft: "bg-bg-2 text-text-muted border border-border",
    ready: "bg-success-light text-success border border-success/30",
    processing: "bg-accent/15 text-accent border border-accent/30",
  };

  const statusLabels = {
    draft: "Draft",
    ready: "Ready",
    processing: "Processing",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        <PageContainer>
          <PageHeader
            title={studySet.title}
            subtitle={
              studySet.description
                ? studySet.description.length > 100
                  ? `${studySet.description.substring(0, 100)}...`
                  : studySet.description
                : "Take your time. You've got this."
            }
            action={
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusColors[studySet.status]}`}
                >
                  {statusLabels[studySet.status]}
                </span>
              </div>
            }
          />

          {/* Description */}
          {studySet.description && studySet.description.length > 100 && (
            <Section className="mb-6">
              <button
                onClick={() => setShowDescriptionModal(true)}
                className="text-sm text-primary hover:text-primary-light transition-colors font-medium"
              >
                Read full description
              </button>
            </Section>
          )}

          {/* Action Buttons */}
          <Section className="mb-8">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setShowGenerateFlashcardsModal(true)}>
                Generate Flashcards
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowGenerateQuizModal(true)}
              >
                Generate Quiz
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowUploadModal(true)}
              >
                Add PDF
              </Button>
            </div>
          </Section>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto">
            {(["documents", "flashcards", "quizzes", "games"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium capitalize transition-colors whitespace-nowrap text-sm ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Tab Content */}
          {activeTab === "documents" && (
            <Section>
              {studySet?.documents && studySet.documents.length > 0 ? (
                <div className="space-y-4">
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

                    const canDownload = doc.status === "extracted" && doc.url;
                    const statusColors = {
                      extracted: "bg-success-light text-success border border-success/30",
                      extracting: "bg-accent/15 text-accent border border-accent/30",
                      queued: "bg-bg-2 text-text-muted border border-border",
                      uploaded: "bg-bg-2 text-text-muted border border-border",
                      error: "bg-error/15 text-error border border-error/30",
                    };

                    return (
                      <Card key={doc.id} className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="text-3xl shrink-0"><HiOutlineDocumentText className="w-8 h-8 text-primary" /></div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-heading text-lg text-text truncate mb-1">
                                {doc.filename}
                              </h3>
                              <p className="text-sm text-text-muted">
                                {doc.pageCount} pages
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {canDownload && (
                              <button
                                onClick={handleDownload}
                                className="p-2 glass rounded-lg text-primary hover:bg-primary/10 transition-all"
                                title="Download document"
                                aria-label="Download document"
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
                            <span
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                                statusColors[doc.status] ||
                                statusColors.uploaded
                              }`}
                            >
                              {doc.status}
                            </span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No documents yet"
                  description="Upload PDFs to get started. You can add them anytime."
                  icon={<HiOutlineDocumentText className="w-16 h-16 text-primary" />}
                  actionLabel="Add PDF"
                  actionOnClick={() => setShowUploadModal(true)}
                />
              )}
            </Section>
          )}

          {activeTab === "flashcards" && (
            <Section>
              {studySet?.flashcardDecks &&
              studySet.flashcardDecks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {studySet.flashcardDecks.map((deck) => (
                    <Link key={deck.id} href={`/study-sets/${id}/flashcards/${deck.id}`}>
                      <Card hover className="h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-2xl"><HiOutlineBookOpen className="w-8 h-8 text-primary" /></div>
                          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                            {deck.cardCount} cards
                          </span>
                        </div>
                        <h3 className="text-heading text-lg text-text mb-2">
                          {deck.title}
                        </h3>
                        {deck.description && (
                          <p className="text-sm text-text-muted line-clamp-2">
                            {deck.description}
                          </p>
                        )}
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No flashcard decks yet"
                  description="Generate flashcards from your study materials. Ready when you are."
                  icon={<HiOutlineBookOpen className="w-16 h-16 text-primary" />}
                  actionLabel="Generate Flashcards"
                  actionOnClick={() => setShowGenerateFlashcardsModal(true)}
                />
              )}
            </Section>
          )}

          {activeTab === "quizzes" && (
            <Section>
              {studySet?.quizzes && studySet.quizzes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {studySet.quizzes.map((quiz) => (
                    <Link key={quiz.id} href={`/study-sets/${id}/quizzes/${quiz.id}`}>
                      <Card hover className="h-full">
                        <div className="text-2xl mb-4"><HiOutlineClipboardDocumentList className="w-8 h-8 text-primary" /></div>
                        <h3 className="text-heading text-lg text-text mb-2">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {quiz.questionsCount} questions
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No quizzes yet"
                  description="Generate quizzes to test your knowledge. Take it one step at a time."
                  icon={<HiOutlineClipboardDocumentList className="w-16 h-16 text-primary" />}
                  actionLabel="Generate Quiz"
                  actionOnClick={() => setShowGenerateQuizModal(true)}
                />
              )}
            </Section>
          )}

          {activeTab === "games" && (
            <Section
              title="Live Games"
              description="Study together with friends. No pressure, just fun."
            >
              <div className="mb-6">
                <Button onClick={() => setShowCreateGameModal(true)}>
                  Create Live Game
                </Button>
              </div>
              {studySet?.games && studySet.games.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {studySet.games.map((game) => {
                    const statusColors = {
                      lobby: "bg-primary/15 text-primary border border-primary/20",
                      live: "bg-success-light text-success border border-success/30",
                      ended: "bg-bg-2 text-text-muted border border-border",
                      cancelled: "bg-bg-2 text-text-muted border border-border",
                      completed: "bg-bg-2 text-text-muted border border-border",
                    };
                    return (
                      <Link key={game.id} href={`/study-sets/${id}/games/${game.id}`}>
                        <Card hover className="h-full">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-2xl"><HiOutlinePlay className="w-8 h-8 text-primary" /></div>
                            <span
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                                statusColors[game.status] || statusColors.lobby
                              }`}
                            >
                              {game.status}
                            </span>
                          </div>
                          <h3 className="text-heading text-lg text-text mb-2">
                            {game.title || `Game ${game.code}`}
                          </h3>
                          <p className="text-sm text-text-muted mb-1">
                            Code: {game.code}
                          </p>
                          <p className="text-sm text-text-muted">
                            {game.playersCount} player{game.playersCount !== 1 ? "s" : ""}
                          </p>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Section>
          )}
        </PageContainer>
      </main>

      {/* Description Modal */}
      {studySet.description && (
        <DescriptionModal
          isOpen={showDescriptionModal}
          onClose={() => setShowDescriptionModal(false)}
          description={studySet.description}
        />
      )}

      {/* Upload PDF Modal */}
      <UploadPdfModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        studySetId={id}
      />

      {/* Generate Flashcards Modal */}
      <GenerateFlashcardsModal
        isOpen={showGenerateFlashcardsModal}
        onClose={() => setShowGenerateFlashcardsModal(false)}
        studySetId={id}
        description={studySet.description}
        documents={studySet.documents}
      />

      {/* Generate Quiz Modal */}
      <GenerateQuizModal
        isOpen={showGenerateQuizModal}
        onClose={() => setShowGenerateQuizModal(false)}
        studySetId={id}
        description={studySet.description}
        documents={studySet.documents}
      />

      {/* Create Game Modal */}
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
