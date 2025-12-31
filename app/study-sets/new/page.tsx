"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

type UploadState = "idle" | "uploading" | "processing" | "error";

export default function CreateStudySetPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploadState("uploading");
    setUploadProgress(0);
    setError(null);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearInterval(progressInterval);
    setUploadProgress(100);
    setUploadState("processing");

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success - redirect to new study set
    const newId = Date.now().toString();
    router.push(`/study-sets/${newId}`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-text mb-8">
            Create New Study Set
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-text mb-2"
              >
                Study Set Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Astronomy"
                className="w-full px-4 py-3 glass rounded-xl text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={uploadState !== "idle"}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Upload PDFs
              </label>
              <div className="glass rounded-2xl p-12 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-text font-semibold mb-2">
                    Drag & drop PDF files here
                  </p>
                  <p className="text-muted text-sm mb-4">or</p>
                  <button
                    type="button"
                    className="px-6 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                    disabled={uploadState !== "idle"}
                  >
                    Upload multiple PDFs
                  </button>
                </div>
              </div>
            </div>

            {uploadState === "uploading" && (
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-4 mb-2">
                  <LoadingSpinner />
                  <span className="text-text">Uploading...</span>
                </div>
                <div className="w-full bg-bg-1 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-primary to-primary2 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted mt-2">{uploadProgress}%</p>
              </div>
            )}

            {uploadState === "processing" && (
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <LoadingSpinner />
                  <div>
                    <p className="text-text font-semibold">Processing...</p>
                    <p className="text-sm text-muted">
                      Extracting text and generating content
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="glass rounded-xl p-4 bg-red-500/20 border border-red-500/50">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploadState !== "idle" || !title.trim()}
                className="px-8 py-4 bg-linear-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create & Generate Flashcards
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 glass border border-muted/30 text-text rounded-xl font-semibold hover:bg-bg-1 transition-colors"
                disabled={uploadState !== "idle"}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
