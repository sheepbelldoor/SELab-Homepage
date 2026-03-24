"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  publication?: Record<string, unknown>;
  isEdit?: boolean;
}

export default function PublicationForm({ publication, isEdit }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [featured, setFeatured] = useState((publication?.featured as boolean) || false);

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
        featured,
        url: form.get("url") || null,
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
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">논문 제목</Label>
            <Input id="title" name="title" defaultValue={(publication?.title as string) || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authors">저자</Label>
            <Input id="authors" name="authors" defaultValue={(publication?.authors as string) || ""} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue">게재처</Label>
              <Input id="venue" name="venue" defaultValue={(publication?.venue as string) || ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">연도</Label>
              <Input id="year" name="year" type="number" defaultValue={(publication?.year as number) || new Date().getFullYear()} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">논문 URL (제목 클릭 시 이동)</Label>
            <Input id="url" name="url" placeholder="https://..." defaultValue={(publication?.url as string) || ""} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pdfUrl">PDF URL</Label>
              <Input id="pdfUrl" name="pdfUrl" defaultValue={(publication?.pdfUrl as string) || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doiUrl">DOI URL</Label>
              <Input id="doiUrl" name="doiUrl" defaultValue={(publication?.doiUrl as string) || ""} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codeUrl">Code URL</Label>
              <Input id="codeUrl" name="codeUrl" defaultValue={(publication?.codeUrl as string) || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input id="videoUrl" name="videoUrl" defaultValue={(publication?.videoUrl as string) || ""} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            <Label htmlFor="featured">대표 논문</Label>
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
