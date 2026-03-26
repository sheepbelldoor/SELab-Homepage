import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
  const latestNews = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const featuredPubs = await prisma.publication.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    take: 3,
  });
  const researchAreas = await prisma.research.findMany({
    orderBy: { sortOrder: "asc" },
    take: 3,
  });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary to-primary-container text-on-primary py-32 md:py-40 overflow-hidden">
        {config?.bannerUrl && (
          <img
            src={config.bannerUrl}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="relative max-w-7xl mx-auto px-8 text-center">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
            {config?.labName || "SELab"}
          </h1>
          <p className="font-body-text text-xl md:text-2xl text-on-primary/80 mb-4 italic">
            {config?.tagline || "Software Engineering Laboratory"}
          </p>
          {config?.description && (
            <p className="max-w-2xl mx-auto text-on-primary-container mb-10 font-body-text text-lg leading-relaxed">
              {config.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/research"
              className="bg-tertiary-fixed text-on-tertiary-fixed px-8 py-3 rounded-md font-headline font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-95"
            >
              Research
            </Link>
            <Link
              href="/contact"
              className="border-2 border-on-primary/30 text-on-primary px-8 py-3 rounded-md font-headline font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      {researchAreas.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="font-headline text-3xl font-extrabold text-primary text-center mb-4 tracking-tight">
              Research Areas
            </h2>
            <div className="h-px w-16 bg-tertiary-fixed mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {researchAreas.map((area) => (
                <div
                  key={area.id}
                  className="bg-surface-container-low rounded-[6px] p-8 hover:ambient-shadow transition-all duration-300"
                >
                  <h3 className="font-headline text-xl font-bold text-primary mb-4">
                    {area.title}
                  </h3>
                  <p className="font-body-text text-on-surface-variant leading-relaxed">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/research"
                className="font-headline text-sm font-bold text-primary inline-flex items-center gap-1 hover:text-on-tertiary-container transition-colors"
              >
                View all research areas
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="py-20 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="font-headline text-3xl font-extrabold text-primary text-center mb-4 tracking-tight">
              Latest News
            </h2>
            <div className="h-px w-16 bg-tertiary-fixed mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((post) => (
                <Link key={post.id} href={`/news/${post.id}`} className="group">
                  <div className="bg-surface-container-lowest rounded-[6px] p-8 hover:ambient-shadow transition-all duration-300 h-full">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold font-headline rounded uppercase mb-4 ${
                        post.category === "notice"
                          ? "bg-[#fce7f3] text-[#9d174d]"
                          : "bg-[#e0e7ff] text-[#3730a3]"
                      }`}
                    >
                      {post.category === "notice" ? "Notice" : "News"}
                    </span>
                    <h3 className="font-headline font-semibold text-lg mb-3 text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-headline text-sm text-outline">
                      {post.createdAt.toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/news"
                className="font-headline text-sm font-bold text-primary inline-flex items-center gap-1 hover:text-on-tertiary-container transition-colors"
              >
                View all news
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Publications */}
      {featuredPubs.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="font-headline text-3xl font-extrabold text-primary text-center mb-4 tracking-tight">
              Recent Publications
            </h2>
            <div className="h-px w-16 bg-tertiary-fixed mx-auto mb-12" />
            <div className="space-y-6">
              {featuredPubs.map((pub) => (
                <div
                  key={pub.id}
                  className="bg-surface-container-low rounded-[6px] p-8 border-l-4 border-tertiary-fixed"
                >
                  <h3 className="font-body-text text-xl font-semibold text-primary mb-2">
                    {pub.title}
                  </h3>
                  <p className="font-headline text-sm text-on-surface-variant mb-1">{pub.authors}</p>
                  <p className="font-body-text text-sm text-on-surface-variant italic">
                    {pub.venue}, {pub.year}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/publications"
                className="font-headline text-sm font-bold text-primary inline-flex items-center gap-1 hover:text-on-tertiary-container transition-colors"
              >
                View all publications
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary text-on-primary">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="font-headline text-3xl font-extrabold mb-4 tracking-tight">
            Interested in our research?
          </h2>
          <p className="font-body-text text-on-primary-container mb-8 max-w-2xl mx-auto text-lg italic">
            We are always looking for motivated students and researchers to join our team.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-tertiary-fixed text-on-tertiary-fixed px-10 py-4 rounded-md font-headline font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
