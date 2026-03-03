"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  STUDY_SET_DESCRIPTION_MAX_WORDS,
  MAX_PDF_FILES,
  MAX_TITLE_LENGTH,
} from "@/lib/constants";
import { useCreateStudySet } from "@/src/queries/studySets.mutations";
import {
  extractTitle,
  extractDescription,
  getFirstLine,
  countWords,
} from "@/lib/utility";
import { HiOutlineBookOpen, HiOutlineDocumentText, HiOutlineLightBulb } from "react-icons/hi";

type UploadState = "idle" | "uploading" | "processing" | "error";

interface CreateStudySetFormProps {
  showCancel?: boolean;
  wrapperClassName?: string;
}

export default function CreateStudySetForm({
  showCancel = false,
  wrapperClassName = "",
}: CreateStudySetFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createStudySet = useCreateStudySet();

  const extractedTitle = extractTitle(content);
  const extractedDescription = extractDescription(content) || content.trim();
  const firstLine = getFirstLine(content);
  const firstLineLength = firstLine.length;
  const isTitleValid = firstLineLength <= MAX_TITLE_LENGTH;
  const wordCount = countWords(extractedDescription);
  const isDescriptionValid = wordCount <= STUDY_SET_DESCRIPTION_MAX_WORDS;
  const hasContent = content.trim().length > 0;

  const uploadState: UploadState = createStudySet.isPending
    ? "uploading"
    : createStudySet.isSuccess
      ? "processing"
      : createStudySet.isError
        ? "error"
        : "idle";

  const handleFileSelect = useCallback(
    (selectedFiles: File[]) => {
      const pdfFiles = selectedFiles.filter(
        (file) => file.type === "application/pdf"
      );
      if (pdfFiles.length !== selectedFiles.length) {
        toast.error("Only PDF files are allowed");
      }
      if (files.length + pdfFiles.length > MAX_PDF_FILES) {
        toast.error(`Maximum ${MAX_PDF_FILES} PDF files allowed`);
        return;
      }
      setFiles((prev) => [...prev, ...pdfFiles]);
    },
    [files.length]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFileSelect(selectedFiles);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!extractedTitle.trim()) {
      toast.error("Please enter at least a title (first line)");
      textareaRef.current?.focus();
      return;
    }

    if (!isTitleValid) {
      toast.error(
        `Title is too long. Maximum ${MAX_TITLE_LENGTH} characters allowed. Please split your content - first line should be a short title, then add a new line for the detailed content.`
      );
      textareaRef.current?.focus();
      return;
    }

    if (!isDescriptionValid) {
      toast.error(
        `Content exceeds the maximum word limit of ${STUDY_SET_DESCRIPTION_MAX_WORDS} words.`
      );
      return;
    }

    createStudySet.mutate({
      title: extractedTitle,
      description: extractedDescription || undefined,
      files: files.length > 0 ? files : undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`flex flex-col ${wrapperClassName}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Preview Section - Shows extracted title and description */}
      {hasContent && (
        <div className="mb-4 glass rounded-xl p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="text-2xl"><HiOutlineBookOpen className="w-8 h-8 text-primary" /></div>
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                    Title
                  </span>
                  {firstLineLength > 0 && (
                    <span
                      className={`text-xs font-semibold ${
                        isTitleValid ? "text-muted" : "text-red-400"
                      }`}
                    >
                      {firstLineLength} / {MAX_TITLE_LENGTH}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-text mt-1 wrap-break-word">
                  {extractedTitle || (
                    <span className="text-muted italic">No title yet</span>
                  )}
                </p>
                {!isTitleValid && firstLineLength > 0 && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Title is too long. Press Enter after the title to add
                    detailed content below.
                  </p>
                )}
              </div>
              {extractedDescription && (
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                    Content
                  </span>
                  <p className="text-xs text-muted mt-1 line-clamp-2 wrap-break-word">
                    {extractedDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div
        className={`relative glass rounded-2xl border-2 transition-colors ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-transparent hover:border-primary/20"
        } ${wrapperClassName}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a short title on the first line...&#10;&#10;Then press Enter and add your detailed study material below."
              rows={6}
              className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-transparent text-text placeholder-muted focus:outline-none resize-none text-sm sm:text-base"
              disabled={uploadState !== "idle"}
              style={{ minHeight: "120px", maxHeight: "400px" }}
            />
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-2xl pointer-events-none">
                <div className="text-center">
                  <div className="text-4xl mb-2 flex justify-center"><HiOutlineDocumentText className="w-10 h-10 text-primary" /></div>
                  <p className="text-sm font-semibold text-primary">
                    Drop PDF files here
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-t border-muted/20 gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={
                  uploadState !== "idle" || files.length >= MAX_PDF_FILES
                }
                className="p-2 glass rounded-lg text-muted hover:text-text hover:bg-bg-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Upload PDF files"
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
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={uploadState !== "idle"}
              />

              {/* Uploaded Files Display */}
              {files.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 px-2 py-1 glass rounded-lg text-xs"
                    >
                      <HiOutlineDocumentText className="w-4 h-4 text-muted shrink-0" />
                      <span className="text-text max-w-[100px] truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={uploadState !== "idle"}
                        className="text-muted hover:text-text transition-colors disabled:opacity-50"
                      >
                        <svg
                          className="w-3.5 h-3.5"
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
                  ))}
                  {files.length >= MAX_PDF_FILES && (
                    <span className="text-xs text-muted">
                      (Max {MAX_PDF_FILES})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: Word Count and Submit */}
            <div className="flex items-center gap-3">
              {/* Word Count */}
              {hasContent && (
                <div className="text-xs text-muted">
                  <span
                    className={
                      isDescriptionValid ? "text-muted" : "text-red-400"
                    }
                  >
                    {wordCount.toLocaleString()} /{" "}
                    {STUDY_SET_DESCRIPTION_MAX_WORDS.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  uploadState !== "idle" ||
                  !extractedTitle.trim() ||
                  !isTitleValid ||
                  !isDescriptionValid
                }
                className="px-4 py-2 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 shrink-0"
              >
                {uploadState === "idle" ? (
                  <>
                    <span>Create</span>
                    <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs bg-white/20 rounded">
                      ⌘↵
                    </kbd>
                  </>
                ) : uploadState === "uploading" ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Processing...</span>
                  </>
                )}
              </button>

              {showCancel && (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors text-sm shrink-0"
                  disabled={uploadState !== "idle"}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Helper Text */}
      <div className="mt-3 text-xs text-muted text-center">
        <p>
          <HiOutlineLightBulb className="w-4 h-4 inline-block align-middle mr-1 text-warning" /><strong>Tip:</strong> First line becomes the title. Press{" "}
          <kbd className="px-1.5 py-0.5 bg-bg-1 rounded text-xs">⌘↵</kbd> or{" "}
          <kbd className="px-1.5 py-0.5 bg-bg-1 rounded text-xs">
            Ctrl+Enter
          </kbd>{" "}
          to create
        </p>
      </div>
    </div>
  );
}
