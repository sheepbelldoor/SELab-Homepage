import PageHeader from "@/components/PageHeader";
import MemberCard from "@/components/MemberCard";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";

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

  // Match publications to members using authorAliases (greedy first-match)
  function getPublicationsForMember(member: { name: string; nameEn: string | null; authorAliases: string }) {
    let aliases: string[] = [];
    try { aliases = JSON.parse(member.authorAliases); } catch { /* ignore */ }
    // If no aliases configured, skip matching
    if (aliases.length === 0) return [];
    // Sort aliases by length descending for greedy first-match
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
      <PageHeader title="People" subtitle="구성원 소개" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {grouped.length === 0 && (
          <p className="text-center text-muted-foreground">등록된 구성원이 없습니다.</p>
        )}
        {grouped.map((group) => (
          <div key={group.role} className="mb-16">
            <h2 className="text-2xl font-bold mb-2">{group.label}</h2>
            <Separator className="mb-8" />
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
