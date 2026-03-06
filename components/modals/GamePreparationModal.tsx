"use client";

interface GamePreparationModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onClose?: () => void;
}

export default function GamePreparationModal({
  isOpen,
  onContinue,
  onClose,
}: GamePreparationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose ?? (() => {})}
    >
      <div
        className="max-w-[800px] w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-[#66023C]/10 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#F9F2E9] px-6 sm:px-8 py-6 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#66023C]/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#66023C] text-2xl">
                sports_esports
              </span>
            </div>
            <h2 className="text-[#1E1E1E] text-xl font-bold tracking-tight">
              Game Host Control
            </h2>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-[#F9F2E9] transition-colors text-[#1E1E1E]/60 hover:text-[#1E1E1E]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </header>

        <div className="px-6 sm:px-8 py-8 overflow-y-auto flex-1">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#66023C]/5 text-[#66023C] text-xs font-bold uppercase tracking-wider mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#66023C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#66023C]" />
              </span>
              Live Session
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1E1E] mb-4 leading-tight">
              Game Starting Soon
            </h1>
            <p className="text-[#1E1E1E]/60 text-base sm:text-lg max-w-2xl">
              Welcome, Host. Please review the scoring logic and available
              administrative controls before the session goes live.
            </p>
          </div>

          {/* Scoring Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E1E1E]/40 mb-4 flex items-center gap-2">
              Scoring Mechanics
              <div className="h-px flex-1 bg-[#F9F2E9]" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-xl border border-[#F9F2E9] bg-[#F9F2E9]/30 hover:border-[#66023C]/20 transition-all group">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-[#F9F2E9] group-hover:bg-[#66023C] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <h4 className="text-[#1E1E1E] font-bold mb-1">Accuracy</h4>
                  <p className="text-[#1E1E1E]/60 text-sm leading-relaxed">
                    Points awarded for each correct answer validated by the
                    system.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-xl border border-[#F9F2E9] bg-[#F9F2E9]/30 hover:border-[#66023C]/20 transition-all group">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-[#F9F2E9] group-hover:bg-[#66023C] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">avg_pace</span>
                </div>
                <div>
                  <h4 className="text-[#1E1E1E] font-bold mb-1">Speed Bonus</h4>
                  <p className="text-[#1E1E1E]/60 text-sm leading-relaxed">
                    Faster responses earn up to 50 additional bonus points per
                    round.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-xl border border-[#F9F2E9] bg-[#F9F2E9]/30 hover:border-[#66023C]/20 transition-all group">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-[#F9F2E9] group-hover:bg-[#66023C] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">auto_graph</span>
                </div>
                <div>
                  <h4 className="text-[#1E1E1E] font-bold mb-1">Streak</h4>
                  <p className="text-[#1E1E1E]/60 text-sm leading-relaxed">
                    Maintain a consecutive correct answer streak to multiply base
                    scores.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Host Controls Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E1E1E]/40 mb-4 flex items-center gap-2">
              Administrative Access
              <div className="h-px flex-1 bg-[#F9F2E9]" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={onContinue}
                className="flex items-center justify-between p-4 rounded-lg bg-[#1E1E1E] text-white hover:opacity-90 transition-opacity text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#66023C]">
                    play_circle
                  </span>
                  <span className="font-medium">Start Session Now</span>
                </div>
                <span className="material-symbols-outlined text-white/40">
                  chevron_right
                </span>
              </button>
              <div className="flex items-center justify-between p-4 rounded-lg border border-[#F9F2E9] hover:bg-[#F9F2E9]/50 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#1E1E1E]/60">
                    group
                  </span>
                  <span className="font-medium text-[#1E1E1E]">
                    Manage Participants
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#1E1E1E]/20 text-sm">
                  open_in_new
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-[#F9F2E9] hover:bg-[#F9F2E9]/50 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#1E1E1E]/60">
                    settings_suggest
                  </span>
                  <span className="font-medium text-[#1E1E1E]">
                    Game Settings
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#1E1E1E]/20 text-sm">
                  open_in_new
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-[#F9F2E9] text-red-700 cursor-default">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">cancel</span>
                  <span className="font-medium">Terminate Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="bg-[#F9F2E9]/30 px-6 sm:px-8 py-4 border-t border-[#F9F2E9] flex flex-wrap justify-between items-center gap-2 text-[11px] text-[#1E1E1E]/40 font-bold uppercase tracking-widest shrink-0">
          <span>Game Host Control</span>
          <div className="flex gap-4">
            <a
              className="hover:text-[#66023C] transition-colors"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Support
            </a>
            <a
              className="hover:text-[#66023C] transition-colors"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Documentation
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
