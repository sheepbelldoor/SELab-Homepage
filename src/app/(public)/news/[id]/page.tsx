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
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/news"
        className="text-primary hover:underline text-sm mb-8 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-semibold rounded ${
              post.category === "notice"
                ? "bg-orange-100 text-orange-700"
                : "bg-blue-100 text-primary"
            }`}
          >
            {post.category === "notice" ? "Notice" : "News"}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {post.title}
        </h1>
        <time className="text-sm text-gray-400">
          {post.createdAt.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="mb-10 rounded-xl overflow-hidden border border-gray-200">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Divider */}
      <hr className="border-gray-200 mb-10" />

      {/* Body */}
      <div className="text-gray-700 text-[1.05rem] leading-[1.85] whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}
