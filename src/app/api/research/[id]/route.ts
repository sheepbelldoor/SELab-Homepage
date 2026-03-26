import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeInt } from "@/lib/validate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();
  const title = sanitizeString(body.title, 200);
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const area = await prisma.research.update({
    where: { id },
    data: {
      title,
      titleEn: sanitizeString(body.titleEn, 200) || "",
      description: sanitizeString(body.description, 5000) || "",
      descriptionEn: sanitizeString(body.descriptionEn, 5000) || "",
      icon: sanitizeString(body.icon, 100),
      sortOrder: sanitizeInt(body.sortOrder, 0),
    },
  });
  return NextResponse.json(area);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.research.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
