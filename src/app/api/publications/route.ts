import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeInt, sanitizeBool, sanitizeUrl } from "@/lib/validate";

export async function GET() {
  const pubs = await prisma.publication.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(pubs);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const title = sanitizeString(body.title, 1000);
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const pub = await prisma.publication.create({
    data: {
      title,
      authors: sanitizeString(body.authors, 2000) || "",
      venue: sanitizeString(body.venue, 500) || "",
      year: sanitizeInt(body.year, new Date().getFullYear()),
      featured: sanitizeBool(body.featured, false),
      pdfUrl: sanitizeUrl(body.pdfUrl),
      doiUrl: sanitizeUrl(body.doiUrl),
      projectUrl: sanitizeUrl(body.projectUrl),
      codeUrl: sanitizeUrl(body.codeUrl),
      videoUrl: sanitizeUrl(body.videoUrl),
    },
  });
  return NextResponse.json(pub, { status: 201 });
}
