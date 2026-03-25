import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 px-8 py-12 max-w-7xl mx-auto">
        {/* Left: Lab Info */}
        <div className="max-w-md">
          <div className="font-headline font-bold text-on-surface text-xl mb-4">
            Software Engineering Laboratory
          </div>
          <p className="font-body-text italic text-lg text-on-surface leading-relaxed mb-6">
            &ldquo;Building reliable software through rigorous engineering and innovative research.&rdquo;
          </p>
          <div className="font-label-text text-sm text-outline">
            &copy; {new Date().getFullYear()} SELab, Hanyang University. All rights reserved.
          </div>
        </div>

        {/* Right: Link Columns */}
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <span className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">
              Lab
            </span>
            <Link href="/research" className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              Research
            </Link>
            <Link href="/people" className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              People
            </Link>
            <Link href="/news" className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              News
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">
              Resources
            </span>
            <Link href="/publications" className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              Publications
            </Link>
            <Link href="/contact" className="font-label-text text-outline hover:text-tertiary-fixed-dim transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
