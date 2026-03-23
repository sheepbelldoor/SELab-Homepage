"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setConfig(data);
          setBannerUrl(data.bannerUrl || null);
        }
      });
  }, []);

  async function handleSaveConfig(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const body: Record<string, string | null> = {};
    form.forEach((val, key) => { body[key] = val as string; });
    body.bannerUrl = bannerUrl;

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await fetch("/api/settings/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      }),
    });

    if (res.ok) {
      setPwMsg("비밀번호가 변경되었습니다.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      const data = await res.json();
      setPwMsg(data.error || "비밀번호 변경에 실패했습니다.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">사이트 설정</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveConfig} className="max-w-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="labName">연구실 이름</Label>
                <Input id="labName" name="labName" defaultValue={config.labName || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">한 줄 소개</Label>
                <Input id="tagline" name="tagline" defaultValue={config.tagline || ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">연구실 설명</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={config.description || ""} />
            </div>

            <ImageUpload
              value={bannerUrl}
              onChange={setBannerUrl}
              label="메인 배너 이미지"
            />

            <div className="space-y-2">
              <Label htmlFor="joinUsContent">Join Us 내용</Label>
              <Textarea id="joinUsContent" name="joinUsContent" rows={5} defaultValue={config.joinUsContent || ""} />
            </div>

            <Separator />

            <h3 className="font-semibold">연락처 / 위치</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input id="address" name="address" defaultValue={config.address || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building">건물/호실</Label>
                <Input id="building" name="building" defaultValue={config.building || ""} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" name="email" defaultValue={config.email || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input id="phone" name="phone" defaultValue={config.phone || ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapUrl">지도 URL (Google Maps embed)</Label>
              <Input id="mapUrl" name="mapUrl" defaultValue={config.mapUrl || ""} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "저장 중..." : "저장"}
              </Button>
              {saved && <span className="text-sm text-green-600">저장되었습니다.</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">현재 비밀번호</Label>
              <Input id="currentPassword" type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input id="newPassword" type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
              <Input id="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required />
            </div>
            {pwMsg && <p className={`text-sm ${pwMsg.includes("변경되었") ? "text-green-600" : "text-destructive"}`}>{pwMsg}</p>}
            <Button type="submit">변경</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
