import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const areas = await prisma.research.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <PageHeader title="Research" subtitle="연구 분야" overline="Explore" />
      <div className="max-w-7xl mx-auto px-8 pb-16">
        {areas.length === 0 ? (
          <p className="text-center text-on-surface-variant font-headline">등록된 연구 분야가 없습니다.</p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {areas.map((area) => (
              <div
                key={area.id}
                className="bg-surface-container-low rounded-[6px] p-8 hover:ambient-shadow transition-all duration-300"
              >
                <h3 className="font-headline text-xl font-bold text-primary mb-4">
                  {area.title}
                </h3>
                <p className="font-body-text text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
