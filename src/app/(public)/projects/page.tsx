import PageHeader from "@/components/PageHeader";
import SafeLink from "@/components/SafeLink";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const ongoing = projects.filter((p) => p.status === "ongoing");
  const completed = projects.filter((p) => p.status === "completed");

  const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        {project.featured && (
          <Badge variant="outline" className="mb-2 border-yellow-300 text-yellow-700 bg-yellow-50">
            Featured
          </Badge>
        )}
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3 whitespace-pre-wrap">
          {project.description}
        </p>
        {project.participants && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Participants:</span> {project.participants}
          </p>
        )}
        {project.demoUrl && (
          <SafeLink
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-primary font-medium hover:underline"
          >
            View Demo &rarr;
          </SafeLink>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <PageHeader title="Projects" subtitle="연구 프로젝트" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground">등록된 프로젝트가 없습니다.</p>
        ) : (
          <>
            {ongoing.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-2">Ongoing Projects</h2>
                <Separator className="mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ongoing.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            )}
            {completed.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Completed Projects</h2>
                <Separator className="mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completed.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
