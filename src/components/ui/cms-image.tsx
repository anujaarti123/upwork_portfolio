"use client";

import { useMemo, useState } from "react";
import { isSupabaseStorageUrl, normalizeMediaUrl, toMediaProxyUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface CmsImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

function resolveImageSrc(src: string | null | undefined): string | null {
  const normalized = normalizeMediaUrl(src);
  if (!normalized) return null;

  // Route Supabase storage through our proxy (handles private buckets + wrong public URLs)
  if (isSupabaseStorageUrl(normalized)) {
    return toMediaProxyUrl(normalized);
  }

  return normalized;
}

export function CmsImage({
  src,
  alt,
  className,
  width,
  height,
  fill,
  priority,
}: CmsImageProps) {
  const resolved = useMemo(() => resolveImageSrc(src), [src]);
  const [failed, setFailed] = useState(false);

  if (!resolved || failed) {
    return (
      <div
        className={cn(
          "bg-[var(--card-fill)] border border-white/10 flex items-center justify-center",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-xs opacity-40">No image</span>
      </div>
    );
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img
        src={resolved}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      src={resolved}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      width={width}
      height={height}
      className={className}
    />
  );
}
