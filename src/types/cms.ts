export interface SectionLabels {
  ecosystem_label: string;
  ecosystem_title: string;
  case_studies_label: string;
  case_studies_title: string;
  tech_stack_label: string;
  tech_stack_title: string;
  nav_links: { href: string; label: string }[];
}

export interface SiteSettings {
  id: string;
  primary_accent: string;
  secondary_accent: string;
  background_color: string;
  text_color: string;
  card_fill: string;
  font_family: "sans" | "mono";
  logo_url: string | null;
  favicon_url: string | null;
  show_hero: boolean;
  show_ecosystem: boolean;
  show_case_studies: boolean;
  show_tech_stack: boolean;
  show_footer: boolean;
  section_labels: SectionLabels;
  updated_at: string;
}

export interface HeroSection {
  id: string;
  main_title: string;
  subtitle: string | null;
  typing_texts: string[];
  background_image_url: string | null;
  background_video_url: string | null;
  background_color: string | null;
  text_color: string | null;
  cta1_text: string | null;
  cta1_link: string | null;
  cta2_text: string | null;
  cta2_link: string | null;
  updated_at: string;
}

export interface HeroMetric {
  id: string;
  label: string;
  value: string;
  icon: string;
  sort_order: number;
}

export interface TechStackTag {
  id: string;
  name: string;
  color: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  play_store_link: string | null;
  live_demo_url: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  sort_order: number;
  is_published: boolean;
  screenshots?: ProjectScreenshot[];
  tags?: TechStackTag[];
}

export interface ProjectScreenshot {
  id: string;
  project_id: string;
  url: string;
  media_type: "image" | "video";
  sort_order: number;
}

export interface ProjectMediaInput {
  url: string;
  media_type: "image" | "video";
}

export interface CaseStudy {
  id: string;
  client_name: string;
  title: string;
  description: string | null;
  before_text: string | null;
  after_text: string | null;
  testimonial_quote: string | null;
  client_logo_url: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface FooterSettings {
  id: string;
  bio_text: string | null;
  copyright_notice: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
  is_visible: boolean;
}

export interface SiteData {
  settings: SiteSettings;
  hero: HeroSection;
  metrics: HeroMetric[];
  projects: Project[];
  caseStudies: CaseStudy[];
  techTags: TechStackTag[];
  footer: FooterSettings;
  socialLinks: SocialLink[];
}
