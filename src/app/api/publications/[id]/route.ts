import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeInt, sanitizeBool, sanitizeUrl } from "@/lib/validate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();
  const title = sanitizeString(body.title, 1000);
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const pub = await prisma.publication.update({
    where: { id },
    data: {
      title,
      authors: sanitizeString(body.authors, 2000) || "",
      venue: sanitizeString(body.venue, 500) || "",
      year: sanitizeInt(body.year, new Date().getFullYear()),
      featured: sanitizeBool(body.featured, false),
      url: sanitizeUrl(body.url),
      pdfUrl: sanitizeUrl(body.pdfUrl),
      doiUrl: sanitizeUrl(body.doiUrl),
      projectUrl: sanitizeUrl(body.projectUrl),
      codeUrl: sanitizeUrl(body.codeUrl),
      videoUrl: sanitizeUrl(body.videoUrl),
    },
  });
  return NextResponse.json(pub);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.publication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
