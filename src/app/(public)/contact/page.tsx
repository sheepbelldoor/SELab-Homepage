import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { sanitizeMapUrl } from "@/lib/validate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
  const safeMapUrl = sanitizeMapUrl(config?.mapUrl);

  return (
    <>
      <PageHeader title="Contact" subtitle="연락처 및 지원 안내" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Join Us */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Join Us</h2>
          <Separator className="mb-6" />
          <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {config?.joinUsContent ||
              "모집 관련 내용이 아직 등록되지 않았습니다."}
          </div>
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Contact Info</h2>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">주소</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-1">
                  {config?.address && <p>{config.address}</p>}
                  {config?.building && <p>{config.building}</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">연락처</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-1">
                  {config?.email && (
                    <p>
                      <span className="font-medium text-foreground">Email:</span> {config.email}
                    </p>
                  )}
                  {config?.phone && (
                    <p>
                      <span className="font-medium text-foreground">Tel:</span> {config.phone}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="flex items-center justify-center min-h-[300px]">
              <CardContent className="w-full p-6">
                {safeMapUrl ? (
                  <iframe
                    src={safeMapUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>지도가 등록되지 않았습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
