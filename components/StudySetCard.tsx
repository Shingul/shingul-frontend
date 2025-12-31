import Link from "next/link";
import { StudySet } from "@/lib/mocks/studySets";

interface StudySetCardProps {
  studySet: StudySet;
}

export default function StudySetCard({ studySet }: StudySetCardProps) {
  const statusColors = {
    draft: "bg-gray-500/20 text-gray-300",
    ready: "bg-primary2/20 text-primary2",
    processing: "bg-accent/20 text-accent",
  };

  const statusLabels = {
    draft: "Draft",
    ready: "Ready",
    processing: "Processing",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/study-sets/${studySet.id}`}>
      <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-[1.02] transition-transform cursor-pointer glow-primary/50 hover:glow-primary">
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold text-text line-clamp-2 flex-1 min-w-0">
            {studySet.title}
          </h3>
          <span
            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusColors[studySet.status]}`}
          >
            {statusLabels[studySet.status]}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted flex-wrap">
          <span>{studySet.documentCount} docs</span>
          <span className="hidden sm:inline">•</span>
          <span>{studySet.flashcardCount} cards</span>
          <span className="hidden sm:inline">•</span>
          <span>{studySet.quizCount} quizzes</span>
        </div>
        <div className="mt-3 sm:mt-4 text-xs text-muted">
          Updated {formatDate(studySet.updatedAt)}
        </div>
      </div>
    </Link>
  );
}

