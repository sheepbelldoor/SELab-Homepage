"use client";

import { useEffect, useState } from "react";

export default function YearNav({ years }: { years: number[] }) {
  const [activeYear, setActiveYear] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const year = Number(entry.target.getAttribute("data-year"));
            if (year) setActiveYear(year);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll("[data-year]");
    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [years]);

  function scrollToYear(year: number) {
    const el = document.querySelector(`[data-year="${year}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="hidden lg:block sticky top-24 self-start">
      <ul className="space-y-1 border-l-2 border-border pl-3">
        {years.map((year) => (
          <li key={year}>
            <button
              onClick={() => scrollToYear(year)}
              className={`block text-sm py-0.5 px-2 rounded transition-colors ${
                activeYear === year
                  ? "text-primary font-semibold bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {year}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
