import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";

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
  const pub = await prisma.publication.create({
    data: {
      title: body.title,
      authors: body.authors,
      venue: body.venue,
      year: body.year,
      featured: body.featured ?? false,
      pdfUrl: body.pdfUrl,
      doiUrl: body.doiUrl,
      projectUrl: body.projectUrl,
      codeUrl: body.codeUrl,
      videoUrl: body.videoUrl,
    },
  });
  return NextResponse.json(pub, { status: 201 });
}
