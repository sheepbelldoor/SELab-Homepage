"use client";

import { useEffect, useState } from "react";

interface Research {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
}

export default function AdminResearchPage() {
  const [areas, setAreas] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", sortOrder: 0 });

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
      setForm({ title: "", description: "", sortOrder: 0 });
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
    setForm({ title: area.title, description: area.description, sortOrder: area.sortOrder });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">연구 분야 관리</h1>
        <button
          onClick={() => {
            setEditing("new");
            setForm({ title: "", description: "", sortOrder: 0 });
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          새 연구 분야
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-semibold mb-4">{editing === "new" ? "새 연구 분야" : "수정"}</h2>
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">저장</button>
              <button onClick={() => setEditing(null)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : areas.length === 0 ? (
        <p className="text-gray-500">등록된 연구 분야가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {areas.map((area) => (
            <div key={area.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{area.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{area.description}</p>
                  <p className="text-gray-400 text-xs mt-2">정렬: {area.sortOrder}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => startEdit(area)} className="text-sm text-primary hover:underline">수정</button>
                  <button onClick={() => handleDelete(area.id)} className="text-sm text-red-500 hover:underline">삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
