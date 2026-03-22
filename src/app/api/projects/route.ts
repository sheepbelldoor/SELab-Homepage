import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";

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
  const project = await prisma.project.create({
    data: {
      title: body.title,
      description: body.description,
      participants: body.participants,
      status: body.status || "ongoing",
      featured: body.featured ?? false,
      imageUrl: body.imageUrl,
      demoUrl: body.demoUrl,
    },
  });
  return NextResponse.json(project, { status: 201 });
}
