import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { parseLang } from "@/lib/i18n";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = parseLang(rawLang);

  return (
    <div className="bg-surface text-on-surface">
      <Navbar lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
