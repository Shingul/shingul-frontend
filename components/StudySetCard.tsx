import Link from "next/link";
import { StudySet } from "@/lib/mocks/studySets";
import Card from "./ui/Card";

interface StudySetCardProps {
  studySet: StudySet;
}

export default function StudySetCard({ studySet }: StudySetCardProps) {
  const statusColors = {
    draft: "bg-bg-2 text-text-muted border border-border",
    ready: "bg-success-light text-success border border-success/30",
    processing: "bg-accent/15 text-accent border border-accent/30",
  };

  const statusLabels = {
    draft: "Draft",
    ready: "Ready",
    processing: "Processing",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link href={`/study-sets/${studySet.id}`}>
      <Card hover className="h-full">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-heading text-lg text-text line-clamp-2 flex-1 min-w-0">
            {studySet.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${statusColors[studySet.status]}`}
          >
            {statusLabels[studySet.status]}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-text-muted flex-wrap mb-4">
          <span>{studySet.documentCount} docs</span>
          <span>•</span>
          <span>{studySet.flashcardCount} cards</span>
          <span>•</span>
          <span>{studySet.quizCount} quizzes</span>
        </div>
        <div className="text-xs text-text-subtle">
          Updated {formatDate(studySet.updatedAt)}
        </div>
      </Card>
    </Link>
  );
}
