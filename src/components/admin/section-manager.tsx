"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/lib/actions/cms";
import { useAdminStore } from "@/stores/admin-store";
import type { SectionLabels, SiteSettings } from "@/types/cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "./file-upload";
import { CmsImage } from "@/components/ui/cms-image";

export function SectionManager() {
  const { data, setIsSaving, showToast } = useAdminStore();
  const [settings, setSettings] = useState<SiteSettings>(data!.settings);

  async function save() {
    setIsSaving(true);
    try {
      await updateSiteSettings(settings);
      showToast("Settings saved — changes live on site");
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  function updateLabels(partial: Partial<SectionLabels>) {
    setSettings({
      ...settings,
      section_labels: { ...settings.section_labels, ...partial },
    });
  }

  const toggles = [
    { key: "show_hero" as const, label: "Hero Section" },
    { key: "show_about" as const, label: "About / Architect Intro" },
    { key: "show_ecosystem" as const, label: "Ecosystem / Portfolio" },
    { key: "show_case_studies" as const, label: "Case Studies" },
    { key: "show_tech_stack" as const, label: "Tech Stack" },
    { key: "show_footer" as const, label: "Footer" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Theme Colors</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: "primary_accent" as const, label: "Primary Accent (Gold)" },
            { key: "secondary_accent" as const, label: "Secondary Accent (Emerald)" },
            { key: "background_color" as const, label: "Background" },
            { key: "text_color" as const, label: "Text Color" },
            { key: "card_fill" as const, label: "Card Fill" },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input
                type="color"
                value={settings[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <Label>Font Family</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-white/10 bg-[var(--card-fill)] px-3 text-sm"
              value={settings.font_family}
              onChange={(e) =>
                setSettings({ ...settings, font_family: e.target.value as "sans" | "mono" })
              }
            >
              <option value="sans">Sans Serif</option>
              <option value="mono">Monospace</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            label="Logo (shown in navbar — use PNG with transparent background)"
            value={settings.logo_url}
            onChange={(url) => setSettings({ ...settings, logo_url: url })}
            folder="branding"
          />
          {settings.logo_url && (
            <div className="rounded-xl border border-white/10 p-4 bg-[var(--card-fill)]">
              <p className="text-xs opacity-60 mb-2">Logo preview</p>
              <CmsImage src={settings.logo_url} alt="Logo preview" width={160} height={48} className="h-12 w-auto object-contain" />
            </div>
          )}
          <FileUpload
            label="Favicon (browser tab icon — 32×32 or 64×64 PNG)"
            value={settings.favicon_url}
            onChange={(url) => setSettings({ ...settings, favicon_url: url })}
            folder="branding"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Section Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {toggles.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label>{label}</Label>
              <Switch
                checked={settings[key]}
                onCheckedChange={(checked) => setSettings({ ...settings, [key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Section Titles</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {[
            { key: "ecosystem_label" as const, label: "Ecosystem Label" },
            { key: "ecosystem_title" as const, label: "Ecosystem Title" },
            { key: "about_label" as const, label: "About Label" },
            { key: "about_title" as const, label: "About Title" },
            { key: "case_studies_label" as const, label: "Case Studies Label" },
            { key: "case_studies_title" as const, label: "Case Studies Title" },
            { key: "tech_stack_label" as const, label: "Tech Stack Label" },
            { key: "tech_stack_title" as const, label: "Tech Stack Title" },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input
                value={settings.section_labels[key]}
                onChange={(e) => updateLabels({ [key]: e.target.value })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={save} size="lg">
        Save All Settings
      </Button>
    </div>
  );
}
