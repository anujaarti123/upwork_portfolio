import { NextRequest, NextResponse } from "next/server";
import { getSignedMediaUrl } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const signedUrl = await getSignedMediaUrl(path, 3600);

  if (!signedUrl) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Redirect browser/img tag to the signed Supabase URL
  return NextResponse.redirect(signedUrl);
}
