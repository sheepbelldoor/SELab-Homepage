import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { sanitizeMapUrl } from "@/lib/validate";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
  const safeMapUrl = sanitizeMapUrl(config?.mapUrl);

  return (
    <>
      <PageHeader title="Contact" subtitle="연락처 및 지원 안내" overline="Get in Touch" />
      <div className="max-w-4xl mx-auto px-8 pb-16">
        {/* Join Us */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline text-2xl font-extrabold text-primary">Join Us</h2>
            <div className="h-px flex-grow bg-outline-variant opacity-30" />
          </div>
          <div className="font-body-text whitespace-pre-wrap text-on-surface-variant leading-relaxed text-lg">
            {config?.joinUsContent ||
              "모집 관련 내용이 아직 등록되지 않았습니다."}
          </div>
        </section>

        {/* Contact Info */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline text-2xl font-extrabold text-primary">Contact Info</h2>
            <div className="h-px flex-grow bg-outline-variant opacity-30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Address */}
              <div className="bg-surface-container-low rounded-[6px] p-8">
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-primary mb-4">
                  <span className="material-symbols-outlined text-lg align-middle mr-2">location_on</span>
                  주소
                </h3>
                <div className="font-body-text text-on-surface-variant space-y-1">
                  {config?.address && <p>{config.address}</p>}
                  {config?.building && <p>{config.building}</p>}
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-surface-container-low rounded-[6px] p-8">
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-primary mb-4">
                  <span className="material-symbols-outlined text-lg align-middle mr-2">mail</span>
                  연락처
                </h3>
                <div className="font-body-text text-on-surface-variant space-y-2">
                  {config?.email && (
                    <p>
                      <span className="font-headline font-semibold text-on-surface text-sm">Email:</span>{" "}
                      {config.email}
                    </p>
                  )}
                  {config?.phone && (
                    <p>
                      <span className="font-headline font-semibold text-on-surface text-sm">Tel:</span>{" "}
                      {config.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-surface-container-low rounded-[6px] overflow-hidden min-h-[300px] flex items-center justify-center">
              {safeMapUrl ? (
                <iframe
                  src={safeMapUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              ) : (
                <div className="text-center text-outline p-8">
                  <span className="material-symbols-outlined text-5xl mb-3 block">map</span>
                  <p className="font-headline text-sm">지도가 등록되지 않았습니다.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
