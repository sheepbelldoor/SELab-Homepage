import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <PageHeader title="News & Notice" subtitle="소식 및 공지사항" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">등록된 게시글이 없습니다.</p>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 text-center">분류</TableHead>
                  <TableHead className="text-center">제목</TableHead>
                  <TableHead className="w-28 text-center">작성일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="text-center">
                      <Badge variant={post.category === "notice" ? "destructive" : "secondary"}>
                        {post.category === "notice" ? "Notice" : "News"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/news/${post.id}`}
                        className="font-medium hover:text-primary transition-colors inline-flex items-center gap-2"
                      >
                        {post.pinned && (
                          <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50 text-xs">고정</Badge>
                        )}
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground whitespace-nowrap">
                      {post.createdAt.toLocaleDateString("ko-KR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </>
  );
}
