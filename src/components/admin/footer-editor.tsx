"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  deleteSocialLink,
  updateFooterSettings,
  upsertSocialLink,
} from "@/lib/actions/cms";
import { ICON_OPTIONS } from "@/lib/icons";
import { useAdminStore } from "@/stores/admin-store";
import type { FooterSettings, SocialLink } from "@/types/cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function FooterEditor() {
  const { data, setIsSaving, showToast } = useAdminStore();
  const [footer, setFooter] = useState<FooterSettings>(data!.footer);
  const [socials, setSocials] = useState<SocialLink[]>(data!.socialLinks);

  async function saveFooter() {
    setIsSaving(true);
    try {
      await updateFooterSettings(footer);
      showToast("Footer saved");
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveSocial(link: SocialLink) {
    await upsertSocialLink(link);
    showToast("Social link saved");
  }

  async function removeSocial(id: string) {
    await deleteSocialLink(id);
    setSocials((s) => s.filter((x) => x.id !== id));
    showToast("Social link deleted");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Footer Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Bio Text</Label>
            <Textarea
              value={footer.bio_text ?? ""}
              onChange={(e) => setFooter({ ...footer, bio_text: e.target.value })}
            />
          </div>
          <div>
            <Label>Copyright Notice</Label>
            <Input
              value={footer.copyright_notice ?? ""}
              onChange={(e) => setFooter({ ...footer, copyright_notice: e.target.value })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={footer.contact_email ?? ""}
                onChange={(e) => setFooter({ ...footer, contact_email: e.target.value })}
              />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input
                value={footer.contact_phone ?? ""}
                onChange={(e) => setFooter({ ...footer, contact_phone: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={saveFooter}>Save Footer</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Links</CardTitle>
          <Button
            size="sm"
            onClick={() =>
              setSocials([
                ...socials,
                {
                  id: "",
                  platform: "New",
                  url: "",
                  icon: "link",
                  sort_order: socials.length,
                  is_visible: true,
                },
              ])
            }
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {socials.map((link, i) => (
            <div key={link.id || i} className="grid md:grid-cols-5 gap-3 items-end border border-white/5 rounded-xl p-4">
              <div>
                <Label>Platform</Label>
                <Input
                  value={link.platform}
                  onChange={(e) => {
                    const updated = [...socials];
                    updated[i] = { ...link, platform: e.target.value };
                    setSocials(updated);
                  }}
                />
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...socials];
                    updated[i] = { ...link, url: e.target.value };
                    setSocials(updated);
                  }}
                />
              </div>
              <div>
                <Label>Icon</Label>
                <select
                  className="flex h-10 w-full rounded-lg border border-white/10 bg-[var(--card-fill)] px-3 text-sm"
                  value={link.icon}
                  onChange={(e) => {
                    const updated = [...socials];
                    updated[i] = { ...link, icon: e.target.value };
                    setSocials(updated);
                  }}
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={link.is_visible}
                  onCheckedChange={(checked) => {
                    const updated = [...socials];
                    updated[i] = { ...link, is_visible: checked };
                    setSocials(updated);
                  }}
                />
                <Label>Visible</Label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => saveSocial(link)}>
                  Save
                </Button>
                {link.id && (
                  <Button size="sm" variant="destructive" onClick={() => removeSocial(link.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
