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

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  featured: boolean;
}

export default function AdminPublicationsPage() {
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/publications")
      .then((r) => r.json())
      .then(setPubs)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/publications/${id}`, { method: "DELETE" });
    setPubs((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">논문 관리</h1>
        <Link href="/admin/publications/new" className={cn(buttonVariants())}>
          새 논문
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : pubs.length === 0 ? (
        <p className="text-muted-foreground">논문이 없습니다.</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>논문</TableHead>
                <TableHead>연도</TableHead>
                <TableHead className="w-16">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pubs.map((pub) => (
                <TableRow key={pub.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/publications/${pub.id}`} className="font-medium hover:text-primary transition-colors">
                          {pub.title}
                        </Link>
                        {pub.featured && (
                          <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50 text-xs">대표</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{pub.venue}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{pub.year}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => handleDelete(pub.id)}>
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
