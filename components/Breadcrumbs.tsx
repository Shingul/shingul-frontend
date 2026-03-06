import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-xs font-medium text-[#1E1E1E]/40 mb-6 overflow-x-auto"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2 whitespace-nowrap">
          {i > 0 && (
            <span className="text-[#1E1E1E]/20 select-none">/</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[#66023C] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1E1E1E]/70">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
