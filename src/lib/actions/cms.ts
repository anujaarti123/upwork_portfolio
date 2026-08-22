"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeMediaUrl } from "@/lib/storage";
import type {
  AboutHighlight,
  AboutSection,
  CaseStudy,
  FooterSettings,
  HeroMetric,
  HeroSection,
  Project,
  ProjectMediaInput,
  SiteSettings,
  SocialLink,
  TechStackTag,
} from "@/types/cms";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return supabase;
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  const supabase = await requireAuth();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .single();

  const { error } = await supabase
    .from("site_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", existing!.id);

  if (error) throw new Error(error.message);
  revalidateAll();
  return { success: true };
}

export async function updateHeroSection(data: Partial<HeroSection>) {
  const supabase = await requireAuth();
  const { data: existing } = await supabase
    .from("hero_section")
    .select("id")
    .limit(1)
    .single();

  const { error } = await supabase
    .from("hero_section")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", existing!.id);

  if (error) throw new Error(error.message);
  revalidateAll();
  return { success: true };
}

export async function upsertHeroMetric(metric: Partial<HeroMetric> & { id?: string }) {
  const supabase = await requireAuth();

  if (metric.id) {
    const { error } = await supabase
      .from("hero_metrics")
      .update(metric)
      .eq("id", metric.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("hero_metrics").insert(metric);
    if (error) throw new Error(error.message);
  }

  revalidateAll();
  return { success: true };
}

export async function deleteHeroMetric(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("hero_metrics").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  return { success: true };
}

export async function upsertProject(
  project: Partial<Project> & { tag_ids?: string[]; media_items?: ProjectMediaInput[] },
  screenshotUrls?: string[]
) {
  const supabase = await requireAuth();
  const { tag_ids, media_items, id, ...rest } = project;

  // Only columns that exist on the projects table — strip nested relations
  const projectData = {
    title: rest.title,
    description: rest.description,
    category: rest.category,
    play_store_link: rest.play_store_link,
    live_demo_url: rest.live_demo_url,
    thumbnail_url: rest.thumbnail_url,
    video_url: rest.video_url,
    sort_order: rest.sort_order,
    is_published: rest.is_published,
  };

  let projectId = id;

  if (projectId) {
    const { error } = await supabase
      .from("projects")
      .update({ ...projectData, updated_at: new Date().toISOString() })
      .eq("id", projectId);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert(projectData)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    projectId = data.id;
  }

  if (tag_ids !== undefined) {
    await supabase.from("project_tags").delete().eq("project_id", projectId);
    if (tag_ids.length > 0) {
      const { error } = await supabase.from("project_tags").insert(
        tag_ids.map((tag_id) => ({ project_id: projectId, tag_id }))
      );
      if (error) throw new Error(error.message);
    }
  }

  if (media_items !== undefined) {
    await supabase.from("project_screenshots").delete().eq("project_id", projectId);
    if (media_items.length > 0) {
      const rows = media_items.map((item, i) => ({
        project_id: projectId,
        url: item.url,
        media_type: item.media_type,
        sort_order: i,
      }));
      const { error } = await supabase.from("project_screenshots").insert(rows);
      if (error) {
        // Fallback if media_type column not migrated yet
        if (error.message.includes("media_type")) {
          const { error: fallbackError } = await supabase.from("project_screenshots").insert(
            media_items.map((item, i) => ({
              project_id: projectId,
              url: item.url,
              sort_order: i,
            }))
          );
          if (fallbackError) throw new Error(fallbackError.message);
        } else {
          throw new Error(error.message);
        }
      }
    }
  } else if (screenshotUrls !== undefined) {
    await supabase.from("project_screenshots").delete().eq("project_id", projectId);
    if (screenshotUrls.length > 0) {
      const { error } = await supabase.from("project_screenshots").insert(
        screenshotUrls.map((url, i) => ({
          project_id: projectId,
          url,
          sort_order: i,
        }))
      );
      if (error) throw new Error(error.message);
    }
  }

  revalidateAll();
  return { success: true, id: projectId };
}

export async function deleteProject(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  return { success: true };
}

export async function upsertCaseStudy(study: Partial<CaseStudy> & { id?: string }) {
  const supabase = await requireAuth();

  if (study.id) {
    const { error } = await supabase
      .from("case_studies")
      .update({ ...study, updated_at: new Date().toISOString() })
      .eq("id", study.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("case_studies").insert(study);
    if (error) throw new Error(error.message);
  }

  revalidateAll();
  return { success: true };
}

export async function deleteCaseStudy(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  return { success: true };
}

export async function upsertTechTag(tag: Partial<TechStackTag> & { id?: string }) {
  const supabase = await requireAuth();

  if (tag.id) {
    const { error } = await supabase.from("tech_stack_tags").update(tag).eq("id", tag.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("tech_stack_tags").insert(tag);
    if (error) throw new Error(error.message);
  }

  revalidateAll();
  return { success: true };
}

export async function deleteTechTag(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("tech_stack_tags").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  return { success: true };
}

export async function updateAboutSection(data: Partial<AboutSection>) {
  const supabase = await requireAuth();
  const { data: existing } = await supabase
    .from("about_section")
    .select("id")
    .limit(1)
    .single();

  if (!existing) {
    const { error } = await supabase.from("about_section").insert({
      ...data,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("about_section")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  }

  revalidateAll();
  return { success: true };
}

export async function upsertAboutHighlight(
  highlight: Partial<AboutHighlight> & { id?: string }
) {
  const supabase = await requireAuth();

  if (highlight.id) {
    const { error } = await supabase
      .from("about_highlights")
      .update(highlight)
      .eq("id", highlight.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("about_highlights").insert(highlight);
    if (error) throw new Error(error.message);
  }

  revalidateAll();
  return { success: true };
}

export async function deleteAboutHighlight(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("about_highlights").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  return { success: true };
}

export async function updateFooterSettings(data: Partial<FooterSettings>) {
  const supabase = await requireAuth();
  const { data: existing } = await supabase
    .from("footer_settings")
    .select("id")
    .limit(1)
    .single();

  const { error } = await supabase
    .from("footer_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", existing!.id);

  if (error) throw new Error(error.message);
  revalidateAll();
  return { success: true };
}

export async function upsertSocialLink(link: Partial<SocialLink> & { id?: string }) {
  const supabase = await requireAuth();

  if (link.id) {
    const { error } = await supabase.from("social_links").update(link).eq("id", link.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("social_links").insert(link);
    if (error) throw new Error(error.message);
  }

  revalidateAll();
  return { success: true };
}

export async function deleteSocialLink(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  return { success: true };
}

export async function uploadFile(formData: FormData) {
  const supabase = await requireAuth();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("cms-assets")
    .upload(fileName, file, { upsert: true });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("cms-assets").getPublicUrl(fileName);

  // Return URL as-is from Supabase — do NOT rewrite the project subdomain
  return { url: normalizeMediaUrl(publicUrl) ?? publicUrl };
}

export async function signIn(email: string, password: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("your-project")) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  } catch (err) {
    if (err instanceof Error && err.message === "fetch failed") {
      throw new Error(
        "Cannot reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL in .env.local matches your project (https://YOUR_ID.supabase.co), then restart the dev server."
      );
    }
    throw err;
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
  return { success: true };
}
