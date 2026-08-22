"use client";

import { motion } from "framer-motion";
import { Briefcase, Code2, Link, MessageCircle } from "lucide-react";
import type { AboutHighlight, AboutSection, SectionLabels } from "@/types/cms";
import { CmsImage } from "@/components/ui/cms-image";

interface AboutSectionProps {
  about: AboutSection;
  highlights: AboutHighlight[];
  labels: SectionLabels;
}

const socialConfig = [
  { key: "linkedin_url" as const, label: "LinkedIn", icon: Link },
  { key: "upwork_url" as const, label: "Upwork", icon: Briefcase },
  { key: "github_url" as const, label: "GitHub", icon: Code2 },
  { key: "whatsapp_url" as const, label: "WhatsApp", icon: MessageCircle },
];

export function AboutSectionView({ about, highlights, labels }: AboutSectionProps) {
  const socials = socialConfig.filter(({ key }) => about[key]);

  return (
    <section id="about" className="py-20 md:py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10 text-center md:text-left"
        >
          <span className="text-[var(--secondary-accent)] text-sm font-semibold tracking-widest uppercase">
            {labels.about_label}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{labels.about_title}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-accent)]/5 via-transparent to-[var(--secondary-accent)]/5 pointer-events-none" />

          <div className="relative grid lg:grid-cols-[minmax(280px,340px)_1fr] gap-10 lg:gap-14 p-8 md:p-12 lg:p-14">
            {/* Left column — profile */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative mb-6">
                <div className="absolute -inset-2 rounded-full bg-[var(--primary-accent)]/20 blur-xl" />
                <div className="relative h-44 w-44 md:h-52 md:w-52 rounded-full p-1 bg-gradient-to-br from-[var(--primary-accent)] via-[#F5E6A8] to-[var(--primary-accent)] shadow-[0_0_40px_rgba(212,175,55,0.35)]">
                  <div className="h-full w-full rounded-full overflow-hidden bg-[var(--card-fill)] border-2 border-[var(--background)]">
                    {about.profile_photo_url ? (
                      <CmsImage
                        src={about.profile_photo_url}
                        alt={about.full_name}
                        width={208}
                        height={208}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-[var(--primary-accent)]">
                        {about.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {about.availability_status && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--secondary-accent)]/40 bg-[var(--secondary-accent)]/10 px-4 py-1.5 text-xs md:text-sm font-medium text-[var(--secondary-accent)] mb-5"
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--secondary-accent)] animate-pulse" />
                  {about.availability_status}
                </motion.span>
              )}

              {socials.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {socials.map(({ key, label, icon: Icon }, i) => (
                    <motion.a
                      key={key}
                      href={about[key]!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[var(--foreground)]/80 hover:border-[var(--primary-accent)]/50 hover:text-[var(--primary-accent)] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              )}
            </div>

            {/* Right column — bio & highlights */}
            <div className="flex flex-col justify-center">
              <motion.h3
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
              >
                {about.full_name}
              </motion.h3>

              {about.role_tagline && (
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.22 }}
                  className="inline-flex self-start rounded-lg border border-[var(--primary-accent)]/30 bg-[var(--primary-accent)]/10 px-4 py-2 text-sm md:text-base text-[var(--primary-accent)] mb-6"
                >
                  {about.role_tagline}
                </motion.p>
              )}

              {about.bio && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.28 }}
                  className="text-base md:text-lg leading-relaxed opacity-85 mb-8 max-w-2xl"
                >
                  {about.bio}
                </motion.p>
              )}

              {highlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {highlights.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 + i * 0.07 }}
                      whileHover={{ scale: 1.03, borderColor: "rgba(212,175,55,0.5)" }}
                      className="cursor-default rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm md:text-base font-medium backdrop-blur-sm transition-all hover:bg-[var(--primary-accent)]/10 hover:shadow-[0_0_24px_rgba(212,175,55,0.15)]"
                    >
                      <span className="text-[var(--primary-accent)] mr-2">◆</span>
                      {item.label}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
