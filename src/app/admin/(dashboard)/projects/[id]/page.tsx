"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";

export default function EditProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((projects: Record<string, unknown>[]) => {
        setProject(projects.find((p) => p.id === params.id) || null);
      });
  }, [params.id]);

  if (!project) return <p className="text-gray-500">로딩 중...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">프로젝트 수정</h1>
      <ProjectForm project={project} isEdit />
    </div>
  );
}
