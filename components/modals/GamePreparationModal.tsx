"use client";
import { FaExclamationTriangle, FaGamepad } from "react-icons/fa";

interface GamePreparationModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export default function GamePreparationModal({
  isOpen,
  onContinue,
}: GamePreparationModalProps) {

  if (!isOpen) return null;



  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="glass rounded-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto glow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6 flex flex-col items-center justify-center">
          <div className="text-5xl sm:text-6xl mb-4"><FaGamepad /></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            Game Starting Soon!
          </h2>
          <p className="text-sm sm:text-base text-text-muted">
            Here&apos;s what you need to know as the host
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Scoring Section */}
          <div className="glass rounded-xl p-4 sm:p-5 border border-primary/20">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text mb-2">How Scoring Works</h3>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <span>Players earn points for each correct answer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <span>Points are awarded based on speed - faster answers get more points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <span>The leaderboard updates after each question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <span>Players can see their rank and score on the leaderboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Host Controls Section */}
          <div className="glass rounded-xl p-4 sm:p-5 border border-accent/20">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text mb-2">Host Controls</h3>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-accent shrink-0">•</span>
                    <span>You&apos;ll see the full question and all answer options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent shrink-0">•</span>
                    <span>Monitor the live leaderboard to see player progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent shrink-0">•</span>
                    <span>Questions advance automatically when time expires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent shrink-0">•</span>
                    <span>Keep an eye on the timer for each question</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Safety Tips Section */}
          {/* <div className="glass rounded-xl p-4 sm:p-5 border border-warning/20">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                <FaExclamationTriangle className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text mb-2">Safety Tips</h3>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-warning shrink-0">•</span>
                    <span>Ensure all participants are ready before starting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning shrink-0">•</span>
                    <span>Make sure players have a stable internet connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning shrink-0">•</span>
                    <span>Keep the game code visible for late joiners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning shrink-0">•</span>
                    <span>Be ready to answer any questions from participants</span>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary flex items-center justify-center gap-2"
          >
            <span>Continue to Game</span>
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

