"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  project?: Record<string, unknown>;
  isEdit?: boolean;
}

export default function ProjectForm({ project, isEdit }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [featured, setFeatured] = useState((project?.featured as boolean) || false);

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
        featured,
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
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">프로젝트명</Label>
            <Input id="title" name="title" defaultValue={(project?.title as string) || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea id="description" name="description" rows={6} defaultValue={(project?.description as string) || ""} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="participants">참여 인원</Label>
              <Input id="participants" name="participants" defaultValue={(project?.participants as string) || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <select name="status" id="status" defaultValue={(project?.status as string) || "ongoing"} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="ongoing">진행중</option>
                <option value="completed">완료</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">이미지 URL</Label>
              <Input id="imageUrl" name="imageUrl" defaultValue={(project?.imageUrl as string) || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demoUrl">데모 URL</Label>
              <Input id="demoUrl" name="demoUrl" defaultValue={(project?.demoUrl as string) || ""} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            <Label htmlFor="featured">대표 프로젝트</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "저장 중..." : "저장"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
