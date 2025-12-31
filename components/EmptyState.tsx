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
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
      {icon === "mascot" && (
        <div className="mb-4 sm:mb-6 relative w-24 h-24 sm:w-32 sm:h-32">
          <Image
            src="/mascot.png"
            alt="Shingul mascot"
            width={128}
            height={128}
            className="drop-shadow-lg"
          />
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-bold text-text mb-2 px-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-muted mb-4 sm:mb-6 max-w-md px-2">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary text-sm sm:text-base"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

