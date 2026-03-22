import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const areas = await prisma.research.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <PageHeader title="Research" subtitle="연구 분야" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {areas.length === 0 ? (
          <p className="text-center text-gray-500">등록된 연구 분야가 없습니다.</p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {areas.map((area) => (
              <div
                key={area.id}
                className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-primary mb-4">
                  {area.title}
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
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
