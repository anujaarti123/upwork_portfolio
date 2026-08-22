"use client";

import { motion } from "framer-motion";
import type { SectionLabels, TechStackTag } from "@/types/cms";
import { Badge } from "@/components/ui/badge";

interface TechStackSectionProps {
  tags: TechStackTag[];
  labels: SectionLabels;
}

export function TechStackSection({ tags, labels }: TechStackSectionProps) {
  if (tags.length === 0) return null;

  return (
    <section id="tech-stack" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-[var(--primary-accent)] text-sm font-semibold tracking-widest uppercase">
            {labels.tech_stack_label}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">{labels.tech_stack_title}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {tags.map((tag, i) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Badge
                color={tag.color}
                className="text-base px-6 py-3 cursor-default"
              >
                {tag.name}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
