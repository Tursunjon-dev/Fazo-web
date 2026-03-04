"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const EASE = [0.4, 0, 0.2, 1] as const;

const TRUST_KEYS = ["transparent", "milestones", "clarity", "support"] as const;

export function PositioningBlock() {
  const t = useTranslations("positioning");
  const tTrust = useTranslations("trust");

  return (
    <section className="section-ambient px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-5xl text-center">
        {/* Strategic tagline */}
        <motion.p
          className="font-orbitron text-2xl font-semibold tracking-widest text-[var(--text-secondary)] md:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {t("line1")}
        </motion.p>
        <motion.p
          className="mt-3 text-sm tracking-widest text-[var(--text-secondary)] opacity-60 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
        >
          {t("line2")}
        </motion.p>

        {/* Trust micro-signals */}
        <motion.div
          className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {TRUST_KEYS.map((key) => (
            <motion.div
              key={key}
              className="flex flex-col items-center gap-2.5"
              variants={{
                hidden:   { opacity: 0, y: 20 },
                visible:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
              }}
            >
              <CheckCircle2
                className="h-5 w-5 text-[var(--accent-cyan)]"
                strokeWidth={1.5}
              />
              <span className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">
                {tTrust(key)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
