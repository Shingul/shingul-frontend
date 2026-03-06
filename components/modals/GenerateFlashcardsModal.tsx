"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCreateFlashcardDeck } from "@/src/queries/flashcards.mutations";
import { MAX_FLASHCARD_LIMIT } from "@/lib/constants";
import type { Document } from "@/src/types/api";
import toast from "react-hot-toast";

type SourceType = "description" | "document" | "text";

interface GenerateFlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studySetId: string;
  description?: string;
  documents?: Document[];
}

export default function GenerateFlashcardsModal({
  isOpen,
  onClose,
  studySetId,
  description,
  documents = [],
}: GenerateFlashcardsModalProps) {
  const [selectedSources, setSelectedSources] = useState<Set<SourceType>>(
    new Set()
  );
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<number>>(
    new Set()
  );
  const [customText, setCustomText] = useState<string>("");
  const [flashcardCount, setFlashcardCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  const createFlashcardDeck = useCreateFlashcardDeck();

  if (!isOpen) return null;

  const handleClose = () => {
    if (!createFlashcardDeck.isPending) {
      setSelectedSources(new Set());
      setSelectedDocumentIds(new Set());
      setCustomText("");
      setFlashcardCount(10);
      setDifficulty("medium");
      onClose();
    }
  };

  const toggleDocument = (documentId: number) => {
    if (createFlashcardDeck.isPending) return;
    const newDocumentIds = new Set(selectedDocumentIds);
    if (newDocumentIds.has(documentId)) {
      newDocumentIds.delete(documentId);
    } else {
      newDocumentIds.add(documentId);
    }
    setSelectedDocumentIds(newDocumentIds);
  };

  const toggleSource = (source: SourceType) => {
    if (createFlashcardDeck.isPending) return;
    const newSources = new Set(selectedSources);
    if (newSources.has(source)) {
      newSources.delete(source);
    } else {
      newSources.add(source);
    }
    setSelectedSources(newSources);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSources.size === 0) {
      toast.error("Please select at least one source", { duration: 3000 });
      return;
    }
    if (selectedSources.has("document") && selectedDocumentIds.size === 0) {
      toast.error("Please select at least one document", { duration: 3000 });
      return;
    }
    if (selectedSources.has("text") && !customText.trim()) {
      toast.error("Please enter custom text", { duration: 3000 });
      return;
    }
    if (selectedSources.has("description") && !description) return;
    if (flashcardCount < 1 || flashcardCount > MAX_FLASHCARD_LIMIT) {
      toast.error(
        `Flashcard count must be between 1 and ${MAX_FLASHCARD_LIMIT}`,
        { duration: 3000 }
      );
      return;
    }

    const payload = {
      studySetId,
      difficulty,
      count: flashcardCount,
      ...(selectedSources.has("document") && selectedDocumentIds.size > 0
        ? { documentIds: Array.from(selectedDocumentIds) }
        : {}),
      ...(selectedSources.has("text") && customText.trim()
        ? { text: customText.trim() }
        : {}),
      ...(selectedSources.has("description") && description
        ? { description }
        : {}),
    };

    createFlashcardDeck.mutate(payload, {
      onSuccess: () => handleClose(),
    });
  };

  const availableDocuments = documents.filter(
    (doc) => doc.status === "extracted"
  );

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
              <span className="material-symbols-outlined text-2xl">style</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1E1E1E]">
                Generate Flashcards
              </h1>
              <p className="text-xs text-[#1E1E1E]/60 uppercase tracking-widest font-semibold">
                Shingul Studio
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={createFlashcardDeck.isPending}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F9F2E9] transition-colors text-[#1E1E1E]/40 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create New Deck
            </h2>
            <p className="text-[#1E1E1E]/60 leading-relaxed max-w-md text-sm">
              Select your source material and customize the learning experience
              for your study session.
            </p>
          </div>

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
                      <span className="material-symbols-outlined">
                        {src.icon}
                      </span>
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
                    disabled={src.disabled || createFlashcardDeck.isPending}
                    className="w-5 h-5 text-[#66023C] border-[#E5DACE] focus:ring-[#66023C] rounded cursor-pointer accent-[#66023C]"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Document Selection */}
          {selectedSources.has("document") &&
            availableDocuments.length > 0 && (
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
                      disabled={createFlashcardDeck.isPending}
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
                disabled={createFlashcardDeck.isPending}
                placeholder="Enter the text you want to generate flashcards from..."
                rows={5}
                className="w-full bg-[#F9F2E9] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#66023C]/20 focus:outline-none placeholder:text-[#1E1E1E]/30 resize-none disabled:opacity-50"
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
                  Number of Flashcards
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={MAX_FLASHCARD_LIMIT}
                    value={flashcardCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (
                        !isNaN(value) &&
                        value >= 1 &&
                        value <= MAX_FLASHCARD_LIMIT
                      ) {
                        setFlashcardCount(value);
                      }
                    }}
                    disabled={createFlashcardDeck.isPending}
                    className="w-full bg-[#F9F2E9] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#66023C]/20 focus:outline-none placeholder:text-[#1E1E1E]/30 disabled:opacity-50"
                    placeholder="e.g. 20"
                  />
                  <span className="absolute right-4 text-xs font-bold text-[#1E1E1E]/30 uppercase tracking-tighter">
                    Cards
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
                      disabled={createFlashcardDeck.isPending}
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
        </form>

        {/* Footer */}
        <footer className="px-6 sm:px-8 py-6 sm:py-8 bg-[#F9F2E9]/50 border-t border-[#E5DACE] shrink-0">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-xs text-[#1E1E1E]/40 italic">
              Generation usually takes less than 30 seconds.
            </p>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={
                createFlashcardDeck.isPending ||
                selectedSources.size === 0 ||
                (selectedSources.has("document") &&
                  selectedDocumentIds.size === 0) ||
                (selectedSources.has("text") && !customText.trim()) ||
                (selectedSources.has("description") && !description) ||
                flashcardCount < 1 ||
                flashcardCount > MAX_FLASHCARD_LIMIT
              }
              className="w-full sm:w-auto px-10 py-4 bg-[#66023C] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#66023C]/20 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createFlashcardDeck.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Generating...
                </span>
              ) : (
                "Generate Flashcards"
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
