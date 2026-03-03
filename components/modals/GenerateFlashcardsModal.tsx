"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCreateFlashcardDeck } from "@/src/queries/flashcards.mutations";
import { MAX_FLASHCARD_LIMIT } from "@/lib/constants";
import type { Document } from "@/src/types/api";
import toast from "react-hot-toast";
import { HiOutlineClipboardDocumentList, HiOutlineDocumentText, HiOutlinePencilSquare } from "react-icons/hi2";

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
      toast.error("Please select at least one source", {
        duration: 3000,
      });
      return;
    }

    // Validate specific source requirements
    if (selectedSources.has("document") && selectedDocumentIds.size === 0) {
      toast.error("Please select at least one document", {
        duration: 3000,
      });
      return;
    }
    if (selectedSources.has("text") && !customText.trim()) {
      toast.error("Please enter custom text", {
        duration: 3000,
      });
      return;
    }
    if (selectedSources.has("description") && !description) {
      return;
    }

    // Validate flashcard count
    if (flashcardCount < 1 || flashcardCount > MAX_FLASHCARD_LIMIT) {
      toast.error(
        `Flashcard count must be between 1 and ${MAX_FLASHCARD_LIMIT}`,
        {
          duration: 3000,
        }
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
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const availableDocuments = documents.filter(
    (doc) => doc.status === "extracted"
  );

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
            Generate Flashcards
          </h2>
          <button
            onClick={handleClose}
            disabled={createFlashcardDeck.isPending}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-text mb-3">
              Select Source (Multiple selections allowed)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => toggleSource("description")}
                disabled={!description || createFlashcardDeck.isPending}
                className={`p-4 glass rounded-xl border-2 transition-all text-left relative ${
                  selectedSources.has("description")
                    ? "border-primary bg-primary/20"
                    : "border-transparent hover:border-muted/30"
                } ${!description ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {selectedSources.has("description") && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
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
                disabled={
                  availableDocuments.length === 0 ||
                  createFlashcardDeck.isPending
                }
                className={`p-4 glass rounded-xl border-2 transition-all text-left relative ${
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
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
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
                <div className="text-2xl mb-2 flex justify-center"><HiOutlineDocumentText className="w-8 h-8 text-primary" /></div>
                <div className="font-semibold text-text text-sm">
                  Use PDF Document
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
                disabled={createFlashcardDeck.isPending}
                className={`p-4 glass rounded-xl border-2 transition-all text-left relative ${
                  selectedSources.has("text")
                    ? "border-primary bg-primary/20"
                    : "border-transparent hover:border-muted/30"
                }`}
              >
                {selectedSources.has("text") && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
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
                <div className="text-2xl mb-2 flex justify-center"><HiOutlinePencilSquare className="w-8 h-8 text-primary" /></div>
                <div className="font-semibold text-text text-sm">
                  Custom Prompt
                </div>
                <div className="text-xs text-muted mt-1">Enter your text</div>
              </button>
            </div>
          </div>

          {/* Document Selection */}
          {selectedSources.has("document") && availableDocuments.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Select PDF Documents (Multiple selections allowed)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableDocuments.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => toggleDocument(Number(doc.id))}
                    disabled={createFlashcardDeck.isPending}
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
                      <div className="font-semibold text-text text-sm truncate">
                        {doc.filename}
                      </div>
                      <div className="text-xs text-muted">
                        {doc.pageCount} pages
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {selectedDocumentIds.size > 0 && (
                <p className="text-xs text-muted mt-2">
                  {selectedDocumentIds.size} document
                  {selectedDocumentIds.size === 1 ? "" : "s"} selected
                </p>
              )}
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
                disabled={createFlashcardDeck.isPending}
                placeholder="Enter the text you want to generate flashcards from..."
                rows={6}
                className="w-full px-4 py-2 glass rounded-lg text-text placeholder-muted border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                required={selectedSources.has("text")}
              />
            </div>
          )}

          {/* Flashcard Count */}
          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Number of Flashcards (Max {MAX_FLASHCARD_LIMIT})
            </label>
            <input
              type="number"
              min="1"
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
              className="w-full px-4 py-2 glass rounded-lg text-text border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <p className="text-xs text-muted mt-1">
              Enter a number between 1 and {MAX_FLASHCARD_LIMIT}
            </p>
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
                  disabled={createFlashcardDeck.isPending}
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
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
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
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
            <button
              type="button"
              onClick={handleClose}
              disabled={createFlashcardDeck.isPending}
              className="px-4 py-2.5 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
