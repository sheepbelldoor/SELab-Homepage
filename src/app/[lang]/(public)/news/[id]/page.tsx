import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseLang, t } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang: rawLang, id } = await params;
  const lang = parseLang(rawLang);
  const d = getDictionary(lang);
  const p = `/${lang}`;
  const dateLang = lang === "en" ? "en-US" : "ko-KR";

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || !post.published) notFound();

  return (
    <article className="max-w-3xl mx-auto px-8 pt-32 pb-16">
      {/* Back link */}
      <Link
        href={`${p}/news`}
        className="font-headline text-sm font-bold text-primary flex items-center gap-1 mb-8 hover:text-on-tertiary-container transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        {d.news.backToList}
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
            {post.category === "notice" ? d.news.notice : d.news.newsLabel}
          </span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter text-primary leading-tight mb-4">
          {t(post, "title", lang)}
        </h1>
        <time className="font-headline text-xs tracking-widest uppercase text-on-surface-variant">
          {post.createdAt.toLocaleDateString(dateLang, {
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
            alt={t(post, "title", lang)}
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="font-body-text text-on-surface text-lg leading-[1.85] whitespace-pre-wrap">
        {t(post, "content", lang)}
      </div>
    </article>
  );
}
