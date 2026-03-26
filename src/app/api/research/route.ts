import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeInt } from "@/lib/validate";

export async function GET() {
  const areas = await prisma.research.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(areas);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const title = sanitizeString(body.title, 200);
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const area = await prisma.research.create({
    data: {
      title,
      titleEn: sanitizeString(body.titleEn, 200) || "",
      description: sanitizeString(body.description, 5000) || "",
      descriptionEn: sanitizeString(body.descriptionEn, 5000) || "",
      icon: sanitizeString(body.icon, 100),
      sortOrder: sanitizeInt(body.sortOrder, 0),
    },
  });
  return NextResponse.json(area, { status: 201 });
}
