import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";

export async function GET() {
  const members = await prisma.member.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const member = await prisma.member.create({
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
      sortOrder: body.sortOrder ?? 0,
    },
  });
  return NextResponse.json(member, { status: 201 });
}
