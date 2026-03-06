import Link from "next/link";
import { StudySet } from "@/src/types/api";

interface StudySetCardProps {
  studySet: StudySet;
}

const GRADIENTS = [
  "from-[#66023C]/20 to-[#e6a83d]/10",
  "from-[#66023C]/10 to-[#877a64]/20",
  "from-[#e6a83d]/15 to-[#66023C]/10",
  "from-[#877a64]/15 to-[#66023C]/15",
];

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  ready: "Ready",
  processing: "In Progress",
};

function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function StudySetCard({ studySet }: StudySetCardProps) {
  const gradientIndex =
    studySet.id.charCodeAt(0) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIndex];

  return (
    <Link href={`/study-sets/${studySet.id}`} className="group cursor-pointer">
      {/* Cover area */}
      <div className="relative overflow-hidden rounded-xl mb-6 aspect-16/10">
        <div
          className={`absolute inset-0 bg-linear-to-br ${gradient} transition-transform duration-700 group-hover:scale-105`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-[#66023C]/20 text-8xl">
            auto_stories
          </span>
        </div>
        <div className="absolute inset-0 bg-[#66023C]/5 group-hover:bg-transparent transition-colors" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#66023C]">
            {STATUS_LABELS[studySet.status] || studySet.status}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl md:text-2xl font-semibold line-clamp-1">
          {studySet.title}
        </h3>
        <div className="flex items-center gap-3 text-sm font-medium text-[#1E1E1E]/50 flex-wrap">
          <span>{studySet.documentCount} Docs</span>
          <span className="w-1 h-1 rounded-full bg-[#66023C]/30" />
          <span>{studySet.flashcardCount} Cards</span>
          <span className="w-1 h-1 rounded-full bg-[#66023C]/30" />
          <span className="text-[#66023C]">
            {studySet.quizCount} Quizzes
          </span>
        </div>
        <p className="text-xs text-[#1E1E1E]/40 mt-1 uppercase tracking-wider">
          Last updated {formatRelativeDate(studySet.updatedAt)}
        </p>
      </div>
    </Link>
  );
}
