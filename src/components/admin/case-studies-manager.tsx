"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { deleteCaseStudy, upsertCaseStudy } from "@/lib/actions/cms";
import { useAdminStore } from "@/stores/admin-store";
import type { CaseStudy } from "@/types/cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./file-upload";

export function CaseStudiesManager() {
  const { data, setIsSaving, showToast } = useAdminStore();
  const [studies, setStudies] = useState<CaseStudy[]>(data!.caseStudies);
  const [editing, setEditing] = useState<Partial<CaseStudy> | null>(null);

  function startNew() {
    setEditing({
      client_name: "",
      title: "",
      is_published: true,
      sort_order: studies.length,
    });
  }

  function startEdit(study: CaseStudy) {
    setEditing(study);
  }

  async function save() {
    if (!editing) return;
    setIsSaving(true);
    try {
      await upsertCaseStudy(editing);
      showToast("Case study saved");
      setEditing(null);
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(id: string) {
    await deleteCaseStudy(id);
    setStudies((s) => s.filter((x) => x.id !== id));
    showToast("Case study deleted");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Case Studies</CardTitle>
          <Button size="sm" onClick={startNew}>
            <Plus className="h-4 w-4" /> New Case Study
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {studies.map((study) => (
            <div
              key={study.id}
              className="flex items-center justify-between border border-white/5 rounded-xl p-4"
            >
              <div>
                <h4 className="font-semibold">{study.client_name}</h4>
                <p className="text-sm opacity-60">{study.title}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => startEdit(study)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(study.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>{editing.id ? "Edit Case Study" : "New Case Study"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={editing.client_name ?? ""}
                  onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Before Text</Label>
                <Textarea
                  value={editing.before_text ?? ""}
                  onChange={(e) => setEditing({ ...editing, before_text: e.target.value })}
                />
              </div>
              <div>
                <Label>After Text</Label>
                <Textarea
                  value={editing.after_text ?? ""}
                  onChange={(e) => setEditing({ ...editing, after_text: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Testimonial Quote</Label>
              <Textarea
                value={editing.testimonial_quote ?? ""}
                onChange={(e) => setEditing({ ...editing, testimonial_quote: e.target.value })}
              />
            </div>
            <FileUpload
              label="Client Logo"
              value={editing.client_logo_url ?? null}
              onChange={(url) => setEditing({ ...editing, client_logo_url: url })}
              folder="branding"
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={editing.is_published ?? true}
                onCheckedChange={(checked) => setEditing({ ...editing, is_published: checked })}
              />
              <Label>Published</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
