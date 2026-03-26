import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseLang, t } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 8;

const categoryColors: Record<string, string> = {
  notice: "bg-[#fce7f3] text-[#9d174d]",
  news: "bg-[#e0e7ff] text-[#3730a3]",
};

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = parseLang(rawLang);
  const d = getDictionary(lang);
  const p = `/${lang}`;
  const dateLang = lang === "en" ? "en-US" : "ko-KR";

  const { category, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const pinnedPost = await prisma.post.findFirst({
    where: { published: true, pinned: true },
    orderBy: { createdAt: "desc" },
  });

  const where = {
    published: true,
    ...(category && category !== "all" ? { category } : {}),
  };

  const totalCount = await prisma.post.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));

  const posts = await prisma.post.findMany({
    where,
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    skip: (currentPage - 1) * POSTS_PER_PAGE,
    take: POSTS_PER_PAGE,
  });

  const allCount = await prisma.post.count({ where: { published: true } });
  const noticeCount = await prisma.post.count({ where: { published: true, category: "notice" } });
  const newsCount = await prisma.post.count({ where: { published: true, category: "news" } });

  const allPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  const yearMap = new Map<number, Set<number>>();
  allPosts.forEach((post) => {
    const y = post.createdAt.getFullYear();
    const m = post.createdAt.getMonth();
    if (!yearMap.has(y)) yearMap.set(y, new Set());
    yearMap.get(y)!.add(m);
  });
  const years = Array.from(yearMap.keys()).sort((a, b) => b - a);

  const activeCategory = category || "all";

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Section: Pinned Post */}
      {pinnedPost && (
        <section className="max-w-7xl mx-auto px-8 mb-20">
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden group">
            {pinnedPost.thumbnail ? (
              <img
                src={pinnedPost.thumbnail}
                alt={t(pinnedPost, "title", lang)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent flex flex-col justify-center px-12 text-on-primary">
              <span className="font-headline text-xs font-bold tracking-[0.2em] uppercase mb-4 text-tertiary-fixed">
                {d.news.latestAnnouncement}
              </span>
              <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter max-w-2xl mb-6">
                {t(pinnedPost, "title", lang)}
              </h1>
              {pinnedPost.content && (
                <p className="font-body-text text-xl max-w-xl mb-8 leading-relaxed opacity-90">
                  {t(pinnedPost, "content", lang).substring(0, 150)}
                  {t(pinnedPost, "content", lang).length > 150 ? "..." : ""}
                </p>
              )}
              <div className="flex items-center gap-4">
                <Link
                  href={`${p}/news/${pinnedPost.id}`}
                  className="bg-tertiary-fixed text-on-tertiary-fixed px-8 py-3 rounded-md font-headline font-bold text-sm flex items-center gap-2 transition-all hover:opacity-90 active:scale-95"
                >
                  {d.news.readMore}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <span className="font-headline text-sm opacity-75">
                  {pinnedPost.createdAt.toLocaleDateString(dateLang)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-12">
          <div className="space-y-6">
            <h3 className="font-headline text-sm font-extrabold uppercase tracking-widest text-primary">
              {d.news.categories}
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {[
                { key: "all", label: d.news.allUpdates, count: allCount },
                { key: "notice", label: d.news.notice, count: noticeCount },
                { key: "news", label: d.news.newsLabel, count: newsCount },
              ].map((cat) => (
                <Link
                  key={cat.key}
                  href={cat.key === "all" ? `${p}/news` : `${p}/news?category=${cat.key}`}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg font-headline text-sm font-semibold transition-all ${
                    activeCategory === cat.key
                      ? "bg-primary text-on-primary"
                      : "hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {cat.label} <span>{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-headline text-sm font-extrabold uppercase tracking-widest text-primary">
              {d.news.archive}
            </h3>
            <div className="space-y-2">
              {years.map((year, idx) => (
                <details key={year} className="group" open={idx === 0}>
                  <summary className="flex items-center justify-between list-none cursor-pointer p-2 hover:bg-surface-container-low rounded font-headline font-bold text-on-surface">
                    {year}
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="pl-4 mt-2 space-y-2">
                    {Array.from(yearMap.get(year)!)
                      .sort((a, b) => b - a)
                      .map((month) => (
                        <span
                          key={month}
                          className="block py-1 text-sm font-headline text-on-surface-variant"
                        >
                          {new Date(year, month).toLocaleDateString(dateLang, { month: "long" })}
                        </span>
                      ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </aside>

        {/* Article List */}
        <div className="lg:col-span-9">
          {posts.length === 0 ? (
            <p className="text-center text-on-surface-variant py-16 font-headline">
              {d.news.empty}
            </p>
          ) : (
            <div className="divide-y divide-surface-container-high">
              {posts.map((post) => (
                <article key={post.id} className="py-8 first:pt-0 group">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                    <div className="md:w-32 flex-shrink-0">
                      <span className="font-headline text-xs font-bold tracking-widest uppercase text-on-surface-variant/60">
                        {post.createdAt.toLocaleDateString(dateLang, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold font-headline rounded uppercase ${
                            categoryColors[post.category] || categoryColors.news
                          }`}
                        >
                          {post.category === "notice" ? d.news.notice : d.news.newsLabel}
                        </span>
                        {post.pinned && (
                          <span className="px-2 py-0.5 bg-[#fef3c7] text-[#92400e] text-[10px] font-bold font-headline rounded uppercase">
                            {d.news.pinned}
                          </span>
                        )}
                      </div>
                      <h2 className="font-body-text text-2xl font-semibold mb-3 text-primary leading-tight group-hover:text-on-tertiary-container transition-colors">
                        <Link href={`${p}/news/${post.id}`}>{t(post, "title", lang)}</Link>
                      </h2>
                      {post.content && (
                        <p className="font-body-text text-on-surface-variant text-lg mb-4 max-w-3xl">
                          {t(post, "content", lang).substring(0, 120)}
                          {t(post, "content", lang).length > 120 ? "..." : ""}
                        </p>
                      )}
                      <Link
                        href={`${p}/news/${post.id}`}
                        className="font-headline text-sm font-bold text-primary flex items-center gap-1 group/link hover:text-on-tertiary-container transition-colors"
                      >
                        {d.news.readStory}
                        <span className="material-symbols-outlined text-xs transition-transform group-hover/link:translate-x-1">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4">
              {currentPage > 1 ? (
                <Link
                  href={`${p}/news?${new URLSearchParams({ ...(category ? { category } : {}), page: String(currentPage - 1) })}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </Link>
              ) : (
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant cursor-not-allowed">
                  <span className="material-symbols-outlined">chevron_left</span>
                </span>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <Link
                  key={pg}
                  href={`${p}/news?${new URLSearchParams({ ...(category ? { category } : {}), page: String(pg) })}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-headline font-bold text-sm transition-colors ${
                    pg === currentPage
                      ? "bg-primary text-on-primary"
                      : "hover:bg-surface-container-high"
                  }`}
                >
                  {pg}
                </Link>
              ))}
              {currentPage < totalPages ? (
                <Link
                  href={`${p}/news?${new URLSearchParams({ ...(category ? { category } : {}), page: String(currentPage + 1) })}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </Link>
              ) : (
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant cursor-not-allowed">
                  <span className="material-symbols-outlined">chevron_right</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
