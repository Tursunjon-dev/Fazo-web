"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Zap, Code2, Handshake } from "lucide-react";

const EASE = [0.4, 0, 0.2, 1] as const;

const VALUES = [
  { key: "innovation", Icon: Zap },
  { key: "precision",  Icon: Code2 },
  { key: "partnership",Icon: Handshake },
] as const;

export function ApproachSection() {
  const t = useTranslations("approach");
  return (
    <section id="approach" data-ambient="approach" className="section-ambient px-4 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          className="font-orbitron text-center text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {t("title")}
        </motion.h2>

        <motion.div
          className="mt-16 grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {VALUES.map(({ key, Icon }) => (
            <motion.div
              key={key}
              className="glass-card p-9"
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
            >
              <Icon className="h-10 w-10 text-[var(--accent-cyan)]" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-5 font-orbitron text-xl font-semibold text-[var(--text-primary)]">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {t(`${key}.body`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
