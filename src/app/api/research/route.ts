import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";

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
  const area = await prisma.research.create({
    data: {
      title: body.title,
      description: body.description,
      icon: body.icon,
      sortOrder: body.sortOrder ?? 0,
    },
  });
  return NextResponse.json(area, { status: 201 });
}
