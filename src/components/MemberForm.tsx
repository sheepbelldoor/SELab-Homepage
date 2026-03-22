"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface MemberFormProps {
  member?: Record<string, unknown>;
  isEdit?: boolean;
}

export default function MemberForm({ member, isEdit }: MemberFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<string | null>(
    (member?.photo as string) || null
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const url = isEdit ? `/api/members/${member?.id}` : "/api/members";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        nameEn: form.get("nameEn") || null,
        role: form.get("role"),
        interest: form.get("interest") || null,
        email: form.get("email") || null,
        homepage: form.get("homepage") || null,
        github: form.get("github") || null,
        scholar: form.get("scholar") || null,
        photo,
        sortOrder: Number(form.get("sortOrder")) || 0,
      }),
    });

    if (res.ok) {
      router.push("/admin/members");
    } else {
      alert("저장에 실패했습니다.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이름 (한글)</label>
          <input name="name" defaultValue={(member?.name as string) || ""} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이름 (영문)</label>
          <input name="nameEn" defaultValue={(member?.nameEn as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">소속 그룹</label>
          <select name="role" defaultValue={(member?.role as string) || "ms"} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
            <option value="professor">교수</option>
            <option value="postdoc">박사후연구원</option>
            <option value="msphd">석박통합과정</option>
            <option value="phd">박사과정</option>
            <option value="ms">석사과정</option>
            <option value="intern">학부생/인턴</option>
            <option value="alumni">졸업생</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
          <input name="sortOrder" type="number" defaultValue={(member?.sortOrder as number) || 0} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">관심 연구 분야</label>
        <input name="interest" defaultValue={(member?.interest as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
        <input name="email" type="email" defaultValue={(member?.email as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
      </div>

      <ImageUpload value={photo} onChange={setPhoto} label="프로필 사진" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">홈페이지</label>
          <input name="homepage" defaultValue={(member?.homepage as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
          <input name="github" defaultValue={(member?.github as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar</label>
          <input name="scholar" defaultValue={(member?.scholar as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
          {saving ? "저장 중..." : "저장"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          취소
        </button>
      </div>
    </form>
  );
}
