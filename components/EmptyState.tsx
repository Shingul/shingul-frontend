import Image from "next/image";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: "mascot" | "document";
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon = "mascot",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon === "mascot" && (
        <div className="mb-6 relative w-32 h-32">
          <Image
            src="/mascot.png"
            alt="Shingul mascot"
            width={128}
            height={128}
            className="drop-shadow-lg"
          />
        </div>
      )}
      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
      <p className="text-muted mb-6 max-w-md">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

