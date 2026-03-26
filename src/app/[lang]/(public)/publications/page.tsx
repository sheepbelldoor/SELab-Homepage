import SafeLink from "@/components/SafeLink";
import YearNav from "@/components/YearNav";
import { prisma } from "@/lib/prisma";
import { parseLang } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export const dynamic = "force-dynamic";

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

const TAG_COLORS = [
  "bg-[#e0e7ff] text-[#3730a3]",
  "bg-[#d1fae5] text-[#065f46]",
  "bg-[#fce7f3] text-[#9d174d]",
  "bg-[#fef3c7] text-[#92400e]",
  "bg-[#e0f2fe] text-[#075985]",
  "bg-[#f3e8ff] text-[#6b21a8]",
  "bg-[#ffedd5] text-[#9a3412]",
  "bg-[#ccfbf1] text-[#134e4a]",
];

function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

function buildAliasIndex(members: { id: string; authorAliases: string }[]) {
  const entries: { alias: string; memberId: string }[] = [];
  for (const m of members) {
    let aliases: string[] = [];
    try { aliases = JSON.parse(m.authorAliases); } catch { /* ignore */ }
    for (const a of aliases) {
      if (a.trim()) entries.push({ alias: a.trim(), memberId: m.id });
    }
  }
  entries.sort((a, b) => b.alias.length - a.alias.length);
  return entries;
}

function highlightAuthors(authors: string, aliasIndex: { alias: string; memberId: string }[]) {
  if (aliasIndex.length === 0) return [authors];

  const matches: { start: number; end: number; memberId: string }[] = [];
  const authorsLower = authors.toLowerCase();

  for (const { alias, memberId } of aliasIndex) {
    const aliasLower = alias.toLowerCase();
    let searchFrom = 0;
    while (searchFrom < authorsLower.length) {
      const idx = authorsLower.indexOf(aliasLower, searchFrom);
      if (idx === -1) break;
      const end = idx + alias.length;
      const overlaps = matches.some((m) => idx < m.end && end > m.start);
      if (!overlaps) {
        matches.push({ start: idx, end, memberId });
      }
      searchFrom = idx + 1;
    }
  }

  if (matches.length === 0) return [authors];
  matches.sort((a, b) => a.start - b.start);

  const result: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      result.push(authors.slice(cursor, match.start));
    }
    result.push(
      <span key={`${match.start}-${match.memberId}`} className="font-bold text-on-surface">
        {authors.slice(match.start, match.end)}
      </span>
    );
    cursor = match.end;
  }

  if (cursor < authors.length) {
    result.push(authors.slice(cursor));
  }

  return result;
}

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = parseLang(rawLang);
  const d = getDictionary(lang);

  const [publications, members] = await Promise.all([
    prisma.publication.findMany({
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    }),
    prisma.member.findMany({
      select: { id: true, authorAliases: true },
    }),
  ]);

  const aliasIndex = buildAliasIndex(members);

  const grouped = publications.reduce<Record<number, typeof publications>>(
    (acc, pub) => {
      (acc[pub.year] ||= []).push(pub);
      return acc;
    },
    {}
  );

  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="pt-24 min-h-screen">
      {/* Editorial Header */}
      <header className="max-w-7xl mx-auto px-8 pt-8 pb-12 mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-outline-variant pb-12">
          <div className="max-w-2xl">
            <span className="font-headline text-tertiary-container font-bold tracking-widest uppercase text-xs mb-4 block">
              {d.publications.overline}
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary tracking-tighter leading-tight mb-6">
              {d.publications.title}{" "}
              <span className="text-on-tertiary-container italic font-body-text font-light">
                {d.publications.titleAccent}
              </span>
            </h1>
            <p className="font-body-text text-xl text-on-surface-variant leading-relaxed italic">
              {d.publications.subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sticky Year Sidebar */}
        <aside className="lg:col-span-2 hidden lg:block">
          <YearNav years={years} />
        </aside>

        {/* Main Listing */}
        <section className="lg:col-span-10 space-y-24">
          {years.length === 0 ? (
            <p className="text-center text-on-surface-variant py-16 font-headline">
              {d.publications.empty}
            </p>
          ) : (
            years.map((year) => (
              <div key={year} data-year={year} className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="font-headline text-4xl font-extrabold text-primary">{year}</h2>
                  <div className="h-px flex-grow bg-outline-variant opacity-30" />
                  <span className="font-headline text-xs font-bold text-outline uppercase tracking-widest">
                    {grouped[year].length} Publication{grouped[year].length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-12">
                  {grouped[year].map((pub) => (
                    <article
                      key={pub.id}
                      className="group relative p-8 border-l-4 border-secondary-fixed transition-all duration-300"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2">
                          {parseTags(pub.tags).map((tag, i) => (
                            <span key={i} className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full font-headline ${getTagColor(tag)}`}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="font-body-text text-2xl font-semibold text-primary mb-1 leading-snug">
                          {pub.url ? (
                            <SafeLink
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-on-tertiary-container transition-colors"
                            >
                              {pub.title}
                            </SafeLink>
                          ) : (
                            <span>{pub.title}</span>
                          )}
                        </h3>

                        <p className="font-headline text-sm text-on-surface-variant">
                          {highlightAuthors(pub.authors, aliasIndex)}
                        </p>

                        <p className="font-body-text italic text-on-surface-variant">
                          {pub.venue}
                        </p>

                        <div className="flex flex-wrap gap-6 items-center">
                          {pub.pdfUrl && (
                            <SafeLink href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-transparent hover:border-tertiary-fixed transition-all">
                              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                              PDF
                            </SafeLink>
                          )}
                          {pub.doiUrl && (
                            <SafeLink href={pub.doiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-transparent hover:border-tertiary-fixed transition-all">
                              <span className="material-symbols-outlined text-lg">format_quote</span>
                              DOI
                            </SafeLink>
                          )}
                          {pub.codeUrl && (
                            <SafeLink href={pub.codeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-transparent hover:border-tertiary-fixed transition-all">
                              <span className="material-symbols-outlined text-lg">terminal</span>
                              Code
                            </SafeLink>
                          )}
                          {pub.videoUrl && (
                            <SafeLink href={pub.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-transparent hover:border-tertiary-fixed transition-all">
                              <span className="material-symbols-outlined text-lg">play_circle</span>
                              Video
                            </SafeLink>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
