import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

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
          <p className="text-center text-muted-foreground">등록된 연구 분야가 없습니다.</p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {areas.map((area) => (
              <Card key={area.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {area.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
