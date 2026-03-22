import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { validatePassword } from "@/lib/validate";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (typeof currentPassword !== "string" || !currentPassword) {
    return NextResponse.json({ error: "현재 비밀번호를 입력해 주세요." }, { status: 400 });
  }

  const validNewPassword = validatePassword(newPassword);
  if (!validNewPassword) {
    return NextResponse.json({ error: "새 비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }

  const admin = await prisma.admin.findFirst();
  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) {
    return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(validNewPassword, 10);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { password: hashed },
  });

  return NextResponse.json({ success: true });
}
