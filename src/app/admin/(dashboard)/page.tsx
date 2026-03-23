import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [postCount, memberCount, pubCount, projectCount, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.member.count(),
      prisma.publication.count(),
      prisma.project.count(),
      prisma.post.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "게시글", count: postCount, href: "/admin/posts" },
    { label: "구성원", count: memberCount, href: "/admin/members" },
    { label: "논문", count: pubCount, href: "/admin/publications" },
    { label: "프로젝트", count: projectCount, href: "/admin/projects" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">최근 게시글</h2>
          {recentPosts.length === 0 ? (
            <p className="text-muted-foreground text-sm">게시글이 없습니다.</p>
          ) : (
            <div className="space-y-1">
              {recentPosts.map((post, i) => (
                <div key={post.id}>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.published ? "공개" : "비공개"} &middot;{" "}
                        {post.updatedAt.toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <Link href={`/admin/posts/${post.id}`} className="text-sm text-primary hover:underline">
                      수정
                    </Link>
                  </div>
                  {i < recentPosts.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
