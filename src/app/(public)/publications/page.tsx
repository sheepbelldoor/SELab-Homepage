import PageHeader from "@/components/PageHeader";
import SafeLink from "@/components/SafeLink";
import YearNav from "@/components/YearNav";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

/** Build a list of { alias, memberId } sorted by alias length descending (greedy match). */
function buildAliasIndex(members: { id: string; authorAliases: string }[]) {
  const entries: { alias: string; memberId: string }[] = [];
  for (const m of members) {
    let aliases: string[] = [];
    try { aliases = JSON.parse(m.authorAliases); } catch { /* ignore */ }
    for (const a of aliases) {
      if (a.trim()) entries.push({ alias: a.trim(), memberId: m.id });
    }
  }
  // Longer aliases first for greedy matching
  entries.sort((a, b) => b.alias.length - a.alias.length);
  return entries;
}

/**
 * Highlight lab member names in an authors string.
 * Returns an array of React nodes (plain strings + <strong> elements).
 * Uses greedy first-match: once a position is matched by a longer alias, shorter aliases skip it.
 */
function highlightAuthors(authors: string, aliasIndex: { alias: string; memberId: string }[]) {
  if (aliasIndex.length === 0) return [authors];

  // Find all matches with their positions
  const matches: { start: number; end: number; memberId: string }[] = [];
  const authorsLower = authors.toLowerCase();

  for (const { alias, memberId } of aliasIndex) {
    const aliasLower = alias.toLowerCase();
    let searchFrom = 0;
    while (searchFrom < authorsLower.length) {
      const idx = authorsLower.indexOf(aliasLower, searchFrom);
      if (idx === -1) break;
      const end = idx + alias.length;
      // Check if this range overlaps with any existing match
      const overlaps = matches.some((m) => idx < m.end && end > m.start);
      if (!overlaps) {
        matches.push({ start: idx, end, memberId });
      }
      searchFrom = idx + 1;
    }
  }

  if (matches.length === 0) return [authors];

  // Sort by start position
  matches.sort((a, b) => a.start - b.start);

  const result: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      result.push(authors.slice(cursor, match.start));
    }
    result.push(
      <strong key={`${match.start}-${match.memberId}`} className="text-foreground font-semibold">
        {authors.slice(match.start, match.end)}
      </strong>
    );
    cursor = match.end;
  }

  if (cursor < authors.length) {
    result.push(authors.slice(cursor));
  }

  return result;
}

export default async function PublicationsPage() {
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
    <>
      <PageHeader title="Publications" subtitle="논문 목록" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-8 items-start">
          {/* Sticky side navigation — lives inside the flex container so it cannot escape into header/footer */}
          <YearNav years={years} />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {years.length === 0 ? (
              <p className="text-center text-muted-foreground">등록된 논문이 없습니다.</p>
            ) : (
              years.map((year) => (
                <div key={year} data-year={year} className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-2">{year}</h2>
                  <Separator className="mb-6" />
                  <div className="space-y-6">
                    {grouped[year].map((pub) => (
                      <div key={pub.id} className="group">
                        {pub.featured && (
                          <Badge variant="outline" className="mb-1 border-yellow-300 text-yellow-700 bg-yellow-50">
                            Featured
                          </Badge>
                        )}
                        <h3 className="font-semibold text-lg leading-snug">
                          {pub.url ? (
                            <SafeLink
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors"
                            >
                              {pub.title}
                            </SafeLink>
                          ) : (
                            <span>{pub.title}</span>
                          )}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {highlightAuthors(pub.authors, aliasIndex)}
                        </p>
                        <p className="text-muted-foreground/70 text-sm italic">{pub.venue}</p>
                        <div className="flex gap-3 mt-2">
                          {pub.pdfUrl && (
                            <SafeLink href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                              PDF
                            </SafeLink>
                          )}
                          {pub.doiUrl && (
                            <SafeLink href={pub.doiUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                              DOI
                            </SafeLink>
                          )}
                          {pub.codeUrl && (
                            <SafeLink href={pub.codeUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                              Code
                            </SafeLink>
                          )}
                          {pub.videoUrl && (
                            <SafeLink href={pub.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                              Video
                            </SafeLink>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
