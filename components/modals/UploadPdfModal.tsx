"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUploadDocuments } from "@/src/queries/documents.mutations";
import { MAX_PDF_FILES } from "@/lib/constants";
import { HiOutlineDocumentText } from "react-icons/hi";

interface UploadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  studySetId: string;
}

export default function UploadPdfModal({
  isOpen,
  onClose,
  studySetId,
}: UploadPdfModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const uploadDocuments = useUploadDocuments();

  if (!isOpen) return null;

  const handleClose = () => {
    if (!uploadDocuments.isPending) {
      setSelectedFiles([]);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    uploadDocuments.mutate(
      {
        studySetId,
        files: selectedFiles,
      },
      {
        onSuccess: () => {
          setSelectedFiles([]);
          onClose();
        },
      }
    );
  };

  const handleClear = () => {
    setSelectedFiles([]);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="glass rounded-2xl p-6 sm:p-8 max-w-2xl w-full glow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            Upload PDFs
          </h2>
          <button
            onClick={handleClose}
            disabled={uploadDocuments.isPending}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Select PDF Files (Max {MAX_PDF_FILES} files)
            </label>
            <div className="glass rounded-lg p-6 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2 flex justify-center"><HiOutlineDocumentText className="w-10 h-10 sm:w-12 sm:h-12 text-primary" /></div>
                <label className="inline-block cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > MAX_PDF_FILES) {
                        alert(
                          `You can only upload up to ${MAX_PDF_FILES} files at once.`
                        );
                        return;
                      }
                      setSelectedFiles(files);
                    }}
                    className="hidden"
                    disabled={uploadDocuments.isPending}
                  />
                  <span className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium cursor-pointer inline-block">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} selected`
                      : "Choose PDF Files"}
                  </span>
                </label>
                <p className="text-xs text-muted mt-2">
                  {selectedFiles.length > 0
                    ? selectedFiles.map((f) => f.name).join(", ")
                    : "No files selected"}
                </p>
              </div>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploadDocuments.isPending}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {uploadDocuments.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Uploading...
                  </span>
                ) : (
                  `Upload ${selectedFiles.length} File${selectedFiles.length === 1 ? "" : "s"}`
                )}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={uploadDocuments.isPending}
                className="px-4 py-2.5 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
