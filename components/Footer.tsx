import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 md:px-20 py-12 border-t border-[#1E1E1E]/5 mt-24">
    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-3 text-[#66023C]/40">
        <div className="size-5">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-[#1E1E1E]/40 text-sm font-bold tracking-tight">
          &copy; 2024 Shingul
        </span>
      </div>
      <div className="flex gap-8 md:gap-10">
        <Link
          href="#"
          className="text-[#1E1E1E]/40 text-xs font-bold uppercase tracking-widest hover:text-[#66023C] transition-colors"
        >
          Privacy
        </Link>
        <Link
          href="#"
          className="text-[#1E1E1E]/40 text-xs font-bold uppercase tracking-widest hover:text-[#66023C] transition-colors"
        >
          Terms
        </Link>
        <Link
          href="#"
          className="text-[#1E1E1E]/40 text-xs font-bold uppercase tracking-widest hover:text-[#66023C] transition-colors"
        >
          Twitter
        </Link>
        <Link
          href="#"
          className="text-[#1E1E1E]/40 text-xs font-bold uppercase tracking-widest hover:text-[#66023C] transition-colors"
        >
          Contact
        </Link>
      </div>
    </div>
  </footer>
  );
}
