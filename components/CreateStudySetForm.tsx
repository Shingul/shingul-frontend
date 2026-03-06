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
        `Title is too long. Maximum ${MAX_TITLE_LENGTH} characters allowed.`
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
      {/* Preview strip */}
      {hasContent && (
        <div className="mb-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-[#66023C]/5">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E1E1E]/40">
                  Title
                </span>
                {firstLineLength > 0 && (
                  <span
                    className={`text-[10px] font-bold ${
                      isTitleValid ? "text-[#1E1E1E]/40" : "text-red-500"
                    }`}
                  >
                    {firstLineLength} / {MAX_TITLE_LENGTH}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#1E1E1E] wrap-break-word">
                {extractedTitle || (
                  <span className="text-[#1E1E1E]/30 italic">No title yet</span>
                )}
              </p>
              {!isTitleValid && firstLineLength > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Title is too long. Press Enter to add content below.
                </p>
              )}
              {extractedDescription && extractedDescription !== extractedTitle && (
                <div className="mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E1E1E]/40">
                    Content
                  </span>
                  <p className="text-xs text-[#1E1E1E]/50 mt-0.5 line-clamp-2 wrap-break-word">
                    {extractedDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main textbox area */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-[#66023C]/10 to-[#e6a83d]/10 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-1000" />
        <div
          className={`relative bg-white/50 border rounded-2xl shadow-2xl backdrop-blur-sm transition-colors ${
            isDragging
              ? "border-[#66023C] bg-[#66023C]/5"
              : "border-[#1E1E1E]/5"
          }`}
        >
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Window dots header */}
            <div className="flex items-center justify-between border-b border-[#1E1E1E]/5 px-4 md:px-8 py-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                <div className="w-3 h-3 rounded-full bg-green-400/20" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#1E1E1E]/30 font-bold">
                New Session
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your messy research notes here, or drag a heavy PDF to simplify..."
                rows={8}
                className="w-full px-4 md:px-8 py-6 bg-transparent border-none focus:ring-0 focus:outline-none text-lg md:text-xl text-[#1E1E1E]/80 placeholder:text-[#1E1E1E]/20 resize-none font-light leading-relaxed"
                disabled={uploadState !== "idle"}
                style={{ minHeight: "200px", maxHeight: "500px" }}
              />
              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#66023C]/5 rounded-b-2xl pointer-events-none">
                  <div className="text-center">
                    <svg
                      className="w-10 h-10 text-[#66023C] mx-auto mb-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-semibold text-[#66023C]">
                      Drop PDF files here
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom action bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8 py-4 border-t border-[#1E1E1E]/5">
              <div className="flex items-center gap-4 text-[#1E1E1E]/40">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={
                    uploadState !== "idle" || files.length >= MAX_PDF_FILES
                  }
                  className="flex items-center gap-2 hover:text-[#66023C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Upload PDF
                  </span>
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

                {/* Word count */}
                {hasContent && (
                  <>
                    <div className="w-px h-4 bg-[#1E1E1E]/10" />
                    <span
                      className={`text-xs font-bold ${
                        isDescriptionValid
                          ? "text-[#1E1E1E]/30"
                          : "text-red-500"
                      }`}
                    >
                      {wordCount.toLocaleString()} /{" "}
                      {STUDY_SET_DESCRIPTION_MAX_WORDS.toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {showCancel && (
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center justify-center rounded-full h-12 px-6 border border-[#1E1E1E]/10 text-[#1E1E1E]/60 text-sm font-bold transition-all hover:bg-[#1E1E1E]/5"
                    disabled={uploadState !== "idle"}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={
                    uploadState !== "idle" ||
                    !extractedTitle.trim() ||
                    !isTitleValid ||
                    !isDescriptionValid
                  }
                  className="w-full md:w-auto flex min-w-[200px] items-center justify-center gap-3 rounded-full h-14 px-8 bg-[#66023C] text-white text-base font-bold transition-all hover:scale-[1.02] shadow-xl shadow-[#66023C]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {uploadState === "idle" ? (
                    <>
                      <span>Begin Focused Study</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
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
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* File chips */}
      {files.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 border border-[#1E1E1E]/5 rounded-full text-xs"
            >
              <svg
                className="w-3.5 h-3.5 text-[#66023C]/60"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-[#1E1E1E] max-w-[120px] truncate font-medium">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={uploadState !== "idle"}
                className="text-[#1E1E1E]/30 hover:text-[#1E1E1E] transition-colors disabled:opacity-50"
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
            <span className="text-xs text-[#1E1E1E]/30">
              (Max {MAX_PDF_FILES})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
