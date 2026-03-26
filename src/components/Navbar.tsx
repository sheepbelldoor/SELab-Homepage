"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";

const navLinks = [
  { path: "", label: "Home" },
  { path: "/people", label: "People" },
  { path: "/research", label: "Research" },
  { path: "/publications", label: "Publications" },
  { path: "/news", label: "News" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const otherLang = lang === "ko" ? "en" : "ko";
  const langPrefix = `/${lang}`;

  const isActive = (path: string) => {
    const href = `${langPrefix}${path}`;
    if (path === "") return pathname === langPrefix || pathname === `${langPrefix}/`;
    return pathname.startsWith(href);
  };

  function switchLangHref() {
    // Replace /{currentLang}/ with /{otherLang}/ in the current path
    const newPath = pathname.replace(`/${lang}`, `/${otherLang}`);
    return newPath || `/${otherLang}`;
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 glass-nav shadow-sm font-headline tracking-tight">
      <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href={langPrefix} className="text-xl font-bold tracking-tighter text-on-surface">
          Software Engineering Laboratory
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={`${langPrefix}${link.path}`}
              className={cn(
                "text-sm font-semibold transition-all duration-300 ease-in-out hover:opacity-80",
                isActive(link.path)
                  ? "text-tertiary-fixed-dim border-b-2 border-tertiary-fixed-dim pb-1"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {link.label}
            </Link>
          ))}
          {/* Language Switcher */}
          <Link
            href={switchLangHref()}
            onClick={() => {
              document.cookie = `preferred-lang=${otherLang};path=/;max-age=${60 * 60 * 24 * 365}`;
            }}
            className="text-xs font-bold uppercase tracking-widest border border-outline-variant rounded-md px-3 py-1.5 hover:bg-surface-container-high transition-colors"
          >
            {otherLang === "en" ? "EN" : "KO"}
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden p-2 hover:bg-surface-container-high rounded-md transition-colors">
            <span className="material-symbols-outlined text-primary">menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-surface-container-lowest">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={`${langPrefix}${link.path}`}
                  className={cn(
                    "px-4 py-3 rounded-lg font-headline text-sm font-semibold transition-all",
                    isActive(link.path)
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {/* Language Switcher (Mobile) */}
              <Link
                href={switchLangHref()}
                onClick={() => {
                  document.cookie = `preferred-lang=${otherLang};path=/;max-age=${60 * 60 * 24 * 365}`;
                  setOpen(false);
                }}
                className="px-4 py-3 rounded-lg font-headline text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
              >
                {otherLang === "en" ? "English" : "한국어"}
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
