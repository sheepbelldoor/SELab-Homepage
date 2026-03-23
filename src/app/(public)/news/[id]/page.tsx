import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || !post.published) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/news"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-8 inline-flex items-center gap-1")}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={post.category === "notice" ? "destructive" : "secondary"}>
            {post.category === "notice" ? "Notice" : "News"}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {post.title}
        </h1>
        <time className="text-sm text-muted-foreground">
          {post.createdAt.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      {post.thumbnail && (
        <div className="mb-10 rounded-xl overflow-hidden border">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      <Separator className="mb-10" />

      <div className="text-foreground/80 text-[1.05rem] leading-[1.85] whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}
