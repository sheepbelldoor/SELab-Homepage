"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MemberForm from "@/components/MemberForm";

export default function EditMemberPage() {
  const params = useParams();
  const [member, setMember] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/members`)
      .then((r) => r.json())
      .then((members: Record<string, unknown>[]) => {
        const found = members.find((m) => m.id === params.id);
        setMember(found || null);
      });
  }, [params.id]);

  if (!member) return <p className="text-gray-500">로딩 중...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">구성원 수정</h1>
      <MemberForm member={member} isEdit />
    </div>
  );
}
