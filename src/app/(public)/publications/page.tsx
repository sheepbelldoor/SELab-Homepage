import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  // Group by year
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
          <p className="text-center text-gray-500">등록된 논문이 없습니다.</p>
        ) : (
          years.map((year) => (
            <div key={year} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
                {year}
              </h2>
              <div className="space-y-6">
                {grouped[year].map((pub) => (
                  <div key={pub.id} className="group">
                    {pub.featured && (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-800 mb-1">
                        Featured
                      </span>
                    )}
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {pub.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{pub.authors}</p>
                    <p className="text-gray-500 text-sm italic">{pub.venue}</p>
                    <div className="flex gap-3 mt-2">
                      {pub.pdfUrl && (
                        <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                          PDF
                        </a>
                      )}
                      {pub.doiUrl && (
                        <a href={pub.doiUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                          DOI
                        </a>
                      )}
                      {pub.codeUrl && (
                        <a href={pub.codeUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                          Code
                        </a>
                      )}
                      {pub.videoUrl && (
                        <a href={pub.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                          Video
                        </a>
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
