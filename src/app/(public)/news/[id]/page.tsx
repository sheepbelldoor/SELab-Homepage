import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
    <article className="max-w-3xl mx-auto px-8 pt-32 pb-16">
      {/* Back link */}
      <Link
        href="/news"
        className="font-headline text-sm font-bold text-primary flex items-center gap-1 mb-8 hover:text-on-tertiary-container transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        목록으로
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`px-3 py-1 text-[10px] font-bold font-headline rounded-full uppercase tracking-wider ${
              post.category === "notice"
                ? "bg-[#fce7f3] text-[#9d174d]"
                : "bg-[#e0e7ff] text-[#3730a3]"
            }`}
          >
            {post.category === "notice" ? "Notice" : "News"}
          </span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter text-primary leading-tight mb-4">
          {post.title}
        </h1>
        <time className="font-headline text-xs tracking-widest uppercase text-on-surface-variant">
          {post.createdAt.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="mb-10 rounded-xl overflow-hidden">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="font-body-text text-on-surface text-lg leading-[1.85] whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}
