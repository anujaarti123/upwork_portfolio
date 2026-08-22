"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { CaseStudy, SectionLabels } from "@/types/cms";
import { Card, CardContent } from "@/components/ui/card";
import { CmsImage } from "@/components/ui/cms-image";

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
  labels: SectionLabels;
}

export function CaseStudiesSection({ caseStudies, labels }: CaseStudiesSectionProps) {
  if (caseStudies.length === 0) return null;

  return (
    <section id="case-studies" className="py-24 px-6 bg-[var(--card-fill)]/30">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-[var(--secondary-accent)] text-sm font-semibold tracking-widest uppercase">
            {labels.case_studies_label}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">{labels.case_studies_title}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    {study.client_logo_url && (
                      <CmsImage
                        src={study.client_logo_url}
                        alt={study.client_name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{study.client_name}</h3>
                      <p className="text-sm text-[var(--primary-accent)]">{study.title}</p>
                    </div>
                  </div>

                  {study.description && (
                    <p className="opacity-70 mb-6">{study.description}</p>
                  )}

                  {(study.before_text || study.after_text) && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {study.before_text && (
                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                          <span className="text-xs uppercase text-red-400 font-semibold">
                            Before
                          </span>
                          <p className="text-sm mt-2 opacity-80">{study.before_text}</p>
                        </div>
                      )}
                      {study.after_text && (
                        <div className="rounded-xl bg-[var(--secondary-accent)]/10 border border-[var(--secondary-accent)]/20 p-4">
                          <span className="text-xs uppercase text-[var(--secondary-accent)] font-semibold">
                            After
                          </span>
                          <p className="text-sm mt-2 opacity-80">{study.after_text}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {study.testimonial_quote && (
                    <blockquote className="relative border-l-2 border-[var(--primary-accent)] pl-4 italic opacity-80">
                      <Quote className="absolute -left-1 -top-1 h-4 w-4 text-[var(--primary-accent)]" />
                      &ldquo;{study.testimonial_quote}&rdquo;
                    </blockquote>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
