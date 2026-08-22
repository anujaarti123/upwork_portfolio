import { createAdminClient } from "@/lib/supabase/admin";

/** Extract bucket-relative path from a Supabase storage URL */
export function extractStoragePath(url: string): string | null {
  const match = url.match(/\/storage\/v1\/object\/(?:public|sign)\/cms-assets\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function isSupabaseStorageUrl(url: string): boolean {
  return url.includes(".supabase.co/storage/") && url.includes("/cms-assets/");
}

/** Build a local proxy URL that always works (uses service role on server) */
export function toMediaProxyUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const path = extractStoragePath(normalizeMediaUrl(url) ?? url);
  if (!path) return url;
  return `/api/media?path=${encodeURIComponent(path)}`;
}

/** Server-side: create a signed URL (works even if bucket is private) */
export async function getSignedMediaUrl(path: string, expiresIn = 3600): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from("cms-assets")
      .createSignedUrl(path, expiresIn);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}

/**
 * Fix known typos in Supabase storage URLs.
 * Maps all typo variants to the working project ID.
 */
export function normalizeMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  return url
    .replace(/uyjhaezattmfspwhxwufh/g, "ujhaezaftmfzpwhxwufh")
    .replace(/ujhaezattmfspwhxwufh/g, "ujhaezaftmfzpwhxwufh")
    .replace(/ujhaezattmfzpwhxwufh/g, "ujhaezaftmfzpwhxwufh")
    .replace(/ujhaezftmfzpwhxwufh/g, "ujhaezaftmfzpwhxwufh");
}
