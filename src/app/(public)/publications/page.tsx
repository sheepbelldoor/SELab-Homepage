import PageHeader from "@/components/PageHeader";
import SafeLink from "@/components/SafeLink";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {years.length === 0 ? (
          <p className="text-center text-muted-foreground">등록된 논문이 없습니다.</p>
        ) : (
          years.map((year) => (
            <div key={year} className="mb-12">
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
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {pub.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{pub.authors}</p>
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
    </>
  );
}
