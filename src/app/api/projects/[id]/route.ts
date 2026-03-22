import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeBool, sanitizeUrl } from "@/lib/validate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();
  const title = sanitizeString(body.title, 500);
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      title,
      description: sanitizeString(body.description, 5000) || "",
      participants: sanitizeString(body.participants, 1000),
      status: body.status === "completed" ? "completed" : "ongoing",
      featured: sanitizeBool(body.featured, false),
      imageUrl: sanitizeUrl(body.imageUrl),
      demoUrl: sanitizeUrl(body.demoUrl),
    },
  });
  return NextResponse.json(project);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
