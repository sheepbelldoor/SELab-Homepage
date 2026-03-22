import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

  return (
    <>
      <PageHeader title="Contact" subtitle="연락처 및 지원 안내" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Join Us */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200">
            Join Us
          </h2>
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {config?.joinUsContent ||
              "모집 관련 내용이 아직 등록되지 않았습니다."}
          </div>
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200">
            Contact Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">주소</h3>
                <div className="space-y-2 text-gray-600">
                  {config?.address && <p>{config.address}</p>}
                  {config?.building && <p>{config.building}</p>}
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">연락처</h3>
                <div className="space-y-2 text-gray-600">
                  {config?.email && (
                    <p>
                      <span className="font-medium">Email:</span> {config.email}
                    </p>
                  )}
                  {config?.phone && (
                    <p>
                      <span className="font-medium">Tel:</span> {config.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface rounded-xl border border-gray-200 flex items-center justify-center min-h-[300px]">
              {config?.mapUrl ? (
                <iframe
                  src={config.mapUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>지도가 등록되지 않았습니다.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
