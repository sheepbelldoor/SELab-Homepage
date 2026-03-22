"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  email?: string;
}

const roleLabels: Record<string, string> = {
  professor: "교수",
  postdoc: "박사후연구원",
  msphd: "석박통합과정",
  phd: "박사과정",
  ms: "석사과정",
  intern: "학부생/인턴",
  alumni: "졸업생",
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">구성원 관리</h1>
        <Link href="/admin/members/new" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          새 구성원
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : members.length === 0 ? (
        <p className="text-gray-500">구성원이 없습니다.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">이름</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">소속</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">이메일</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {member.name}
                    {member.nameEn && <span className="text-gray-400 ml-2 text-sm">({member.nameEn})</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{roleLabels[member.role] || member.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{member.email || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/members/${member.id}`} className="text-sm text-primary hover:underline">수정</Link>
                      <button onClick={() => handleDelete(member.id)} className="text-sm text-red-500 hover:underline">삭제</button>
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
