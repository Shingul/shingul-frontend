import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  className = "",
}: StatCardProps) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm font-medium text-text-muted">{label}</div>
        {icon && <div className="text-text-muted">{icon}</div>}
      </div>
      <div className="text-2xl md:text-3xl font-semibold text-text">
        {value}
      </div>
      {trend && (
        <div
          className={`mt-2 text-xs font-medium ${
            trend === "up"
              ? "text-success"
              : trend === "down"
                ? "text-error"
                : "text-text-muted"
          }`}
        >
          {trend === "up" && "↑"}
          {trend === "down" && "↓"}
          {trend === "neutral" && "→"}
        </div>
      )}
    </div>
  );
}

