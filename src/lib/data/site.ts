import { createClient } from "@/lib/supabase/server";
import type { Project, SiteData, TechStackTag } from "@/types/cms";
import { normalizeMediaUrl } from "@/lib/storage";
import { DEFAULT_SITE_DATA } from "./defaults";

export const REVALIDATE_SECONDS = 60;

function normalizeSettings(raw: Record<string, unknown>) {
  return {
    ...DEFAULT_SITE_DATA.settings,
    ...raw,
    section_labels: {
      ...DEFAULT_SITE_DATA.settings.section_labels,
      ...((raw.section_labels as object) ?? {}),
    },
  };
}

function mapProjects(projectsRes: { data: unknown[] | null }): Project[] {
  return (projectsRes.data ?? []).map((raw) => {
    const p = raw as Record<string, unknown>;
    const screenshots = ((p.project_screenshots as Project["screenshots"]) ?? []).map((s) => ({
      ...s,
      media_type: ((s as { media_type?: string }).media_type ?? "image") as "image" | "video",
    }));
    const tags = ((p.project_tags as Array<{ tech_stack_tags: TechStackTag }>) ?? [])
      .map((pt) => pt.tech_stack_tags)
      .filter(Boolean);

    return {
      id: p.id as string,
      title: p.title as string,
      description: p.description as string | null,
      category: p.category as string | null,
      play_store_link: p.play_store_link as string | null,
      live_demo_url: p.live_demo_url as string | null,
      thumbnail_url: p.thumbnail_url as string | null,
      video_url: p.video_url as string | null,
      sort_order: p.sort_order as number,
      is_published: p.is_published as boolean,
      screenshots,
      tags,
    };
  });
}

function normalizeSettingsUrls(settings: ReturnType<typeof normalizeSettings>) {
  return {
    ...settings,
    logo_url: normalizeMediaUrl(settings.logo_url),
    favicon_url: normalizeMediaUrl(settings.favicon_url),
  };
}

export async function getSiteData(): Promise<SiteData | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await createClient();

  const [
    settingsRes,
    heroRes,
    metricsRes,
    projectsRes,
    caseStudiesRes,
    techTagsRes,
    footerRes,
    socialRes,
  ] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).single(),
    supabase.from("hero_section").select("*").limit(1).single(),
    supabase.from("hero_metrics").select("*").order("sort_order"),
    supabase
      .from("projects")
      .select("*, project_screenshots(*), project_tags(tag_id, tech_stack_tags(*))")
      .eq("is_published", true)
      .order("sort_order"),
    supabase
      .from("case_studies")
      .select("*")
      .eq("is_published", true)
      .order("sort_order"),
    supabase.from("tech_stack_tags").select("*").order("sort_order"),
    supabase.from("footer_settings").select("*").limit(1).single(),
    supabase
      .from("social_links")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order"),
  ]);

  if (settingsRes.error || heroRes.error) return null;

  return {
    settings: normalizeSettingsUrls(normalizeSettings(settingsRes.data)),
    hero: {
      ...heroRes.data,
      typing_texts: heroRes.data.typing_texts ?? [],
      background_image_url: normalizeMediaUrl(heroRes.data.background_image_url),
      background_video_url: heroRes.data.background_video_url,
    },
    metrics: metricsRes.data ?? [],
    projects: mapProjects(projectsRes),
    caseStudies: caseStudiesRes.data ?? [],
    techTags: techTagsRes.data ?? [],
    footer: footerRes.data ?? DEFAULT_SITE_DATA.footer,
    socialLinks: socialRes.data ?? [],
  };
}

export async function getAdminSiteData(): Promise<SiteData | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await createClient();

  const [
    settingsRes,
    heroRes,
    metricsRes,
    projectsRes,
    caseStudiesRes,
    techTagsRes,
    footerRes,
    socialRes,
  ] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).single(),
    supabase.from("hero_section").select("*").limit(1).single(),
    supabase.from("hero_metrics").select("*").order("sort_order"),
    supabase
      .from("projects")
      .select("*, project_screenshots(*), project_tags(tag_id, tech_stack_tags(*))")
      .order("sort_order"),
    supabase.from("case_studies").select("*").order("sort_order"),
    supabase.from("tech_stack_tags").select("*").order("sort_order"),
    supabase.from("footer_settings").select("*").limit(1).single(),
    supabase.from("social_links").select("*").order("sort_order"),
  ]);

  if (settingsRes.error || heroRes.error) return null;

  return {
    settings: normalizeSettingsUrls(normalizeSettings(settingsRes.data)),
    hero: {
      ...heroRes.data,
      typing_texts: heroRes.data.typing_texts ?? [],
      background_image_url: normalizeMediaUrl(heroRes.data.background_image_url),
      background_video_url: heroRes.data.background_video_url,
    },
    metrics: metricsRes.data ?? [],
    projects: mapProjects(projectsRes),
    caseStudies: caseStudiesRes.data ?? [],
    techTags: techTagsRes.data ?? [],
    footer: footerRes.data ?? DEFAULT_SITE_DATA.footer,
    socialLinks: socialRes.data ?? [],
  };
}
