import { ReactNode } from "react";
import Button from "./Button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  actionOnClick,
  className = "",
}: EmptyStateProps) {
  const action = actionHref ? (
    <Link href={actionHref}>
      <Button>{actionLabel}</Button>
    </Link>
  ) : actionOnClick ? (
    <Button onClick={actionOnClick}>{actionLabel}</Button>
  ) : null;

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 md:py-24 text-center ${className}`}
    >
      {icon && <div className="mb-6 text-6xl">{icon}</div>}
      <h3 className="text-heading text-xl md:text-2xl text-text mb-3">
        {title}
      </h3>
      <p className="text-body text-base text-text-muted max-w-md mb-8">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

