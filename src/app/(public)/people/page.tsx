import PageHeader from "@/components/PageHeader";
import MemberCard from "@/components/MemberCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const roleLabels: Record<string, string> = {
  professor: "Professor",
  postdoc: "Postdoctoral Researcher",
  msphd: "MS/PhD Integrated",
  phd: "PhD Students",
  ms: "MS Students",
  intern: "Undergraduate / Intern",
  alumni: "Alumni",
};

const roleOrder = ["professor", "postdoc", "msphd", "phd", "ms", "intern", "alumni"];

export default async function PeoplePage() {
  const [members, publications] = await Promise.all([
    prisma.member.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.publication.findMany({
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      select: { id: true, title: true, authors: true, venue: true, year: true, url: true },
    }),
  ]);

  function getPublicationsForMember(member: { name: string; nameEn: string | null; authorAliases: string }) {
    let aliases: string[] = [];
    try { aliases = JSON.parse(member.authorAliases); } catch { /* ignore */ }
    if (aliases.length === 0) return [];
    const sortedAliases = [...aliases].sort((a, b) => b.length - a.length);
    return publications.filter((pub) => {
      const authorsLower = pub.authors.toLowerCase();
      return sortedAliases.some((alias) => authorsLower.includes(alias.toLowerCase()));
    });
  }

  const grouped = roleOrder
    .map((role) => ({
      role,
      label: roleLabels[role] || role,
      members: members.filter((m) => m.role === role),
    }))
    .filter((g) => g.members.length > 0);

  return (
    <>
      <PageHeader title="People" subtitle="구성원 소개" overline="Our Team" />
      <div className="max-w-7xl mx-auto px-8 pb-16">
        {grouped.length === 0 && (
          <p className="text-center text-on-surface-variant font-headline">등록된 구성원이 없습니다.</p>
        )}
        {grouped.map((group) => (
          <div key={group.role} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-headline text-2xl font-extrabold text-primary">{group.label}</h2>
              <div className="h-px flex-grow bg-outline-variant opacity-30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {group.members.map((member) => {
                const memberPubs = getPublicationsForMember(member);
                return (
                  <MemberCard
                    key={member.id}
                    member={{
                      id: member.id,
                      name: member.name,
                      nameEn: member.nameEn,
                      photo: member.photo,
                      role: member.role,
                      bio: member.bio,
                      interest: member.interest,
                      email: member.email,
                      homepage: member.homepage,
                      github: member.github,
                      scholar: member.scholar,
                      cvUrl: member.cvUrl,
                      education: (() => { try { return JSON.parse(member.education); } catch { return []; } })(),
                      awards: (() => { try { return JSON.parse(member.awards); } catch { return []; } })(),
                      publications: memberPubs.map((p) => ({
                        id: p.id,
                        title: p.title,
                        venue: p.venue,
                        year: p.year,
                        url: p.url,
                      })),
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
