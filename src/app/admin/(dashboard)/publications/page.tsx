"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { parseBibtex, type BibEntry } from "@/lib/bibtex-parser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  tags: string;
}

export default function AdminPublicationsPage() {
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [bibText, setBibText] = useState("");
  const [preview, setPreview] = useState<BibEntry[]>([]);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPubs();
  }, []);

  function fetchPubs() {
    setLoading(true);
    fetch("/api/publications")
      .then((r) => r.json())
      .then(setPubs)
      .finally(() => setLoading(false));
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/publications/${id}`, { method: "DELETE" });
    setPubs((prev) => prev.filter((p) => p.id !== id));
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setBibText(text);
      setPreview(parseBibtex(text));
      setImportMsg("");
    };
    reader.readAsText(file);
  }

  function handlePreview() {
    const entries = parseBibtex(bibText);
    setPreview(entries);
    setImportMsg(entries.length === 0 ? "파싱된 항목이 없습니다." : "");
  }

  async function handleImport() {
    if (preview.length === 0) return;
    setImporting(true);
    setImportMsg("");

    const res = await fetch("/api/publications/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bibtex: bibText }),
    });

    if (res.ok) {
      const data = await res.json();
      setImportMsg(`${data.count}건의 논문이 등록되었습니다.`);
      setBibText("");
      setPreview([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPubs();
    } else {
      const data = await res.json();
      setImportMsg(data.error || "가져오기에 실패했습니다.");
    }
    setImporting(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">논문 관리</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowImport(!showImport)}>
            BibTeX 가져오기
          </Button>
          <Link href="/admin/publications/new" className={cn(buttonVariants())}>
            새 논문
          </Link>
        </div>
      </div>

      {showImport && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>BibTeX 가져오기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>.bib 파일 업로드</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".bib,.bibtex,text/plain"
                onChange={handleFileUpload}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>또는 BibTeX 직접 입력</Label>
              <Textarea
                rows={8}
                placeholder={"@article{key,\n  title = {논문 제목},\n  author = {저자},\n  ...\n}"}
                value={bibText}
                onChange={(e) => setBibText(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreview} disabled={!bibText.trim()}>
                미리보기
              </Button>
              <Button onClick={handleImport} disabled={importing || preview.length === 0}>
                {importing ? "등록 중..." : `${preview.length}건 등록`}
              </Button>
            </div>
            {importMsg && (
              <p className={`text-sm ${importMsg.includes("등록되었") ? "text-green-600" : "text-destructive"}`}>
                {importMsg}
              </p>
            )}
            {preview.length > 0 && (
              <div className="border rounded-lg overflow-auto max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제목</TableHead>
                      <TableHead>저자</TableHead>
                      <TableHead>게재처</TableHead>
                      <TableHead>연도</TableHead>
                      <TableHead>링크</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((entry, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium max-w-xs truncate">{entry.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{entry.authors}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{entry.venue}</TableCell>
                        <TableCell>{entry.year}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {entry.pdfUrl && <Badge variant="outline" className="text-xs">PDF</Badge>}
                            {entry.doi && <Badge variant="outline" className="text-xs">DOI</Badge>}
                            {entry.codeUrl && <Badge variant="outline" className="text-xs">Code</Badge>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : pubs.length === 0 ? (
        <p className="text-muted-foreground">논문이 없습니다.</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>논문</TableHead>
                <TableHead className="w-16">연도</TableHead>
                <TableHead className="w-32">태그</TableHead>
                <TableHead className="w-24">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pubs.map((pub) => (
                <TableRow key={pub.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <Link href={`/admin/publications/${pub.id}`} className="font-medium hover:text-primary transition-colors">
                        {pub.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{pub.venue}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{pub.year}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        try {
                          const parsed = JSON.parse(pub.tags);
                          return (Array.isArray(parsed) ? parsed : []).map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                          ));
                        } catch { return null; }
                      })()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/publications/${pub.id}`} className="text-sm text-primary hover:underline">수정</Link>
                      <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => handleDelete(pub.id)}>
                        삭제
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
