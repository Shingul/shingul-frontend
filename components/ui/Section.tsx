import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function Section({
  children,
  title,
  description,
  className = "",
}: SectionProps) {
  return (
    <section className={`mb-8 md:mb-12 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-heading text-xl md:text-2xl text-text mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-body text-sm text-text-muted">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

