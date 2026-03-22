import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <PageHeader title="News & Notice" subtitle="소식 및 공지사항" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">등록된 게시글이 없습니다.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 w-24">분류</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">제목</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 w-28 text-right">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                          post.category === "notice"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-primary"
                        }`}
                      >
                        {post.category === "notice" ? "Notice" : "News"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/news/${post.id}`}
                        className="font-medium hover:text-primary transition-colors inline-flex items-center gap-2"
                      >
                        {post.pinned && (
                          <span className="text-xs font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">고정</span>
                        )}
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right whitespace-nowrap">
                      {post.createdAt.toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
