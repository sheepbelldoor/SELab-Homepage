"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [published, setPublished] = useState(true);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setThumbnail((data.thumbnail as string) || null);
        setPublished(data.published as boolean);
        setPinned(data.pinned as boolean);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/posts/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        titleEn: form.get("titleEn"),
        content: form.get("content"),
        contentEn: form.get("contentEn"),
        category: form.get("category"),
        published,
        pinned,
        thumbnail,
      }),
    });

    if (res.ok) {
      router.push("/admin/posts");
    } else {
      alert("저장에 실패했습니다.");
      setSaving(false);
    }
  }

  if (!post) return <p className="text-muted-foreground">로딩 중...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">게시글 수정</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <select name="category" id="category" defaultValue={post.category as string} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="news">소식 (News)</option>
                <option value="notice">공지 (Notice)</option>
              </select>
            </div>

            <ImageUpload value={thumbnail} onChange={setThumbnail} label="대표 이미지" />

            <Tabs defaultValue="ko">
              <TabsList>
                <TabsTrigger value="ko">한국어</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="ko" keepMounted className="space-y-4 mt-4 data-[hidden]:hidden">
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input id="title" name="title" defaultValue={post.title as string} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">본문</Label>
                  <Textarea id="content" name="content" rows={15} defaultValue={post.content as string} required />
                </div>
              </TabsContent>
              <TabsContent value="en" keepMounted className="space-y-4 mt-4 data-[hidden]:hidden">
                <div className="space-y-2">
                  <Label htmlFor="titleEn">Title</Label>
                  <Input id="titleEn" name="titleEn" defaultValue={(post.titleEn as string) || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contentEn">Content</Label>
                  <Textarea id="contentEn" name="contentEn" rows={15} defaultValue={(post.contentEn as string) || ""} />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <Switch id="published" checked={published} onCheckedChange={setPublished} />
                <Label htmlFor="published">공개</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="pinned" checked={pinned} onCheckedChange={setPinned} />
                <Label htmlFor="pinned">상단 고정</Label>
              </div>
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
    </div>
  );
}
