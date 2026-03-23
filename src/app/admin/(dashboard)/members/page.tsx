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

interface Member {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  email?: string;
}

const roleLabels: Record<string, string> = {
  professor: "교수",
  postdoc: "박사후연구원",
  msphd: "석박통합과정",
  phd: "박사과정",
  ms: "석사과정",
  intern: "학부생/인턴",
  alumni: "졸업생",
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">구성원 관리</h1>
        <Link href="/admin/members/new" className={cn(buttonVariants())}>
          새 구성원
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : members.length === 0 ? (
        <p className="text-muted-foreground">구성원이 없습니다.</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead className="w-16">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/members/${member.id}`} className="font-medium hover:text-primary transition-colors">
                        {member.name}
                        {member.nameEn && <span className="text-muted-foreground ml-1 text-sm font-normal">({member.nameEn})</span>}
                      </Link>
                      <Badge variant="secondary" className="text-xs">
                        {roleLabels[member.role] || member.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.email || "-"}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => handleDelete(member.id)}>
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
