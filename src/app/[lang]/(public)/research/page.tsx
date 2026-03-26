import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { parseLang, t } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export const dynamic = "force-dynamic";

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = parseLang(rawLang);
  const d = getDictionary(lang);

  const areas = await prisma.research.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <PageHeader title={d.research.title} subtitle={d.research.subtitle} overline={d.research.overline} />
      <div className="max-w-7xl mx-auto px-8 pb-16">
        {areas.length === 0 ? (
          <p className="text-center text-on-surface-variant font-headline">{d.research.empty}</p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {areas.map((area) => (
              <div
                key={area.id}
                className="bg-surface-container-low rounded-[6px] p-8 hover:ambient-shadow transition-all duration-300"
              >
                <h3 className="font-headline text-xl font-bold text-primary mb-4">
                  {t(area, "title", lang)}
                </h3>
                <p className="font-body-text text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                  {t(area, "description", lang)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
