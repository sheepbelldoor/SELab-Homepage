"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PublicationForm from "@/components/PublicationForm";

export default function EditPublicationPage() {
  const params = useParams();
  const [pub, setPub] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/publications")
      .then((r) => r.json())
      .then((pubs: Record<string, unknown>[]) => {
        setPub(pubs.find((p) => p.id === params.id) || null);
      });
  }, [params.id]);

  if (!pub) return <p className="text-gray-500">로딩 중...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">논문 수정</h1>
      <PublicationForm publication={pub} isEdit />
    </div>
  );
}
