"use client";

import { useState } from "react";
import SafeLink from "@/components/SafeLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Publication {
  id: string;
  title: string;
  venue: string;
  year: number;
  url: string | null;
}

interface Member {
  id: string;
  name: string;
  nameEn: string | null;
  photo: string | null;
  role: string;
  bio: string | null;
  interest: string | null;
  email: string | null;
  homepage: string | null;
  github: string | null;
  scholar: string | null;
  cvUrl: string | null;
  education?: string[];
  awards?: string[];
  publications?: Publication[];
}

const roleLabels: Record<string, string> = {
  professor: "Professor",
  postdoc: "Postdoctoral Researcher",
  msphd: "MS/PhD Integrated",
  phd: "PhD Student",
  ms: "MS Student",
  intern: "Undergraduate / Intern",
  alumni: "Alumni",
};

export default function MemberCard({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);

  const hasLinks = member.homepage || member.github || member.scholar || member.cvUrl;

  return (
    <>
      {/* Card */}
      <div
        className="bg-surface-container-lowest rounded-[6px] p-6 hover:ambient-shadow transition-all duration-300 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={member.photo || undefined} alt={member.name} />
            <AvatarFallback className="text-2xl bg-surface-container-high font-headline">
              {member.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-headline font-semibold text-lg text-on-surface">{member.name}</h3>
          {member.nameEn && (
            <p className="font-headline text-sm text-on-surface-variant">{member.nameEn}</p>
          )}
          {member.interest && (
            <p className="font-headline text-sm text-outline mt-2">
              {member.interest}
            </p>
          )}
          {member.email && (
            <div className="flex items-center justify-center gap-1.5 mt-2 text-outline">
              <span className="material-symbols-outlined text-base">mail</span>
              <span className="font-headline text-xs">{member.email}</span>
            </div>
          )}
          <div className="flex justify-center gap-3 mt-3">
            {member.homepage && (
              <span className="material-symbols-outlined text-xl text-outline" title="Homepage">link</span>
            )}
            {member.github && (
              <svg className="w-5 h-5 text-outline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            )}
            {member.scholar && (
              <span className="material-symbols-outlined text-xl text-outline" title="Scholar">school</span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-surface-container-lowest">
          <DialogHeader>
            <div className="flex items-start gap-5">
              <Avatar className="w-24 h-24 flex-shrink-0">
                <AvatarImage src={member.photo || undefined} alt={member.name} />
                <AvatarFallback className="text-2xl bg-surface-container-high font-headline">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left min-w-0">
                <DialogTitle className="font-headline text-xl leading-tight text-on-surface">
                  {member.name}
                </DialogTitle>
                {member.nameEn && (
                  <p className="font-headline text-sm text-on-surface-variant mt-0.5">{member.nameEn}</p>
                )}
                <span className="inline-block mt-2 px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-md text-xs font-headline font-bold">
                  {roleLabels[member.role] || member.role}
                </span>
                {member.email && (
                  <p className="font-headline text-sm text-on-surface-variant mt-2">{member.email}</p>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="h-px bg-outline-variant/20 my-2" />

          <div className="space-y-5">
            {member.bio && (
              <section>
                <DialogDescription className="font-headline font-bold text-on-surface text-xs uppercase tracking-wider mb-1.5">
                  About
                </DialogDescription>
                <p className="font-body-text text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed">{member.bio}</p>
              </section>
            )}

            {member.interest && (
              <section>
                <DialogDescription className="font-headline font-bold text-on-surface text-xs uppercase tracking-wider mb-1.5">
                  Research Interests
                </DialogDescription>
                <p className="font-headline text-sm text-on-surface-variant">{member.interest}</p>
              </section>
            )}

            {member.education && member.education.length > 0 && (
              <section>
                <DialogDescription className="font-headline font-bold text-on-surface text-xs uppercase tracking-wider mb-1.5">
                  Education
                </DialogDescription>
                <ul className="space-y-1">
                  {member.education.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-outline mt-1.5 w-1.5 h-1.5 rounded-full bg-outline/40 flex-shrink-0" />
                      <span className="font-headline text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {member.awards && member.awards.length > 0 && (
              <section>
                <DialogDescription className="font-headline font-bold text-on-surface text-xs uppercase tracking-wider mb-1.5">
                  Honors & Awards
                </DialogDescription>
                <ul className="space-y-1">
                  {member.awards.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-outline mt-1.5 w-1.5 h-1.5 rounded-full bg-outline/40 flex-shrink-0" />
                      <span className="font-headline text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {member.publications && member.publications.length > 0 && (() => {
              const pubsByYear = member.publications!.reduce<Record<number, Publication[]>>((acc, pub) => {
                (acc[pub.year] ??= []).push(pub);
                return acc;
              }, {});
              const sortedYears = Object.keys(pubsByYear).map(Number).sort((a, b) => b - a);
              const totalCount = member.publications!.length;

              return (
                <section>
                  <DialogDescription className="font-headline font-bold text-on-surface text-xs uppercase tracking-wider mb-3">
                    Publications ({totalCount})
                  </DialogDescription>
                  <div className="space-y-4">
                    {sortedYears.map((year) => (
                      <div key={year}>
                        <h4 className="font-headline text-xs font-semibold text-outline pb-1 mb-2">{year}</h4>
                        <ul className="space-y-1.5">
                          {pubsByYear[year].map((pub) => (
                            <li key={pub.id} className="flex items-start gap-2 text-sm leading-snug">
                              <span className="text-outline mt-1.5 w-1.5 h-1.5 rounded-full bg-outline/40 flex-shrink-0" />
                              <div className="min-w-0">
                                {pub.url ? (
                                  <SafeLink href={pub.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-on-tertiary-container transition-colors font-body-text">
                                    {pub.title}
                                  </SafeLink>
                                ) : (
                                  <span className="font-body-text text-on-surface">{pub.title}</span>
                                )}
                                <br />
                                <span className="font-headline text-xs text-outline">{pub.venue}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {hasLinks && (
              <section>
                <DialogDescription className="font-headline font-bold text-on-surface text-xs uppercase tracking-wider mb-1.5">
                  Links
                </DialogDescription>
                <div className="flex flex-wrap gap-4">
                  {member.homepage && (
                    <SafeLink href={member.homepage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-headline text-sm text-primary hover:text-on-tertiary-container transition-colors">
                      <span className="material-symbols-outlined text-base">link</span>
                      Homepage
                    </SafeLink>
                  )}
                  {member.github && (
                    <SafeLink href={member.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-headline text-sm text-primary hover:text-on-tertiary-container transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </SafeLink>
                  )}
                  {member.scholar && (
                    <SafeLink href={member.scholar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-headline text-sm text-primary hover:text-on-tertiary-container transition-colors">
                      <span className="material-symbols-outlined text-base">school</span>
                      Scholar
                    </SafeLink>
                  )}
                  {member.cvUrl && (
                    <SafeLink href={member.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-headline text-sm text-primary hover:text-on-tertiary-container transition-colors">
                      <span className="material-symbols-outlined text-base">download</span>
                      CV
                    </SafeLink>
                  )}
                </div>
              </section>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
