interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = "", lines = 1 }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 glass rounded-lg animate-pulse"
            style={{
              width: i === lines - 1 ? "75%" : "100%",
              animationDuration: "2s",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`glass rounded-lg animate-pulse ${className}`}
      style={{ animationDuration: "2s" }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

