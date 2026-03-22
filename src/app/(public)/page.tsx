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
    where: { featured: true },
    orderBy: { year: "desc" },
    take: 3,
  });
  const researchAreas = await prisma.research.findMany({
    orderBy: { sortOrder: "asc" },
    take: 3,
  });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-blue-900 text-white py-24 md:py-32 overflow-hidden">
        {config?.bannerUrl && (
          <img
            src={config.bannerUrl}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {config?.labName || "SE Lab"}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-4">
            {config?.tagline || "Software Engineering Laboratory"}
          </p>
          <p className="max-w-2xl mx-auto text-blue-200 mb-10">
            {config?.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/research"
              className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Research
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      {researchAreas.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Research Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {researchAreas.map((area) => (
                <div
                  key={area.id}
                  className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/research"
                className="text-primary font-medium hover:underline"
              >
                View all research areas &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.id}`}
                  className="block bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-primary mb-3">
                    {post.category === "notice" ? "Notice" : "News"}
                  </span>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {post.createdAt.toLocaleDateString("ko-KR")}
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/news"
                className="text-primary font-medium hover:underline"
              >
                View all news &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Publications */}
      {featuredPubs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Publications
            </h2>
            <div className="space-y-6">
              {featuredPubs.map((pub) => (
                <div
                  key={pub.id}
                  className="p-6 rounded-xl border border-gray-200"
                >
                  <h3 className="font-semibold text-lg mb-1">{pub.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">{pub.authors}</p>
                  <p className="text-gray-500 text-sm">
                    {pub.venue}, {pub.year}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/publications"
                className="text-primary font-medium hover:underline"
              >
                View all publications &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in our research?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            We are always looking for motivated students and researchers to join our team.
          </p>
          <Link
            href="/contact"
            className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
