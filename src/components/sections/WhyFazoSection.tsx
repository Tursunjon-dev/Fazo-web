"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const EASE = [0.4, 0, 0.2, 1] as const;

export function WhyFazoSection() {
  const t = useTranslations("why");

  const items = [0, 1, 2, 3, 4].map((i) => ({
    label: t(`items.${i}.label`),
    body:  t(`items.${i}.body`),
  }));

  return (
    <section
      data-ambient="approach"
      className="section-ambient px-4 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-orbitron text-center text-2xl font-semibold tracking-wide text-[var(--text-primary)] md:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {t("title")}
        </motion.h2>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        >
          {items.map(({ label, body }, i) => (
            <motion.div
              key={i}
              className="glass-card relative overflow-hidden p-6"
              variants={{
                hidden:   { opacity: 0, y: 32 },
                visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              <div
                className="mb-4 h-0.5 w-8"
                style={{ background: "linear-gradient(90deg, var(--accent-cyan), transparent)" }}
              />
              <h3 className="font-orbitron text-sm font-semibold leading-snug text-[var(--text-primary)]">
                {label}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
