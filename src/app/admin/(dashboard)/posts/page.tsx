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

interface Post {
  id: string;
  title: string;
  category: string;
  published: boolean;
  pinned: boolean;
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">게시글 관리</h1>
        <Link href="/admin/posts/new" className={cn(buttonVariants())}>
          새 게시글
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground">게시글이 없습니다.</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead className="w-20">분류</TableHead>
                <TableHead className="w-20">상태</TableHead>
                <TableHead className="w-28">작성일</TableHead>
                <TableHead className="w-24">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link href={`/admin/posts/${post.id}`} className="font-medium hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {post.category === "notice" ? "공지" : "소식"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant={post.published ? "default" : "outline"} className="text-xs">
                        {post.published ? "공개" : "비공개"}
                      </Badge>
                      {post.pinned && (
                        <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50 text-xs">고정</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/posts/${post.id}`} className="text-sm text-primary hover:underline">수정</Link>
                      <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => handleDelete(post.id)}>
                        삭제
                      </Button>
                    </div>
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
