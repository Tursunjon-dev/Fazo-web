"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { NotebookText } from "@/components/ui/NotebookText";

const EASE = [0.4, 0, 0.2, 1] as const;

export function ManifestoSection() {
  const t = useTranslations("manifesto");

  return (
    <section
      id="about"
      data-ambient="manifesto"
      className="section-ambient relative overflow-hidden px-4 py-28 md:px-8 md:py-40"
    >
      {/* Parallax abstract blob — driven by ScrollAmbientProvider */}
      <div
        data-parallax="2"
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[600px] w-[600px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(0,194,255,0.5) 0%, rgba(0,80,255,0.2) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24 lg:gap-32">
          {/* Left: Large statement — slight slower drift */}
          <div data-parallax="1">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <h2 className="font-orbitron text-4xl font-bold leading-tight tracking-wide text-[var(--text-primary)] md:text-5xl lg:text-6xl">
                {t("statement")}
              </h2>
              <div className="mt-6 h-px w-16 bg-[var(--accent-cyan)] opacity-60" />
            </motion.div>
          </div>

          {/* Right: Paragraphs */}
          <div className="flex flex-col justify-center gap-6">
            {(["paragraph1", "paragraph2", "paragraph3"] as const).map((key, i) => (
              <NotebookText
                key={key}
                text={t(key)}
                className="text-base leading-relaxed text-[var(--text-secondary)] md:text-lg"
                delayMs={i * 150}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
