import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-check";
import { sanitizeString, sanitizeMapUrl, sanitizeUrl } from "@/lib/validate";

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
      labName: sanitizeString(body.labName, 200) || undefined,
      labNameEn: sanitizeString(body.labNameEn, 200) ?? "",
      tagline: sanitizeString(body.tagline, 500) ?? "",
      taglineEn: sanitizeString(body.taglineEn, 500) ?? "",
      description: sanitizeString(body.description, 2000) ?? "",
      descriptionEn: sanitizeString(body.descriptionEn, 2000) ?? "",
      bannerUrl: sanitizeUrl(body.bannerUrl),
      address: sanitizeString(body.address, 500) ?? "",
      addressEn: sanitizeString(body.addressEn, 500) ?? "",
      building: sanitizeString(body.building, 500) ?? "",
      buildingEn: sanitizeString(body.buildingEn, 500) ?? "",
      email: sanitizeString(body.email, 200) ?? "",
      phone: sanitizeString(body.phone, 50) ?? "",
      mapUrl: sanitizeMapUrl(body.mapUrl),
      joinUsContent: sanitizeString(body.joinUsContent, 5000) ?? "",
      joinUsContentEn: sanitizeString(body.joinUsContentEn, 5000) ?? "",
      aboutContent: sanitizeString(body.aboutContent, 5000) ?? "",
      aboutContentEn: sanitizeString(body.aboutContentEn, 5000) ?? "",
    },
    create: {
      labName: sanitizeString(body.labName, 200) || "SELab",
      labNameEn: sanitizeString(body.labNameEn, 200) || "",
      tagline: sanitizeString(body.tagline, 500) || "",
      taglineEn: sanitizeString(body.taglineEn, 500) || "",
      description: sanitizeString(body.description, 2000) || "",
      descriptionEn: sanitizeString(body.descriptionEn, 2000) || "",
      address: sanitizeString(body.address, 500) || "",
      addressEn: sanitizeString(body.addressEn, 500) || "",
      building: sanitizeString(body.building, 500) || "",
      buildingEn: sanitizeString(body.buildingEn, 500) || "",
      email: sanitizeString(body.email, 200) || "",
      phone: sanitizeString(body.phone, 50) || "",
      aboutContent: sanitizeString(body.aboutContent, 5000) || "",
      aboutContentEn: sanitizeString(body.aboutContentEn, 5000) || "",
      joinUsContent: sanitizeString(body.joinUsContent, 5000) || "",
      joinUsContentEn: sanitizeString(body.joinUsContentEn, 5000) || "",
    },
  });
  return NextResponse.json(config);
}
