"use client";

interface DescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
}

export default function DescriptionModal({
  isOpen,
  onClose,
  description,
}: DescriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto glow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            Description
          </h2>
          <button
            onClick={onClose}
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
        <div className="prose prose-invert max-w-none">
          <p className="text-sm sm:text-base text-text whitespace-pre-wrap leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
