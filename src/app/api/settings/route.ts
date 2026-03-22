import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";

export async function GET() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const config = await prisma.siteConfig.upsert({
    where: { id: "main" },
    update: {
      labName: body.labName,
      tagline: body.tagline,
      description: body.description,
      bannerUrl: body.bannerUrl,
      address: body.address,
      building: body.building,
      email: body.email,
      phone: body.phone,
      mapUrl: body.mapUrl,
      joinUsContent: body.joinUsContent,
      aboutContent: body.aboutContent,
    },
    create: {
      labName: body.labName || "SE Lab",
      tagline: body.tagline || "",
      description: body.description || "",
      address: body.address || "",
      building: body.building || "",
      email: body.email || "",
      phone: body.phone || "",
      aboutContent: body.aboutContent || "",
      joinUsContent: body.joinUsContent || "",
    },
  });
  return NextResponse.json(config);
}
