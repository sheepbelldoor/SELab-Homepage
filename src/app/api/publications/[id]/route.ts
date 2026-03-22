import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();
  const pub = await prisma.publication.update({
    where: { id },
    data: {
      title: body.title,
      authors: body.authors,
      venue: body.venue,
      year: body.year,
      featured: body.featured,
      pdfUrl: body.pdfUrl,
      doiUrl: body.doiUrl,
      projectUrl: body.projectUrl,
      codeUrl: body.codeUrl,
      videoUrl: body.videoUrl,
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
