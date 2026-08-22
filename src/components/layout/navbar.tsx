"use client";

import Link from "next/link";
import type { SiteSettings } from "@/types/cms";
import { CmsImage } from "@/components/ui/cms-image";

interface NavbarProps {
  settings: SiteSettings;
}

const sectionVisibility: Record<string, keyof SiteSettings> = {
  "#ecosystem": "show_ecosystem",
  "#case-studies": "show_case_studies",
  "#tech-stack": "show_tech_stack",
  "#contact": "show_footer",
};

export function Navbar({ settings }: NavbarProps) {
  const navLinks = settings.section_labels?.nav_links ?? [];
  const visibleLinks = navLinks.filter((link) => {
    const key = sectionVisibility[link.href];
    return key ? settings[key] : true;
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[var(--background)]/70 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          {settings.logo_url ? (
            <CmsImage
              src={settings.logo_url}
              alt="Logo"
              width={140}
              height={40}
              className="h-10 w-auto max-w-[140px] object-contain object-left"
              priority
            />
          ) : (
            <div className="h-9 w-9 rounded-lg bg-[var(--primary-accent)] shrink-0" />
          )}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {visibleLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--primary-accent)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
