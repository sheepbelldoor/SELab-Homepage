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
    <div className="sticky top-32">
      <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-outline mb-6">
        Chronology
      </h3>
      <ul className="space-y-4">
        {years.map((year) => (
          <li key={year}>
            <button
              onClick={() => scrollToYear(year)}
              className={`font-headline text-lg transition-colors ${
                activeYear === year
                  ? "text-primary font-bold"
                  : "font-semibold text-outline hover:text-primary"
              }`}
            >
              {year}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
