"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  deleteHeroMetric,
  updateHeroSection,
  upsertHeroMetric,
} from "@/lib/actions/cms";
import { ICON_OPTIONS } from "@/lib/icons";
import { useAdminStore } from "@/stores/admin-store";
import type { HeroMetric, HeroSection } from "@/types/cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "./file-upload";
import { CmsImage } from "@/components/ui/cms-image";

export function HeroEditor() {
  const { data, setIsSaving, showToast } = useAdminStore();
  const [hero, setHero] = useState<HeroSection>(data!.hero);
  const [metrics, setMetrics] = useState<HeroMetric[]>(data!.metrics);

  async function saveHero() {
    setIsSaving(true);
    try {
      await updateHeroSection(hero);
      showToast("Hero section saved");
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveMetric(metric: HeroMetric) {
    setIsSaving(true);
    try {
      await upsertHeroMetric(metric);
      showToast("Metric saved");
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeMetric(id: string) {
    await deleteHeroMetric(id);
    setMetrics((m) => m.filter((x) => x.id !== id));
    showToast("Metric deleted");
  }

  return (
    <div className="space-y-6">
      {/* Main Banner Section */}
      <Card>
        <CardHeader>
          <CardTitle>Main Banner Image / Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm opacity-60">
            Banner displays in a separate section below the hero text (not as background overlay).
            Upload a wide banner (1920×1080 recommended).
          </p>
          {hero.background_image_url && (
            <div className="relative h-48 md:h-64 rounded-xl overflow-hidden border border-white/10">
              <CmsImage
                src={hero.background_image_url}
                alt="Banner preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <FileUpload
            label="Banner Image"
            value={hero.background_image_url}
            onChange={(url) => setHero({ ...hero, background_image_url: url, background_video_url: null })}
            folder="banners"
          />
          <div>
            <Label>Banner Video URL (optional — overrides image)</Label>
            <Input
              value={hero.background_video_url ?? ""}
              onChange={(e) =>
                setHero({ ...hero, background_video_url: e.target.value || null })
              }
              placeholder="https://example.com/hero-video.mp4"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Main Title</Label>
            <Input
              value={hero.main_title}
              onChange={(e) => setHero({ ...hero, main_title: e.target.value })}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={hero.subtitle ?? ""}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            />
          </div>
          <div>
            <Label>Typing Texts (comma-separated)</Label>
            <Input
              value={hero.typing_texts.join(", ")}
              onChange={(e) =>
                setHero({
                  ...hero,
                  typing_texts: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>CTA 1 Text</Label>
              <Input
                value={hero.cta1_text ?? ""}
                onChange={(e) => setHero({ ...hero, cta1_text: e.target.value })}
              />
            </div>
            <div>
              <Label>CTA 1 Link</Label>
              <Input
                value={hero.cta1_link ?? ""}
                onChange={(e) => setHero({ ...hero, cta1_link: e.target.value })}
              />
            </div>
            <div>
              <Label>CTA 2 Text</Label>
              <Input
                value={hero.cta2_text ?? ""}
                onChange={(e) => setHero({ ...hero, cta2_text: e.target.value })}
              />
            </div>
            <div>
              <Label>CTA 2 Link</Label>
              <Input
                value={hero.cta2_link ?? ""}
                onChange={(e) => setHero({ ...hero, cta2_link: e.target.value })}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Background Color</Label>
              <Input
                type="color"
                value={hero.background_color ?? "#0A0A0C"}
                onChange={(e) => setHero({ ...hero, background_color: e.target.value })}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <Input
                type="color"
                value={hero.text_color ?? "#F5F5F5"}
                onChange={(e) => setHero({ ...hero, text_color: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={saveHero}>Save Hero</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Metrics Bar</CardTitle>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              setMetrics([
                ...metrics,
                { id: "", label: "New Metric", value: "0", icon: "star", sort_order: metrics.length },
              ])
            }
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.map((metric, i) => (
            <div key={metric.id || i} className="grid md:grid-cols-5 gap-3 items-end border border-white/5 rounded-xl p-4">
              <div>
                <Label>Label</Label>
                <Input
                  value={metric.label}
                  onChange={(e) => {
                    const updated = [...metrics];
                    updated[i] = { ...metric, label: e.target.value };
                    setMetrics(updated);
                  }}
                />
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  value={metric.value}
                  onChange={(e) => {
                    const updated = [...metrics];
                    updated[i] = { ...metric, value: e.target.value };
                    setMetrics(updated);
                  }}
                />
              </div>
              <div>
                <Label>Icon</Label>
                <select
                  className="flex h-10 w-full rounded-lg border border-white/10 bg-[var(--card-fill)] px-3 text-sm"
                  value={metric.icon}
                  onChange={(e) => {
                    const updated = [...metrics];
                    updated[i] = { ...metric, icon: e.target.value };
                    setMetrics(updated);
                  }}
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <Button size="sm" onClick={() => saveMetric(metric)}>
                Save
              </Button>
              {metric.id && (
                <Button size="sm" variant="destructive" onClick={() => removeMetric(metric.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
