import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeBool, sanitizeUrl } from "@/lib/validate";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const title = sanitizeString(body.title, 500);
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const project = await prisma.project.create({
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
  return NextResponse.json(project, { status: 201 });
}
