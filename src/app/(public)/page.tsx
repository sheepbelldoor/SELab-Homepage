import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/lib/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
            {config?.labName || "SELab"}
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
              className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}
            >
              Research
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ size: "lg" }), "border-2 border-white bg-transparent text-white hover:bg-white/10")}
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      {researchAreas.length > 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Research Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {researchAreas.map((area) => (
                <Card key={area.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-primary mb-3">
                      {area.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {area.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/research" className={cn(buttonVariants({ variant: "link" }))}>
                View all research areas &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((post) => (
                <Link key={post.id} href={`/news/${post.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <Badge variant="secondary" className="mb-3">
                        {post.category === "notice" ? "Notice" : "News"}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {post.createdAt.toLocaleDateString("ko-KR")}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/news" className={cn(buttonVariants({ variant: "link" }))}>
                View all news &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Publications */}
      {featuredPubs.length > 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Publications
            </h2>
            <div className="space-y-4">
              {featuredPubs.map((pub) => (
                <Card key={pub.id}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-1">{pub.title}</h3>
                    <p className="text-muted-foreground text-sm mb-1">{pub.authors}</p>
                    <p className="text-muted-foreground/70 text-sm">
                      {pub.venue}, {pub.year}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/publications" className={cn(buttonVariants({ variant: "link" }))}>
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
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            We are always looking for motivated students and researchers to join our team.
          </p>
          <Link href="/contact" className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}>
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
