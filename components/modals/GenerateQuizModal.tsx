"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import CreateQuiz, { buildQuizPayload } from "@/components/CreateQuiz";
import { useCreateQuiz } from "@/src/queries/quizzes.mutations";
import type { Document } from "@/src/types/api";
import type { CreateQuizFormData } from "@/components/CreateQuiz";

interface GenerateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  studySetId: string;
  description?: string;
  documents?: Document[];
}

export default function GenerateQuizModal({
  isOpen,
  onClose,
  studySetId,
  description,
  documents = [],
}: GenerateQuizModalProps) {
  const createQuiz = useCreateQuiz();

  if (!isOpen) return null;

  const handleClose = () => {
    if (!createQuiz.isPending) {
      onClose();
    }
  };

  const handleSubmit = (formData: CreateQuizFormData) => {
    const payload = buildQuizPayload(studySetId, formData, description);

    createQuiz.mutate(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="glass rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto glow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            Generate Quiz
          </h2>
          <button
            onClick={handleClose}
            disabled={createQuiz.isPending}
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

        <CreateQuiz
          studySetId={studySetId}
          description={description}
          documents={documents}
          isLoading={createQuiz.isPending}
          onSubmit={handleSubmit}
          submitButtonText={
            createQuiz.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Generating...
              </span>
            ) : (
              "Generate Quiz"
            )
          }
        />

        <div className="flex gap-3 pt-4 mt-6 border-t border-muted/20">
          <button
            type="button"
            onClick={handleClose}
            disabled={createQuiz.isPending}
            className="px-4 py-2.5 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
