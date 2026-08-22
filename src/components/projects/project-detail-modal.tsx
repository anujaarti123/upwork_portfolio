"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Play, Smartphone } from "lucide-react";
import type { Project } from "@/types/cms";
import { getVideoEmbedUrl } from "@/lib/media";
import { CmsImage } from "@/components/ui/cms-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

function getAllMedia(project: Project) {
  const items: { url: string; media_type: "image" | "video" }[] = [];

  if (project.thumbnail_url) {
    items.push({ url: project.thumbnail_url, media_type: "image" });
  }

  (project.screenshots ?? []).forEach((s) => {
    if (!items.some((i) => i.url === s.url)) {
      items.push({ url: s.url, media_type: s.media_type ?? "image" });
    }
  });

  if (project.video_url && !items.some((i) => i.url === project.video_url)) {
    items.push({ url: project.video_url!, media_type: "video" });
  }

  return items;
}

export function ProjectDetailModal({ project, open, onClose }: ProjectDetailModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [project?.id]);

  if (!project) return null;

  const media = getAllMedia(project);
  const current = media[activeIndex];
  const embedUrl = current?.media_type === "video" ? getVideoEmbedUrl(current.url) : null;

  function prev() {
    setActiveIndex((i) => (i === 0 ? media.length - 1 : i - 1));
  }

  function next() {
    setActiveIndex((i) => (i === media.length - 1 ? 0 : i + 1));
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-6xl p-0 overflow-y-auto">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Media Gallery */}
          <div className="relative bg-black min-h-[320px] lg:min-h-[520px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {current?.media_type === "video" && embedUrl ? (
                  embedUrl.match(/\.(mp4|webm|ogg|mov)/i) ? (
                    <video
                      src={embedUrl}
                      controls
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={embedUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                ) : current ? (
                  <CmsImage src={current.url} alt={project.title} fill className="object-contain" />
                ) : (
                  <div className="flex h-full items-center justify-center opacity-40">
                    <Play className="h-16 w-16" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {media.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-black/80 transition-colors z-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-black/80 transition-colors z-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {media.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 z-10">
                {media.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-14 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeIndex
                        ? "border-[var(--primary-accent)] scale-105"
                        : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {item.media_type === "video" ? (
                      <div className="h-full w-full bg-[var(--card-fill)] flex items-center justify-center">
                        <Play className="h-5 w-5" />
                      </div>
                    ) : (
                      <CmsImage src={item.url} alt="" width={80} height={56} className="h-full w-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="p-8 lg:p-10 flex flex-col">
            {project.category && (
              <span className="text-xs text-[var(--secondary-accent)] uppercase tracking-widest font-semibold">
                {project.category}
              </span>
            )}
            <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">{project.title}</h2>

            {project.description && (
              <p className="text-base opacity-70 leading-relaxed mb-6">{project.description}</p>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <Badge key={tag.id} color={tag.color}>
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-auto flex flex-wrap gap-3">
              {project.live_demo_url && project.live_demo_url !== "#" && (
                <Button asChild size="lg">
                  <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                </Button>
              )}
              {project.play_store_link && project.play_store_link !== "#" && (
                <Button asChild variant="outline" size="lg">
                  <a href={project.play_store_link} target="_blank" rel="noopener noreferrer">
                    <Smartphone className="h-4 w-4" /> Play Store
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
