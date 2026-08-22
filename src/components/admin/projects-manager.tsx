"use client";

import { useState } from "react";
import { ImagePlus, Plus, Trash2, Video } from "lucide-react";
import {
  deleteProject,
  deleteTechTag,
  upsertProject,
  upsertTechTag,
} from "@/lib/actions/cms";
import { getMediaType } from "@/lib/media";
import { useAdminStore } from "@/stores/admin-store";
import type { Project, ProjectMediaInput, TechStackTag } from "@/types/cms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CmsImage } from "@/components/ui/cms-image";
import { FileUpload } from "./file-upload";

export function ProjectsManager() {
  const { data, setIsSaving, showToast } = useAdminStore();
  const [projects, setProjects] = useState<Project[]>(data!.projects);
  const [tags, setTags] = useState<TechStackTag[]>(data!.techTags);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState<ProjectMediaInput[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newTag, setNewTag] = useState({ name: "", color: "#D4AF37" });

  function startNew() {
    setEditing({
      title: "",
      description: "",
      category: "",
      is_published: true,
      sort_order: projects.length,
    });
    setSelectedTags([]);
    setMediaItems([]);
  }

  function startEdit(project: Project) {
    setEditing(project);
    setSelectedTags(project.tags?.map((t) => t.id) ?? []);
    setMediaItems(
      (project.screenshots ?? []).map((s) => ({
        url: s.url,
        media_type: s.media_type ?? "image",
      }))
    );
  }

  async function saveProject() {
    if (!editing) return;
    setIsSaving(true);
    try {
      await upsertProject({ ...editing, tag_ids: selectedTags, media_items: mediaItems });
      showToast("Project saved");
      setEditing(null);
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeProject(id: string) {
    await deleteProject(id);
    setProjects((p) => p.filter((x) => x.id !== id));
    showToast("Project deleted");
  }

  async function addTag() {
    if (!newTag.name) return;
    await upsertTechTag(newTag);
    setTags([...tags, { ...newTag, id: crypto.randomUUID(), sort_order: tags.length }]);
    setNewTag({ name: "", color: "#D4AF37" });
    showToast("Tag added");
  }

  async function removeTag(id: string) {
    await deleteTechTag(id);
    setTags((t) => t.filter((x) => x.id !== id));
    showToast("Tag deleted");
  }

  function addMediaUrl(url: string) {
    if (!url.trim()) return;
    setMediaItems((prev) => [
      ...prev,
      { url: url.trim(), media_type: getMediaType(url.trim()) },
    ]);
    setNewMediaUrl("");
  }

  function addUploadedMedia(url: string) {
    setMediaItems((prev) => [...prev, { url, media_type: "image" }]);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tech Stack Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-1">
                <Badge color={tag.color}>{tag.name}</Badge>
                <Button size="sm" variant="ghost" onClick={() => removeTag(tag.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Tag name"
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
            />
            <Input
              type="color"
              className="w-16"
              value={newTag.color}
              onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
            />
            <Button onClick={addTag}>Add Tag</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button size="sm" onClick={startNew}>
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between border border-white/5 rounded-xl p-4"
            >
              <div>
                <h4 className="font-semibold">{project.title}</h4>
                <p className="text-sm opacity-60">
                  {project.category} · {(project.screenshots?.length ?? 0) + 1} media
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => startEdit(project)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removeProject(project.id)}>
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
            <CardTitle>{editing.id ? "Edit Project" : "New Project"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
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
                <Label>Category</Label>
                <Input
                  value={editing.category ?? ""}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                />
              </div>
              <div>
                <Label>Live Demo URL</Label>
                <Input
                  value={editing.live_demo_url ?? ""}
                  onChange={(e) => setEditing({ ...editing, live_demo_url: e.target.value })}
                />
              </div>
              <div>
                <Label>Play Store Link</Label>
                <Input
                  value={editing.play_store_link ?? ""}
                  onChange={(e) => setEditing({ ...editing, play_store_link: e.target.value })}
                />
              </div>
            </div>

            <FileUpload
              label="Card Thumbnail"
              value={editing.thumbnail_url ?? null}
              onChange={(url) => setEditing({ ...editing, thumbnail_url: url })}
              folder="projects"
            />

            {/* Multiple Images & Videos */}
            <div className="space-y-3 border border-white/10 rounded-xl p-4">
              <Label className="text-base">Gallery — Images & Videos</Label>
              <p className="text-xs opacity-60">
                Add multiple screenshots, demo videos, YouTube/Loom links. Shown in premium detail view.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {mediaItems.map((item, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video bg-[var(--card-fill)]">
                    {item.media_type === "video" ? (
                      <div className="flex h-full items-center justify-center">
                        <Video className="h-8 w-8 opacity-50" />
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1 rounded">video</span>
                      </div>
                    ) : (
                      <CmsImage src={item.url} alt="" fill className="object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => setMediaItems((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 rounded-full bg-red-600/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Paste image URL, YouTube, Loom, or .mp4 video URL"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMediaUrl(newMediaUrl))}
                />
                <Button type="button" variant="secondary" onClick={() => addMediaUrl(newMediaUrl)}>
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </div>

              <FileUpload
                label="Upload Image to Gallery"
                value={null}
                onChange={addUploadedMedia}
                folder="projects/gallery"
                preview={false}
              />
            </div>

            <div>
              <Label>Tech Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag.id)
                          ? prev.filter((id) => id !== tag.id)
                          : [...prev, tag.id]
                      )
                    }
                    className={`rounded-full px-3 py-1 text-xs border ${
                      selectedTags.includes(tag.id)
                        ? "border-[var(--primary-accent)] bg-[var(--primary-accent)]/20"
                        : "border-white/10"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={editing.is_published ?? true}
                onCheckedChange={(checked) => setEditing({ ...editing, is_published: checked })}
              />
              <Label>Published</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveProject}>Save Project</Button>
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
