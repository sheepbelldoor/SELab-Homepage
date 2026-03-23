"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Project {
  id: string;
  title: string;
  status: string;
  featured: boolean;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">프로젝트 관리</h1>
        <Link href="/admin/projects/new" className={cn(buttonVariants())}>
          새 프로젝트
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : projects.length === 0 ? (
        <p className="text-muted-foreground">프로젝트가 없습니다.</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>프로젝트명</TableHead>
                <TableHead className="w-16">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/projects/${project.id}`} className="font-medium hover:text-primary transition-colors">
                        {project.title}
                      </Link>
                      <Badge variant={project.status === "ongoing" ? "default" : "secondary"} className="text-xs">
                        {project.status === "ongoing" ? "진행중" : "완료"}
                      </Badge>
                      {project.featured && (
                        <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50 text-xs">대표</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => handleDelete(project.id)}>
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
