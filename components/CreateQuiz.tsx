"use client";

import { useState } from "react";
import { MAX_QUIZ_QUESTIONS_LIMIT } from "@/lib/constants";
import type { Document } from "@/src/types/api";
import toast from "react-hot-toast";
import { HiOutlineClipboardDocumentList, HiOutlineDocumentText, HiOutlinePencilSquare } from "react-icons/hi2";

type SourceType = "description" | "document" | "text";

export interface CreateQuizFormData {
  selectedSources: Set<SourceType>;
  selectedDocumentIds: Set<number>;
  customText: string;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface CreateQuizProps {
  studySetId: string;
  description?: string;
  documents?: Document[];
  isLoading?: boolean;
  onSubmit: (data: CreateQuizFormData) => void;
  onReset?: () => void;
  showSubmitButton?: boolean;
  submitButtonText?: React.ReactNode;
}

export default function CreateQuiz({
  studySetId,
  description,
  documents = [],
  isLoading = false,
  onSubmit,
  onReset,
  showSubmitButton = true,
  submitButtonText = "Generate Quiz",
}: CreateQuizProps) {
  const [selectedSources, setSelectedSources] = useState<Set<SourceType>>(
    new Set()
  );
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<number>>(
    new Set()
  );
  const [customText, setCustomText] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  const availableDocuments = documents.filter(
    (doc) => doc.status === "extracted"
  );

  const resetForm = () => {
    setSelectedSources(new Set());
    setSelectedDocumentIds(new Set());
    setCustomText("");
    setQuestionCount(10);
    setDifficulty("medium");
    onReset?.();
  };

  const toggleSource = (source: SourceType) => {
    if (isLoading) return;

    const newSources = new Set(selectedSources);
    if (newSources.has(source)) {
      newSources.delete(source);
    } else {
      newSources.add(source);
    }
    setSelectedSources(newSources);
  };

  const toggleDocument = (documentId: number) => {
    if (isLoading) return;

    const newDocumentIds = new Set(selectedDocumentIds);
    if (newDocumentIds.has(documentId)) {
      newDocumentIds.delete(documentId);
    } else {
      newDocumentIds.add(documentId);
    }
    setSelectedDocumentIds(newDocumentIds);
  };

  const validateForm = (): boolean => {
    if (selectedSources.size === 0) {
      toast.error("Please select at least one source", { duration: 3000 });
      return false;
    }

    if (selectedSources.has("document") && selectedDocumentIds.size === 0) {
      toast.error("Please select at least one document", { duration: 3000 });
      return false;
    }

    if (selectedSources.has("text") && !customText.trim()) {
      toast.error("Please enter custom text", { duration: 3000 });
      return false;
    }

    if (selectedSources.has("description") && !description) {
      toast.error("Description source is not available", { duration: 3000 });
      return false;
    }

    if (questionCount < 1 || questionCount > MAX_QUIZ_QUESTIONS_LIMIT) {
      toast.error(
        `Question count must be between 1 and ${MAX_QUIZ_QUESTIONS_LIMIT}`,
        { duration: 3000 }
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      selectedSources,
      selectedDocumentIds,
      customText,
      questionCount,
      difficulty,
    });
  };

  // Expose reset function via ref or callback
  // For now, we'll use a useEffect pattern or expose it via props
  // The parent can call resetForm when needed

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source Selection */}
      <div>
        <label className="block text-sm font-semibold text-text mb-3">
          Select Source(s)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => toggleSource("description")}
            disabled={!description || isLoading}
            className={`relative p-4 glass rounded-xl border-2 transition-all text-left ${
              selectedSources.has("description")
                ? "border-primary bg-primary/20"
                : "border-transparent hover:border-muted/30"
            } ${!description ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {selectedSources.has("description") && (
              <div className="absolute top-2 right-2 text-primary">
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
            <div className="text-2xl mb-2 flex justify-center"><HiOutlineClipboardDocumentList className="w-8 h-8 text-primary" /></div>
            <div className="font-semibold text-text text-sm">
              Use Description
            </div>
            <div className="text-xs text-muted mt-1">
              {description ? "Available" : "No description"}
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleSource("document")}
            disabled={availableDocuments.length === 0 || isLoading}
            className={`relative p-4 glass rounded-xl border-2 transition-all text-left ${
              selectedSources.has("document")
                ? "border-primary bg-primary/20"
                : "border-transparent hover:border-muted/30"
            } ${
              availableDocuments.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {selectedSources.has("document") && (
              <div className="absolute top-2 right-2 text-primary">
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
            <div className="text-2xl mb-2 flex justify-center"><HiOutlineDocumentText className="w-8 h-8 text-primary" /></div>
            <div className="font-semibold text-text text-sm">
              Use PDF Document(s)
            </div>
            <div className="text-xs text-muted mt-1">
              {availableDocuments.length > 0
                ? `${availableDocuments.length} available`
                : "No PDFs"}
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleSource("text")}
            disabled={isLoading}
            className={`relative p-4 glass rounded-xl border-2 transition-all text-left ${
              selectedSources.has("text")
                ? "border-primary bg-primary/20"
                : "border-transparent hover:border-muted/30"
            }`}
          >
            {selectedSources.has("text") && (
              <div className="absolute top-2 right-2 text-primary">
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
            <div className="text-2xl mb-2 flex justify-center"><HiOutlinePencilSquare className="w-8 h-8 text-primary" /></div>
            <div className="font-semibold text-text text-sm">Custom Prompt</div>
            <div className="text-xs text-muted mt-1">Enter your text</div>
          </button>
        </div>
      </div>

      {/* Document Selection */}
      {selectedSources.has("document") && availableDocuments.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-text mb-2">
            Select PDF Document(s) ({selectedDocumentIds.size} selected)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
            {availableDocuments.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => toggleDocument(Number(doc.id))}
                disabled={isLoading}
                className={`w-full p-3 glass rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                  selectedDocumentIds.has(Number(doc.id))
                    ? "border-primary bg-primary/20"
                    : "border-transparent hover:border-muted/30"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    selectedDocumentIds.has(Number(doc.id))
                      ? "bg-primary border-primary"
                      : "border-muted/50"
                  }`}
                >
                  {selectedDocumentIds.has(Number(doc.id)) && (
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
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-text text-sm truncate">
                    {doc.filename}
                  </div>
                  <div className="text-xs text-muted">
                    {doc.pageCount} pages
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Text Input */}
      {selectedSources.has("text") && (
        <div>
          <label className="block text-sm font-semibold text-text mb-2">
            Enter Your Text
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            disabled={isLoading}
            placeholder="Enter the text you want to generate quiz questions from..."
            rows={6}
            className="w-full px-4 py-2 glass rounded-lg text-text placeholder-muted border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
        </div>
      )}

      {/* Number of Questions */}
      <div>
        <label
          htmlFor="question-count"
          className="block text-sm font-semibold text-text mb-2"
        >
          Number of Questions (Max {MAX_QUIZ_QUESTIONS_LIMIT})
        </label>
        <input
          id="question-count"
          type="number"
          value={questionCount}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (
              !isNaN(value) &&
              value >= 1 &&
              value <= MAX_QUIZ_QUESTIONS_LIMIT
            ) {
              setQuestionCount(value);
            }
          }}
          min={1}
          max={MAX_QUIZ_QUESTIONS_LIMIT}
          disabled={isLoading}
          className="w-full px-4 py-2 glass rounded-lg text-text border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Difficulty Selection */}
      <div>
        <label className="block text-sm font-semibold text-text mb-3">
          Difficulty Level
        </label>
        <div className="flex gap-3">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              disabled={isLoading}
              className={`flex-1 px-4 py-3 glass rounded-lg font-semibold transition-all capitalize ${
                difficulty === level
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "text-muted hover:text-text border-2 border-transparent"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      {showSubmitButton && (
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={
              isLoading ||
              selectedSources.size === 0 ||
              (selectedSources.has("document") &&
                selectedDocumentIds.size === 0) ||
              (selectedSources.has("text") && !customText.trim()) ||
              (selectedSources.has("description") && !description) ||
              questionCount < 1 ||
              questionCount > MAX_QUIZ_QUESTIONS_LIMIT
            }
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {submitButtonText || "Generate Quiz"}
          </button>
        </div>
      )}
    </form>
  );
}

// Export helper function to build payload from form data
export function buildQuizPayload(
  studySetId: string,
  formData: CreateQuizFormData,
  description?: string
) {
  return {
    studySetId,
    difficulty: formData.difficulty,
    count: formData.questionCount,
    ...(formData.selectedSources.has("document") &&
    formData.selectedDocumentIds.size > 0
      ? { documentIds: Array.from(formData.selectedDocumentIds) }
      : {}),
    ...(formData.selectedSources.has("text") && formData.customText.trim()
      ? { text: formData.customText.trim() }
      : {}),
    ...(formData.selectedSources.has("description") && description
      ? { description }
      : {}),
  };
}
