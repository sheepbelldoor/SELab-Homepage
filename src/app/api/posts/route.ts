import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeBool, sanitizeUrl } from "@/lib/validate";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const title = sanitizeString(body.title, 500);
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      content: sanitizeString(body.content, 50000) || "",
      category: body.category === "notice" ? "notice" : "news",
      published: sanitizeBool(body.published, true),
      pinned: sanitizeBool(body.pinned, false),
      thumbnail: sanitizeUrl(body.thumbnail),
    },
  });
  return NextResponse.json(post, { status: 201 });
}
