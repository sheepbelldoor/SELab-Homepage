"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  featured: boolean;
}

export default function AdminPublicationsPage() {
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/publications")
      .then((r) => r.json())
      .then(setPubs)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/publications/${id}`, { method: "DELETE" });
    setPubs((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">논문 관리</h1>
        <Link href="/admin/publications/new" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          새 논문
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : pubs.length === 0 ? (
        <p className="text-gray-500">논문이 없습니다.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">논문 제목</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">게재처</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">연도</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pubs.map((pub) => (
                <tr key={pub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {pub.featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">대표</span>}
                      <span className="font-medium">{pub.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pub.venue}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pub.year}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/publications/${pub.id}`} className="text-sm text-primary hover:underline">수정</Link>
                      <button onClick={() => handleDelete(pub.id)} className="text-sm text-red-500 hover:underline">삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
