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
  const member = await prisma.member.update({
    where: { id },
    data: {
      name: body.name,
      nameEn: body.nameEn,
      photo: body.photo,
      role: body.role,
      interest: body.interest,
      email: body.email,
      homepage: body.homepage,
      github: body.github,
      scholar: body.scholar,
      sortOrder: body.sortOrder,
    },
  });
  return NextResponse.json(member);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.member.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
