import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeBool, sanitizeUrl } from "@/lib/validate";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

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

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      titleEn: sanitizeString(body.titleEn, 500) || "",
      content: sanitizeString(body.content, 50000) || "",
      contentEn: sanitizeString(body.contentEn, 50000) || "",
      category: body.category === "notice" ? "notice" : "news",
      published: sanitizeBool(body.published, true),
      pinned: sanitizeBool(body.pinned, false),
      thumbnail: sanitizeUrl(body.thumbnail),
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
