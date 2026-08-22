"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  deleteAboutHighlight,
  updateAboutSection,
  upsertAboutHighlight,
} from "@/lib/actions/cms";
import { useAdminStore } from "@/stores/admin-store";
import type { AboutHighlight, AboutSection } from "@/types/cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./file-upload";
import { CmsImage } from "@/components/ui/cms-image";

export function AboutEditor() {
  const { data, setIsSaving, showToast } = useAdminStore();
  const [about, setAbout] = useState<AboutSection>(data!.about);
  const [highlights, setHighlights] = useState<AboutHighlight[]>(data!.aboutHighlights);

  async function saveAbout() {
    setIsSaving(true);
    try {
      await updateAboutSection(about);
      showToast("About section saved");
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveHighlight(highlight: AboutHighlight) {
    setIsSaving(true);
    try {
      await upsertAboutHighlight(highlight);
      showToast("Highlight saved");
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeHighlight(id: string) {
    await deleteAboutHighlight(id);
    setHighlights((h) => h.filter((x) => x.id !== id));
    showToast("Highlight deleted");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile & Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={about.full_name}
                onChange={(e) => setAbout({ ...about, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Role / Designation Tagline</Label>
              <Input
                value={about.role_tagline ?? ""}
                onChange={(e) => setAbout({ ...about, role_tagline: e.target.value })}
                placeholder="Jewellery ERP Architect • Full-Stack Engineer"
              />
            </div>
          </div>

          <FileUpload
            label="Profile Photo"
            value={about.profile_photo_url}
            onChange={(url) => setAbout({ ...about, profile_photo_url: url })}
            folder="branding"
          />
          {about.profile_photo_url && (
            <div className="rounded-xl border border-white/10 p-4 bg-[var(--card-fill)] inline-block">
              <p className="text-xs opacity-60 mb-2">Profile preview</p>
              <CmsImage
                src={about.profile_photo_url}
                alt="Profile preview"
                width={120}
                height={120}
                className="h-28 w-28 rounded-full object-cover ring-2 ring-[var(--primary-accent)]/50"
              />
            </div>
          )}

          <div>
            <Label>Availability Status</Label>
            <Input
              value={about.availability_status ?? ""}
              onChange={(e) => setAbout({ ...about, availability_status: e.target.value })}
              placeholder="Available for Architecture & Consulting"
            />
          </div>

          <div>
            <Label>Personal Bio / Introduction</Label>
            <Textarea
              rows={6}
              value={about.bio ?? ""}
              onChange={(e) => setAbout({ ...about, bio: e.target.value })}
              placeholder="Describe your domain expertise, architecture background, and consulting focus..."
            />
          </div>

          <Button onClick={saveAbout}>Save About Section</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Profile Links</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {[
            { key: "linkedin_url" as const, label: "LinkedIn URL" },
            { key: "upwork_url" as const, label: "Upwork URL" },
            { key: "github_url" as const, label: "GitHub URL" },
            { key: "whatsapp_url" as const, label: "WhatsApp URL (wa.me/...)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input
                value={about[key] ?? ""}
                onChange={(e) => setAbout({ ...about, [key]: e.target.value })}
                placeholder="https://"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <Button onClick={saveAbout}>Save Social Links</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Key Achievement Highlights</CardTitle>
          <Button
            size="sm"
            onClick={() =>
              setHighlights([
                ...highlights,
                { id: "", label: "New Highlight", sort_order: highlights.length },
              ])
            }
          >
            <Plus className="h-4 w-4" /> Add Highlight
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {highlights.map((item, i) => (
            <div
              key={item.id || i}
              className="flex flex-wrap gap-3 items-end border border-white/5 rounded-xl p-4"
            >
              <div className="flex-1 min-w-[200px]">
                <Label>Metric Pill Label</Label>
                <Input
                  value={item.label}
                  onChange={(e) => {
                    const updated = [...highlights];
                    updated[i] = { ...item, label: e.target.value };
                    setHighlights(updated);
                  }}
                  placeholder="100+ Active Users"
                />
              </div>
              <div className="w-24">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={item.sort_order}
                  onChange={(e) => {
                    const updated = [...highlights];
                    updated[i] = { ...item, sort_order: parseInt(e.target.value, 10) || 0 };
                    setHighlights(updated);
                  }}
                />
              </div>
              <Button size="sm" onClick={() => saveHighlight(item)}>
                Save
              </Button>
              {item.id && (
                <Button size="sm" variant="destructive" onClick={() => removeHighlight(item.id)}>
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
