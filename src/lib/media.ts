export type MediaType = "image" | "video";

export function isVideoUrl(url: string): boolean {
  if (/youtube\.com|youtu\.be|vimeo\.com|loom\.com/i.test(url)) return true;
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;

  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return url;

  return null;
}

export function getMediaType(url: string, fallback: MediaType = "image"): MediaType {
  return isVideoUrl(url) ? "video" : fallback;
}
