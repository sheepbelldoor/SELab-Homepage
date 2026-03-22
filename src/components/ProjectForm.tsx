"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  project?: Record<string, unknown>;
  isEdit?: boolean;
}

export default function ProjectForm({ project, isEdit }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const url = isEdit ? `/api/projects/${project?.id}` : "/api/projects";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        participants: form.get("participants") || null,
        status: form.get("status"),
        featured: form.get("featured") === "on",
        imageUrl: form.get("imageUrl") || null,
        demoUrl: form.get("demoUrl") || null,
      }),
    });

    if (res.ok) {
      router.push("/admin/projects");
    } else {
      alert("저장에 실패했습니다.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트명</label>
        <input name="title" defaultValue={(project?.title as string) || ""} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
        <textarea name="description" rows={6} defaultValue={(project?.description as string) || ""} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">참여 인원</label>
          <input name="participants" defaultValue={(project?.participants as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
          <select name="status" defaultValue={(project?.status as string) || "ongoing"} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
            <option value="ongoing">진행중</option>
            <option value="completed">완료</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
          <input name="imageUrl" defaultValue={(project?.imageUrl as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">데모 URL</label>
          <input name="demoUrl" defaultValue={(project?.demoUrl as string) || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="featured" defaultChecked={(project?.featured as boolean) || false} className="rounded" />
        <span className="text-sm">대표 프로젝트</span>
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
