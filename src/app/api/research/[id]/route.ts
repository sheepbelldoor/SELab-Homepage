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
  const area = await prisma.research.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      icon: body.icon,
      sortOrder: body.sortOrder,
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
