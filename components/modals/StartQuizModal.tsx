"use client";

import { useState } from "react";

interface StartQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (timeLimit?: number) => void;
  quizTitle: string;
  questionCount: number;
}

export default function StartQuizModal({
  isOpen,
  onClose,
  onStart,
  quizTitle,
  questionCount,
}: StartQuizModalProps) {
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | "">("");
  const [useTimeLimit, setUseTimeLimit] = useState(false);

  if (!isOpen) return null;

  const handleStart = () => {
    const timeLimit =
      useTimeLimit &&
      typeof timeLimitMinutes === "number" &&
      timeLimitMinutes > 0
        ? timeLimitMinutes * 60 // Convert minutes to seconds
        : undefined;
    onStart(timeLimit);
  };

  const handleClose = () => {
    setTimeLimitMinutes("");
    setUseTimeLimit(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="glass rounded-2xl p-6 sm:p-8 max-w-md w-full glow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            Start Quiz
          </h2>
          <button
            onClick={handleClose}
            className="p-2 glass rounded-lg text-muted hover:text-text hover:bg-bg-1 transition-all"
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

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text mb-2">
              {quizTitle}
            </h3>
            <p className="text-sm text-muted">
              {questionCount} question{questionCount === 1 ? "" : "s"}
            </p>
          </div>

          {/* Time Limit Option */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useTimeLimit}
                onChange={(e) => setUseTimeLimit(e.target.checked)}
                className="w-5 h-5 rounded border-muted/30 text-primary focus:ring-primary focus:ring-2"
              />
              <span className="text-sm font-semibold text-text">
                Set time limit (optional)
              </span>
            </label>
            {useTimeLimit && (
              <div className="mt-3">
                <label className="block text-xs sm:text-sm font-semibold text-text mb-2">
                  Time limit (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={timeLimitMinutes}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTimeLimitMinutes(
                      value === "" ? "" : parseInt(value, 10)
                    );
                  }}
                  placeholder="Enter minutes"
                  className="w-full px-4 py-2 glass rounded-lg text-text border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted mt-1">
                  Leave empty or enter 0 to disable time limit
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleStart}
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary text-sm"
            >
              Start Quiz
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2.5 glass border border-muted/30 text-text rounded-lg font-semibold hover:bg-bg-1 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
