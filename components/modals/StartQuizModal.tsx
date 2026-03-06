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
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#E5DACE] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-7 py-5 border-b border-[#F2E7D9] bg-[#F9F2E9]/80 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-full bg-[#66023C]/10 flex items-center justify-center text-[#66023C]">
              <span className="material-symbols-outlined text-xl">quiz</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight">
                Start Quiz
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-[#6b5e4c]">
                {questionCount} question{questionCount === 1 ? "" : "s"} •{" "}
                <span className="font-medium">{quizTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/60 border border-[#E5DACE] text-[#6b5e4c] hover:bg-[#F2E7D9] hover:text-[#1E1E1E] transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-7 py-5 sm:py-6 space-y-6 bg-white">
          {/* Time limit toggle */}
          <div className="rounded-xl border border-[#F2E7D9] bg-[#F9F2E9]/60 px-4 sm:px-5 py-4">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <p className="text-sm font-semibold">
                  Optional time limit per quiz
                </p>
                <p className="text-xs text-[#6b5e4c] mt-0.5">
                  Set a gentle timer to keep things moving.
                </p>
              </div>
              <input
                type="checkbox"
                checked={useTimeLimit}
                onChange={(e) => setUseTimeLimit(e.target.checked)}
                className="w-5 h-5 rounded border-[#E5DACE] text-[#66023C] focus:ring-2 focus:ring-[#66023C]"
              />
            </label>

            {useTimeLimit && (
              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-semibold text-[#1E1E1E] mb-2">
                  Time limit (minutes)
                </label>
                <div className="flex items-center gap-2">
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
                    placeholder="e.g. 10"
                    className="w-full px-4 py-2 rounded-lg border border-[#E5DACE] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#66023C]"
                  />
                  <span className="text-xs font-medium text-[#6b5e4c] pr-1">
                    min
                  </span>
                </div>
                <p className="text-[11px] text-[#6b5e4c]/80 mt-2">
                  Leave empty or enter 0 to run without a timer.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleStart}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-full bg-[#66023C] text-[#F9F2E9] text-sm font-bold tracking-[0.18em] uppercase hover:shadow-lg hover:shadow-[#66023C]/25 transition-all"
            >
              Start Quiz
            </button>
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center px-4 py-3 rounded-full border border-[#E5DACE] bg-white text-sm font-semibold text-[#6b5e4c] hover:bg-[#F9F2E9] transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
