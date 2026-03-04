"use client";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => <div className="absolute inset-0 -z-10 bg-[#0B0324]" /> }
);

const EASE = [0.4, 0, 0.2, 1] as const;

function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.h1
      className="font-orbitron max-w-4xl text-4xl font-bold tracking-wide text-[var(--text-primary)] md:text-5xl lg:text-6xl"
      aria-label={text}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 26, filter: "blur(10px)", transform: "translateZ(-200px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", transform: "translateZ(0px)" }}
          transition={{ duration: 0.8, delay: 0.75 + i * 0.15, ease: EASE }}
          style={{ marginRight: i === words.length - 1 ? 0 : "0.35ch" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function GlassButton({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <motion.a
      href={href}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border px-7 py-3.5 text-sm font-medium text-[var(--text-primary)]"
      style={{
        background: "var(--surface)", backdropFilter: "blur(12px)",
        borderColor: primary ? "rgba(0,194,255,0.45)" : "rgba(0,194,255,0.22)",
      }}
      whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(0,194,255,0.22)" }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="absolute inset-0 -translate-x-full rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
      <span className="relative">{children}</span>
    </motion.a>
  );
}

export function HeroSection() {
  const t = useTranslations("hero");
  return (
    <section data-ambient="hero" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      <HeroScene />

      {/* Logo centered absolutely */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
      >
        <Image
          src="/fazo-logo.svg"
          alt="FAZO"
          width={260}
          height={260}
          className="w-[160px] md:w-[220px] lg:w-[260px] h-auto drop-shadow-[0_0_24px_rgba(0,194,255,0.3)]"
          priority
        />
      </motion.div>

      {/* Text content below logo */}
      <div className="relative z-20 mt-52 flex flex-col items-center text-center md:mt-64 lg:mt-72">
        <AnimatedHeadline text={t("headline")} />

        <motion.p
          className="mt-4 max-w-xl text-base tracking-widest text-[var(--text-secondary)] md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
        >
          {t("subheadline")}
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.0, ease: EASE }}
        >
          <GlassButton href="#contact" primary>{t("ctaStart")}</GlassButton>
          <GlassButton href="#contact">{t("ctaContact")}</GlassButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.8 }}
      >
        <motion.div
          className="h-10 w-px bg-gradient-to-b from-transparent to-[var(--accent-cyan)]"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: EASE }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
