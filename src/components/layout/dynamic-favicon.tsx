"use client";

import { useEffect } from "react";
import { normalizeMediaUrl, toMediaProxyUrl, isSupabaseStorageUrl } from "@/lib/storage";

export function DynamicFavicon({ url }: { url: string | null | undefined }) {
  useEffect(() => {
    const normalized = normalizeMediaUrl(url);
    if (!normalized) return;

    const href =
      isSupabaseStorageUrl(normalized) ? toMediaProxyUrl(normalized)! : normalized;

    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [url]);

  return null;
}
