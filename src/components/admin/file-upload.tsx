"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { uploadFile } from "@/lib/actions/cms";
import { normalizeMediaUrl } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CmsImage } from "@/components/ui/cms-image";

interface FileUploadProps {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  preview?: boolean;
}

export function FileUpload({
  label,
  value,
  onChange,
  folder = "uploads",
  accept = "image/*",
  preview = true,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const { url } = await uploadFile(formData);
      onChange(normalizeMediaUrl(url) ?? url);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL or upload"
        />
        <Button type="button" variant="secondary" size="icon" onClick={() => inputRef.current?.click()}>
          <Upload className="h-4 w-4" />
        </Button>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleUpload} />
      </div>
      {preview && value && accept.startsWith("image") && (
        <CmsImage src={value} alt="" width={120} height={80} className="rounded-lg object-cover border border-white/10" />
      )}
    </div>
  );
}
