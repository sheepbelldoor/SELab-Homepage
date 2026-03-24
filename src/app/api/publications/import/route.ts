import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { parseBibtex } from "@/lib/bibtex-parser";
import { sanitizeString, sanitizeUrl } from "@/lib/validate";

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const bibtex = body.bibtex;
  if (typeof bibtex !== "string" || !bibtex.trim()) {
    return NextResponse.json({ error: "BibTeX content is required" }, { status: 400 });
  }

  const entries = parseBibtex(bibtex);
  if (entries.length === 0) {
    return NextResponse.json({ error: "No valid entries found" }, { status: 400 });
  }

  const created = [];
  for (const entry of entries) {
    const title = sanitizeString(entry.title, 1000);
    if (!title) continue;

    const pub = await prisma.publication.create({
      data: {
        title,
        authors: sanitizeString(entry.authors, 2000) || "",
        venue: sanitizeString(entry.venue, 500) || "",
        year: entry.year,
        featured: false,
        url: sanitizeUrl(entry.url),
        pdfUrl: sanitizeUrl(entry.pdfUrl),
        doiUrl: sanitizeUrl(entry.doi),
        codeUrl: sanitizeUrl(entry.codeUrl),
        videoUrl: sanitizeUrl(entry.videoUrl),
      },
    });
    created.push(pub);
  }

  return NextResponse.json({ count: created.length, publications: created }, { status: 201 });
}
