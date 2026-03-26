"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MemberFormProps {
  member?: Record<string, unknown>;
  isEdit?: boolean;
}

/* ───────── Reorderable list with drag & drop + edit ───────── */
function ReorderableList({
  items,
  onChange,
  placeholder,
  addLabel = "추가",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel?: string;
}) {
  const [newItem, setNewItem] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  function addItem() {
    const trimmed = newItem.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
    }
    setNewItem("");
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
  }

  function startEdit(index: number) {
    setEditIndex(index);
    setEditValue(items[index]);
  }

  function saveEdit() {
    if (editIndex === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      const next = [...items];
      next[editIndex] = trimmed;
      onChange(next);
    }
    setEditIndex(null);
    setEditValue("");
  }

  function cancelEdit() {
    setEditIndex(null);
    setEditValue("");
  }

  function moveUp(index: number) {
    if (index <= 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index >= items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index;
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    dragOverItem.current = index;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }
    const next = [...items];
    const dragged = next.splice(dragItem.current, 1)[0];
    next.splice(dragOverItem.current, 0, dragged);
    onChange(next);
    dragItem.current = null;
    dragOverItem.current = null;
  }, [items, onChange]);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addItem}>
          {addLabel}
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <div
              key={`${i}-${item}`}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="flex items-center gap-2 group bg-muted/50 rounded-md px-2 py-1.5 cursor-grab active:cursor-grabbing"
            >
              {/* Drag handle */}
              <span className="text-muted-foreground text-xs select-none" title="드래그하여 순서 변경">
                ⠿
              </span>

              {editIndex === i ? (
                // Edit mode
                <div className="flex-1 flex gap-1.5">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-7 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); saveEdit(); }
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={saveEdit}>
                    확인
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={cancelEdit}>
                    취소
                  </Button>
                </div>
              ) : (
                // Display mode
                <>
                  <span className="flex-1 text-sm truncate">{item}</span>
                  {/* Move buttons */}
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs"
                    title="위로 이동"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === items.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs"
                    title="아래로 이동"
                  >
                    ▼
                  </button>
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => startEdit(i)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                    title="수정"
                  >
                    ✎
                  </button>
                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="text-muted-foreground hover:text-destructive text-xs"
                    title="삭제"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────── Main Form ───────── */
export default function MemberForm({ member, isEdit }: MemberFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<string | null>(
    (member?.photo as string) || null
  );

  const initialAliases: string[] = (() => {
    try {
      const raw = member?.authorAliases;
      if (typeof raw === "string") return JSON.parse(raw);
      if (Array.isArray(raw)) return raw;
    } catch { /* ignore */ }
    return [];
  })();

  const [aliases, setAliases] = useState<string[]>(initialAliases);
  const [newAlias, setNewAlias] = useState("");

  const initialEducation: string[] = (() => {
    try {
      const raw = member?.education;
      if (typeof raw === "string") return JSON.parse(raw);
      if (Array.isArray(raw)) return raw;
    } catch { /* ignore */ }
    return [];
  })();

  const initialAwards: string[] = (() => {
    try {
      const raw = member?.awards;
      if (typeof raw === "string") return JSON.parse(raw);
      if (Array.isArray(raw)) return raw;
    } catch { /* ignore */ }
    return [];
  })();

  const [education, setEducation] = useState<string[]>(initialEducation);
  const [awards, setAwards] = useState<string[]>(initialAwards);

  function addAlias() {
    const trimmed = newAlias.trim();
    if (trimmed && !aliases.includes(trimmed)) {
      setAliases([...aliases, trimmed]);
    }
    setNewAlias("");
  }

  function removeAlias(index: number) {
    setAliases(aliases.filter((_, i) => i !== index));
  }

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
        bio: form.get("bio") || null,
        interest: form.get("interest") || null,
        email: form.get("email") || null,
        homepage: form.get("homepage") || null,
        github: form.get("github") || null,
        scholar: form.get("scholar") || null,
        cvUrl: form.get("cvUrl") || null,
        photo,
        authorAliases: aliases,
        education,
        awards,
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
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 (한글)</Label>
              <Input id="name" name="name" defaultValue={(member?.name as string) || ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">이름 (영문)</Label>
              <Input id="nameEn" name="nameEn" defaultValue={(member?.nameEn as string) || ""} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">소속 그룹</Label>
              <select name="role" id="role" defaultValue={(member?.role as string) || "ms"} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="professor">교수</option>
                <option value="postdoc">박사후연구원</option>
                <option value="msphd">석박통합과정</option>
                <option value="phd">박사과정</option>
                <option value="ms">석사과정</option>
                <option value="intern">학부생/인턴</option>
                <option value="alumni">졸업생</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">정렬 순서</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={(member?.sortOrder as number) || 0} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">소개 (Bio)</Label>
            <Textarea id="bio" name="bio" rows={3} defaultValue={(member?.bio as string) || ""} placeholder="간단한 자기소개나 경력 등" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest">관심 연구 분야</Label>
            <Input id="interest" name="interest" defaultValue={(member?.interest as string) || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" name="email" type="email" defaultValue={(member?.email as string) || ""} />
          </div>

          <ImageUpload value={photo} onChange={setPhoto} label="프로필 사진" />

          {/* Author Aliases */}
          <div className="space-y-2">
            <Label>논문 저자명 (Publication Author Names)</Label>
            <p className="text-xs text-muted-foreground">
              논문에서 이 구성원을 식별하기 위한 이름 변형을 추가하세요. (예: &quot;Kim, Yunho&quot;, &quot;Yunho Kim&quot;)
            </p>
            <div className="flex gap-2">
              <Input
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                placeholder="예: Kim, Yunho"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAlias();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addAlias}>
                추가
              </Button>
            </div>
            {aliases.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {aliases.map((alias, i) => (
                  <Badge key={i} variant="secondary" className="text-sm py-1 px-3 gap-1.5">
                    {alias}
                    <button
                      type="button"
                      onClick={() => removeAlias(i)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label>Education</Label>
            <p className="text-xs text-muted-foreground">
              학력 사항을 추가하세요. 드래그하거나 ▲▼ 버튼으로 순서를 변경할 수 있습니다.
            </p>
            <ReorderableList
              items={education}
              onChange={setEducation}
              placeholder="예: M.S. in Computer Science, Hanyang University, 2025"
            />
          </div>

          {/* Honors & Awards */}
          <div className="space-y-2">
            <Label>Honors & Awards</Label>
            <p className="text-xs text-muted-foreground">
              수상 및 명예 사항을 추가하세요. 드래그하거나 ▲▼ 버튼으로 순서를 변경할 수 있습니다.
            </p>
            <ReorderableList
              items={awards}
              onChange={setAwards}
              placeholder="예: Best Paper Award, ICSE 2024"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homepage">홈페이지</Label>
              <Input id="homepage" name="homepage" defaultValue={(member?.homepage as string) || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" name="github" defaultValue={(member?.github as string) || ""} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scholar">Google Scholar</Label>
              <Input id="scholar" name="scholar" defaultValue={(member?.scholar as string) || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvUrl">CV URL</Label>
              <Input id="cvUrl" name="cvUrl" defaultValue={(member?.cvUrl as string) || ""} placeholder="https://..." />
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
  );
}
