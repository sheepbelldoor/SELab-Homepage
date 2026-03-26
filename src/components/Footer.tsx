import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function Footer({ lang }: { lang: Lang }) {
  const d = getDictionary(lang);
  const p = `/${lang}`;

  return (
    <footer className="bg-surface-container-low w-full mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 px-8 py-12 max-w-7xl mx-auto">
        {/* Left: Lab Info */}
        <div className="max-w-md">
          <div className="font-headline font-bold text-on-surface text-xl mb-4">
            {d.footer.labName}
          </div>
          <p className="font-body-text italic text-lg text-on-surface leading-relaxed mb-6">
            {d.footer.quote}
          </p>
          <div className="font-label-text text-sm text-outline">
            &copy; {new Date().getFullYear()} SELab, Hanyang University. All rights reserved.
          </div>
        </div>

        {/* Right: Link Columns */}
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <span className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">
              {d.footer.lab}
            </span>
            <Link href={`${p}/research`} className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              Research
            </Link>
            <Link href={`${p}/people`} className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              People
            </Link>
            <Link href={`${p}/news`} className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              News
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">
              {d.footer.resources}
            </span>
            <Link href={`${p}/publications`} className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              Publications
            </Link>
            <Link href={`${p}/contact`} className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
