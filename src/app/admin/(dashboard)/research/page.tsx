"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface Research {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  sortOrder: number;
}

export default function AdminResearchPage() {
  const [areas, setAreas] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", titleEn: "", description: "", descriptionEn: "", sortOrder: 0 });

  function loadData() {
    fetch("/api/research")
      .then((r) => r.json())
      .then(setAreas)
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadData(); }, []);

  async function handleSave() {
    const isNew = editing === "new";
    const url = isNew ? "/api/research" : `/api/research/${editing}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setEditing(null);
      setForm({ title: "", titleEn: "", description: "", descriptionEn: "", sortOrder: 0 });
      loadData();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/research/${id}`, { method: "DELETE" });
    loadData();
  }

  function startEdit(area: Research) {
    setEditing(area.id);
    setForm({ title: area.title, titleEn: area.titleEn || "", description: area.description, descriptionEn: area.descriptionEn || "", sortOrder: area.sortOrder });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">연구 분야 관리</h1>
        <Button
          onClick={() => {
            setEditing("new");
            setForm({ title: "", titleEn: "", description: "", descriptionEn: "", sortOrder: 0 });
          }}
        >
          새 연구 분야
        </Button>
      </div>

      {editing && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="font-semibold mb-4">{editing === "new" ? "새 연구 분야" : "수정"}</h2>
            <div className="space-y-4 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>제목 (한국어)</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Title (English)</Label>
                  <Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>설명 (한국어)</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={4} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>정렬 순서</Label>
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-32" />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave}>저장</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>취소</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : areas.length === 0 ? (
        <p className="text-muted-foreground">등록된 연구 분야가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {areas.map((area) => (
            <Card key={area.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{area.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{area.description}</p>
                    <p className="text-muted-foreground/50 text-xs mt-2">정렬: {area.sortOrder}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="link" size="sm" className="h-auto p-0" onClick={() => startEdit(area)}>수정</Button>
                    <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => handleDelete(area.id)}>삭제</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
