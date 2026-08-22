"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { HeroMetric, HeroSection, SiteSettings } from "@/types/cms";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { getIcon } from "@/lib/icons";

interface HeroSectionProps {
  hero: HeroSection;
  metrics: HeroMetric[];
  settings: SiteSettings;
}

export function HeroSectionView({ hero, metrics, settings }: HeroSectionProps) {
  const [typedIndex, setTypedIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const texts = useMemo(() => hero.typing_texts ?? [], [hero.typing_texts]);

  useEffect(() => {
    if (texts.length === 0) return;
    const current = texts[typedIndex % texts.length];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(current.slice(0, displayText.length + 1));
          if (displayText === current) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setDisplayText(current.slice(0, displayText.length - 1));
          if (displayText === "") {
            setIsDeleting(false);
            setTypedIndex((i) => (i + 1) % texts.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typedIndex, texts]);

  const hasBanner = !!(hero.background_image_url || hero.background_video_url);
  const textColor = hero.text_color ?? "var(--foreground)";

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ backgroundColor: hero.background_color ?? "var(--background)" }}
    >
      {/* ── 1. HERO TEXT (no banner overlay) ── */}
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center md:text-left md:mx-0"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            style={{ color: textColor }}
          >
            {hero.main_title}
          </h1>

          {hero.subtitle && (
            <p className="text-lg md:text-2xl mb-4 opacity-90" style={{ color: textColor }}>
              {hero.subtitle}
            </p>
          )}

          {texts.length > 0 && (
            <p className="text-xl md:text-2xl font-mono mb-8 text-[var(--secondary-accent)]">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>
          )}

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {hero.cta1_text && hero.cta1_link && (
              <Button asChild size="lg">
                <Link href={hero.cta1_link}>{hero.cta1_text}</Link>
              </Button>
            )}
            {hero.cta2_text && hero.cta2_link && (
              <Button asChild variant="outline" size="lg">
                <Link href={hero.cta2_link}>{hero.cta2_text}</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── 2. BANNER IMAGE / VIDEO (separate block below text) ── */}
      {hasBanner && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mx-auto max-w-7xl px-6 pb-12 md:pb-16"
        >
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 bg-[var(--card-fill)]">
            <div className="relative aspect-[16/7] sm:aspect-[16/6] md:aspect-[21/9] w-full">
              {hero.background_video_url ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-contain bg-black"
                  src={hero.background_video_url}
                />
              ) : (
                <CmsImage
                  src={hero.background_image_url}
                  alt="Hero banner"
                  fill
                  priority
                  className="object-contain bg-[var(--card-fill)]"
                />
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 3. METRICS BAR ── */}
      {metrics.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {metrics.map((metric) => {
              const Icon = getIcon(metric.icon);
              return (
                <div key={metric.id} className="glass-card rounded-2xl p-6 text-center">
                  <Icon className="mx-auto mb-3 h-6 w-6 text-[var(--primary-accent)]" />
                  <div className="text-3xl font-bold text-[var(--primary-accent)]">
                    {metric.value}
                  </div>
                  <div className="text-sm opacity-60 mt-1">{metric.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      )}

      {!hasBanner && metrics.length === 0 && <div className="pb-16" />}
    </section>
  );
}
