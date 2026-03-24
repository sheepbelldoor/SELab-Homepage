import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeInt, sanitizeUrl } from "@/lib/validate";

const VALID_ROLES = ["professor", "postdoc", "msphd", "phd", "ms", "intern", "alumni"];

function sanitizeStringArray(value: unknown, maxItemLength = 200): string {
  if (!Array.isArray(value)) return "[]";
  const cleaned = value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().slice(0, maxItemLength))
    .filter((v) => v.length > 0);
  return JSON.stringify(cleaned);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();
  const name = sanitizeString(body.name, 100);
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const role = VALID_ROLES.includes(body.role) ? body.role : "ms";

  const member = await prisma.member.update({
    where: { id },
    data: {
      name,
      nameEn: sanitizeString(body.nameEn, 100),
      photo: sanitizeUrl(body.photo),
      role,
      bio: sanitizeString(body.bio, 2000),
      interest: sanitizeString(body.interest, 500),
      email: sanitizeString(body.email, 200),
      homepage: sanitizeUrl(body.homepage),
      github: sanitizeUrl(body.github),
      scholar: sanitizeUrl(body.scholar),
      cvUrl: sanitizeUrl(body.cvUrl),
      authorAliases: sanitizeStringArray(body.authorAliases),
      education: sanitizeStringArray(body.education, 500),
      awards: sanitizeStringArray(body.awards, 500),
      sortOrder: sanitizeInt(body.sortOrder, 0),
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
