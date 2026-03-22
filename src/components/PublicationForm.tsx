"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  publication?: Record<string, unknown>;
  isEdit?: boolean;
}

export default function PublicationForm({ publication, isEdit }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const url = isEdit ? `/api/publications/${publication?.id}` : "/api/publications";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        authors: form.get("authors"),
        venue: form.get("venue"),
        year: Number(form.get("year")),
        featured: form.get("featured") === "on",
        pdfUrl: form.get("pdfUrl") || null,
        doiUrl: form.get("doiUrl") || null,
        codeUrl: form.get("codeUrl") || null,
        videoUrl: form.get("videoUrl") || null,
      }),
    });

    if (res.ok) {
      router.push("/admin/publications");
    } else {
      alert("저장에 실패했습니다.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">논문 제목</label>
        <input name="title" defaultValue={(publication?.title as string) || ""} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">저자</label>
        <input name="authors" defaultValue={(publication?.authors as string) || ""} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">게재처</label>
          <input name="venue" defaultValue={(publication?.venue as string) || ""} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">연도</label>
          <input name="year" type="number" defaultValue={(publication?.year as number) || new Date().getFullYear()} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PDF URL</label>
          <input name="pdfUrl" defaultValue={(publication?.pdfUrl as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">DOI URL</label>
          <input name="doiUrl" defaultValue={(publication?.doiUrl as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code URL</label>
          <input name="codeUrl" defaultValue={(publication?.codeUrl as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
          <input name="videoUrl" defaultValue={(publication?.videoUrl as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="featured" defaultChecked={(publication?.featured as boolean) || false} className="rounded" />
        <span className="text-sm">대표 논문</span>
      </label>
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
