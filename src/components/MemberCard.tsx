"use client";

import { useState } from "react";
import SafeLink from "@/components/SafeLink";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
      {/* --- Card (original UI restored) --- */}
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={member.photo || undefined} alt={member.name} />
              <AvatarFallback className="text-2xl bg-muted">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{member.name}</h3>
            {member.nameEn && (
              <p className="text-sm text-muted-foreground">{member.nameEn}</p>
            )}
            {member.interest && (
              <p className="text-sm text-muted-foreground mt-2">
                {member.interest}
              </p>
            )}
            {member.email && (
              <div className="flex items-center justify-center gap-1.5 mt-2 text-muted-foreground">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">{member.email}</span>
              </div>
            )}
            <div className="flex justify-center gap-3 mt-3">
              {member.homepage && (
                <span className="text-muted-foreground" title="Homepage">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </span>
              )}
              {member.github && (
                <span className="text-muted-foreground" title="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </span>
              )}
              {member.scholar && (
                <span className="text-muted-foreground" title="Google Scholar">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Profile Dialog --- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {/* Header: photo + identity */}
          <DialogHeader>
            <div className="flex items-start gap-5">
              <Avatar className="w-24 h-24 flex-shrink-0">
                <AvatarImage src={member.photo || undefined} alt={member.name} />
                <AvatarFallback className="text-2xl bg-muted">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left min-w-0">
                <DialogTitle className="text-xl leading-tight">{member.name}</DialogTitle>
                {member.nameEn && (
                  <p className="text-sm text-muted-foreground mt-0.5">{member.nameEn}</p>
                )}
                <Badge variant="secondary" className="mt-2 text-xs">
                  {roleLabels[member.role] || member.role}
                </Badge>
                {member.email && (
                  <p className="text-sm text-muted-foreground mt-2">{member.email}</p>
                )}
              </div>
            </div>
          </DialogHeader>

          <Separator />

          <div className="space-y-5">
            {/* Bio */}
            {member.bio && (
              <section>
                <DialogDescription className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1.5">
                  About
                </DialogDescription>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{member.bio}</p>
              </section>
            )}

            {/* Research Interests */}
            {member.interest && (
              <section>
                <DialogDescription className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1.5">
                  Research Interests
                </DialogDescription>
                <p className="text-sm text-muted-foreground">{member.interest}</p>
              </section>
            )}

            {/* Publications */}
            {member.publications && member.publications.length > 0 && (() => {
              const pubsByYear = member.publications!.reduce<Record<number, Publication[]>>((acc, pub) => {
                (acc[pub.year] ??= []).push(pub);
                return acc;
              }, {});
              const sortedYears = Object.keys(pubsByYear).map(Number).sort((a, b) => b - a);
              const totalCount = member.publications!.length;

              return (
                <section>
                  <DialogDescription className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
                    Publications ({totalCount})
                  </DialogDescription>
                  <div className="space-y-4">
                    {sortedYears.map((year) => (
                      <div key={year}>
                        <h4 className="text-xs font-semibold text-muted-foreground border-b pb-1 mb-2">{year}</h4>
                        <ul className="space-y-1.5">
                          {pubsByYear[year].map((pub) => (
                            <li key={pub.id} className="flex items-start gap-2 text-sm leading-snug">
                              <span className="text-muted-foreground mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                              <div className="min-w-0">
                                {pub.url ? (
                                  <SafeLink href={pub.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    {pub.title}
                                  </SafeLink>
                                ) : (
                                  <span className="text-foreground">{pub.title}</span>
                                )}
                                <br />
                                <span className="text-muted-foreground text-xs">{pub.venue}</span>
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

            {/* Links */}
            {hasLinks && (
              <section>
                <DialogDescription className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1.5">
                  Links
                </DialogDescription>
                <div className="flex flex-wrap gap-3">
                  {member.homepage && (
                    <SafeLink href={member.homepage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Homepage
                    </SafeLink>
                  )}
                  {member.github && (
                    <SafeLink href={member.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </SafeLink>
                  )}
                  {member.scholar && (
                    <SafeLink href={member.scholar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z" />
                      </svg>
                      Scholar
                    </SafeLink>
                  )}
                  {member.cvUrl && (
                    <SafeLink href={member.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
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
