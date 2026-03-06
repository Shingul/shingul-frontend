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
      onSuccess: () => handleClose(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/30 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[640px] bg-white rounded-xl shadow-sm overflow-hidden border border-[#E5DACE] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-[#E5DACE] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#66023C]/10 flex items-center justify-center text-[#66023C]">
              <span className="material-symbols-outlined text-2xl">quiz</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1E1E1E]">
                Generate Quiz
              </h1>
              <p className="text-xs text-[#1E1E1E]/60 uppercase tracking-widest font-semibold">
                Shingul Studio
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={createQuiz.isPending}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F9F2E9] transition-colors text-[#1E1E1E]/40 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create New Quiz
            </h2>
            <p className="text-[#1E1E1E]/60 leading-relaxed max-w-md text-sm">
              Select your source material and configure the quiz to test your
              knowledge.
            </p>
          </div>

          <CreateQuiz
            studySetId={studySetId}
            description={description}
            documents={documents}
            isLoading={createQuiz.isPending}
            onSubmit={handleSubmit}
            showSubmitButton={false}
          />
        </div>

        {/* Footer */}
        <footer className="px-6 sm:px-8 py-6 sm:py-8 bg-[#F9F2E9]/50 border-t border-[#E5DACE] shrink-0">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-xs text-[#1E1E1E]/40 italic">
              Generation usually takes less than 30 seconds.
            </p>
            <button
              onClick={() => {
                const form = document.querySelector(
                  "form"
                ) as HTMLFormElement | null;
                form?.requestSubmit();
              }}
              disabled={createQuiz.isPending}
              className="w-full sm:w-auto px-10 py-4 bg-[#66023C] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#66023C]/20 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createQuiz.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Generating...
                </span>
              ) : (
                "Generate Quiz"
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
