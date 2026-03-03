import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div className={`max-w-[1200px] mx-auto px-6 py-8 md:px-8 md:py-12 ${className}`}>
      {children}
    </div>
  );
}

