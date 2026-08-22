"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project, SectionLabels } from "@/types/cms";
import { CmsImage } from "@/components/ui/cms-image";
import { Badge } from "@/components/ui/badge";
import { ProjectDetailModal } from "@/components/projects/project-detail-modal";

interface EcosystemSectionProps {
  projects: Project[];
  labels: SectionLabels;
}

export function EcosystemSection({ projects, labels }: EcosystemSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (projects.length === 0) return null;

  return (
    <>
      <section id="ecosystem" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="text-[var(--primary-accent)] text-sm font-semibold tracking-widest uppercase">
              {labels.ecosystem_label}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">{labels.ecosystem_title}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const thumb =
                project.thumbnail_url ??
                project.screenshots?.find((s) => s.media_type === "image")?.url;
              const mediaCount =
                (project.screenshots?.length ?? 0) + (project.video_url ? 1 : 0);

              return (
                <motion.button
                  key={project.id}
                  type="button"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedProject(project)}
                  className="group text-left glass-card rounded-2xl overflow-hidden h-full hover:border-[var(--primary-accent)]/50 border border-white/10 transition-all hover:shadow-2xl hover:shadow-[rgba(var(--primary-rgb),0.1)] hover:-translate-y-1"
                >
                  <div className="relative h-52 overflow-hidden bg-[var(--card-fill)]">
                    {thumb ? (
                      <CmsImage
                        src={thumb}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <span className="text-4xl font-bold">{project.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details
                    </div>
                    {mediaCount > 0 && (
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs">
                        {mediaCount} media
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {project.category && (
                      <span className="text-xs text-[var(--secondary-accent)] uppercase tracking-wider">
                        {project.category}
                      </span>
                    )}
                    <div className="flex items-start justify-between gap-2 mt-1">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 text-[var(--primary-accent)] transition-opacity shrink-0" />
                    </div>
                    {project.description && (
                      <p className="text-sm opacity-60 mt-2 line-clamp-2">{project.description}</p>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag.id} color={tag.color}>
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <ProjectDetailModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
