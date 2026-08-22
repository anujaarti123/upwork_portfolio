"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import type { FooterSettings, SocialLink } from "@/types/cms";
import { getIcon } from "@/lib/icons";
import { Separator } from "@/components/ui/separator";

interface FooterSectionProps {
  footer: FooterSettings;
  socialLinks: SocialLink[];
}

export function FooterSection({ footer, socialLinks }: FooterSectionProps) {
  return (
    <footer id="contact" className="py-16 px-6 border-t border-white/10">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            {footer.bio_text && (
              <p className="opacity-70 leading-relaxed">{footer.bio_text}</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[var(--primary-accent)]">Contact</h4>
            {footer.contact_email && (
              <a
                href={`mailto:${footer.contact_email}`}
                className="flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-[var(--primary-accent)] transition-colors mb-2"
              >
                <Mail className="h-4 w-4" />
                {footer.contact_email}
              </a>
            )}
            {footer.contact_phone && (
              <a
                href={`tel:${footer.contact_phone}`}
                className="flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-[var(--primary-accent)] transition-colors"
              >
                <Phone className="h-4 w-4" />
                {footer.contact_phone}
              </a>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[var(--primary-accent)]">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                const Icon = getIcon(link.icon);
                return (
                  <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm opacity-70 hover:opacity-100 hover:border-[var(--primary-accent)]/50 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                    {link.platform}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {footer.copyright_notice && (
          <p className="text-center text-sm opacity-50">{footer.copyright_notice}</p>
        )}
      </div>
    </footer>
  );
}
