import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const ongoing = projects.filter((p) => p.status === "ongoing");
  const completed = projects.filter((p) => p.status === "completed");

  const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {project.featured && (
        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-800 mb-2">
          Featured
        </span>
      )}
      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
        {project.description}
      </p>
      {project.participants && (
        <p className="text-sm text-gray-500">
          <span className="font-medium">Participants:</span> {project.participants}
        </p>
      )}
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm text-primary font-medium hover:underline"
        >
          View Demo &rarr;
        </a>
      )}
    </div>
  );

  return (
    <>
      <PageHeader title="Projects" subtitle="연구 프로젝트" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">등록된 프로젝트가 없습니다.</p>
        ) : (
          <>
            {ongoing.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-8 pb-3 border-b border-gray-200">
                  Ongoing Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ongoing.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            )}
            {completed.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-8 pb-3 border-b border-gray-200">
                  Completed Projects
                </h2>
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
