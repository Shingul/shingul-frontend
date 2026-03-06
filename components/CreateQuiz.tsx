"use client";

import { useState } from "react";
import { MAX_QUIZ_QUESTIONS_LIMIT } from "@/lib/constants";
import type { Document } from "@/src/types/api";
import toast from "react-hot-toast";

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
    if (!validateForm()) return;
    onSubmit({
      selectedSources,
      selectedDocumentIds,
      customText,
      questionCount,
      difficulty,
    });
  };

  void resetForm;

  const sources = [
    {
      type: "description" as SourceType,
      icon: "description",
      label: "Use Description",
      sub: description ? "Available" : "No description",
      disabled: !description,
    },
    {
      type: "document" as SourceType,
      icon: "picture_as_pdf",
      label: "Use PDF Document",
      sub:
        availableDocuments.length > 0
          ? `${availableDocuments.length} available`
          : "No PDFs",
      disabled: availableDocuments.length === 0,
    },
    {
      type: "text" as SourceType,
      icon: "auto_awesome",
      label: "Custom Prompt",
      sub: "Give specific instructions for AI",
      disabled: false,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Source Material */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1E1E1E]/40 px-1">
          Source Material
        </h3>
        <div className="grid gap-3">
          {sources.map((src) => (
            <label
              key={src.type}
              className={`group relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                selectedSources.has(src.type)
                  ? "border-[#66023C]/40 bg-[#66023C]/5"
                  : "border-[#E5DACE] hover:border-[#66023C]/40"
              } ${src.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    selectedSources.has(src.type)
                      ? "bg-[#66023C]/10 text-[#66023C]"
                      : "bg-[#F9F2E9] text-[#1E1E1E]/70 group-hover:text-[#66023C]"
                  }`}
                >
                  <span className="material-symbols-outlined">{src.icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{src.label}</p>
                  <p className="text-xs text-[#1E1E1E]/50">{src.sub}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={selectedSources.has(src.type)}
                onChange={() => !src.disabled && toggleSource(src.type)}
                disabled={src.disabled || isLoading}
                className="w-5 h-5 text-[#66023C] border-[#E5DACE] focus:ring-[#66023C] rounded cursor-pointer accent-[#66023C]"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Document Selection */}
      {selectedSources.has("document") && availableDocuments.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1E1E1E]/40 px-1">
            Select Documents ({selectedDocumentIds.size} selected)
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableDocuments.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => toggleDocument(Number(doc.id))}
                disabled={isLoading}
                className={`w-full p-3 rounded-lg border transition-all text-left flex items-center gap-3 ${
                  selectedDocumentIds.has(Number(doc.id))
                    ? "border-[#66023C]/40 bg-[#66023C]/5"
                    : "border-[#E5DACE] hover:border-[#66023C]/40"
                } disabled:opacity-50`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    selectedDocumentIds.has(Number(doc.id))
                      ? "bg-[#66023C] border-[#66023C]"
                      : "border-[#E5DACE]"
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
                  <p className="font-semibold text-sm truncate">
                    {doc.filename}
                  </p>
                  <p className="text-xs text-[#1E1E1E]/50">
                    {doc.pageCount} pages
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Custom Text */}
      {selectedSources.has("text") && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1E1E1E]/40 px-1">
            Custom Prompt
          </h3>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            disabled={isLoading}
            placeholder="Enter the text you want to generate quiz questions from..."
            rows={5}
            className="w-full bg-[#F9F2E9] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#66023C]/20 focus:outline-none placeholder:text-[#1E1E1E]/30 resize-none disabled:opacity-50"
            required
          />
        </section>
      )}

      {/* Configuration */}
      <section className="space-y-6 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1E1E1E]/40 px-1">
          Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold block text-[#1E1E1E]/80">
              Number of Questions
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min={1}
                max={MAX_QUIZ_QUESTIONS_LIMIT}
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
                disabled={isLoading}
                className="w-full bg-[#F9F2E9] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#66023C]/20 focus:outline-none placeholder:text-[#1E1E1E]/30 disabled:opacity-50"
                placeholder="e.g. 10"
              />
              <span className="absolute right-4 text-xs font-bold text-[#1E1E1E]/30 uppercase tracking-tighter">
                Qs
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold block text-[#1E1E1E]/80">
              Difficulty Level
            </label>
            <div className="flex p-1 bg-[#F9F2E9] rounded-lg">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  disabled={isLoading}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all capitalize ${
                    difficulty === level
                      ? "bg-white text-[#66023C] shadow-sm ring-1 ring-[#E5DACE]"
                      : "text-[#1E1E1E]/40 hover:text-[#1E1E1E]"
                  } disabled:opacity-50`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Submit */}
      {showSubmitButton && (
        <div className="pt-4">
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
            className="w-full sm:w-auto px-10 py-4 bg-[#66023C] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#66023C]/20 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitButtonText || "Generate Quiz"}
          </button>
        </div>
      )}
    </form>
  );
}

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
