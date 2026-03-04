"use client";
import { useRef, useCallback, useEffect, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Globe, Server, Smartphone, Apple, Share2 } from "lucide-react";
import { usePointerCapable } from "@/hooks/usePointerCapable";

const EASE = [0.4, 0, 0.2, 1] as const;

const PANELS = [
  { key: "web",     Icon: Globe,      num: "01", delay: 0    },
  { key: "backend", Icon: Server,     num: "02", delay: 0.08 },
  { key: "android", Icon: Smartphone, num: "03", delay: 0.16 },
  { key: "ios",     Icon: Apple,      num: "04", delay: 0.22 },
  { key: "smm",     Icon: Share2,     num: "05", delay: 0.28 },
] as const;

interface PanelProps {
  Icon: React.ElementType; num: string; title: string;
  intro: string; bullets: string[]; delay: number; pointerFine: boolean;
}

function ServicePanel({ Icon, num, title, intro, bullets, delay, pointerFine }: PanelProps) {
  const outerRef  = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const glowRef   = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number | null>(null);
  const pendRef   = useRef<{ dx: number; dy: number; cx: number; cy: number } | null>(null);
  const [glowOn, setGlowOn] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!pointerFine || !outerRef.current) return;
    const r = outerRef.current.getBoundingClientRect();
    pendRef.current = {
      dx: (e.clientX - r.left - r.width  / 2) / r.width,
      dy: (e.clientY - r.top  - r.height / 2) / r.height,
      cx: (e.clientX - r.left) / r.width,
      cy: (e.clientY - r.top)  / r.height,
    };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        const p = pendRef.current;
        if (p && innerRef.current && glowRef.current) {
          innerRef.current.style.transform =
            `rotateY(${(p.dx * 1.5).toFixed(2)}deg) rotateX(${(-p.dy * 1.5).toFixed(2)}deg)`;
          innerRef.current.style.boxShadow =
            `${(-p.dx * 20).toFixed(1)}px ${(-p.dy * 20).toFixed(1)}px 40px rgba(0,0,0,0.35), 0 8px 32px var(--glow)`;
          glowRef.current.style.setProperty("--cursor-x", p.cx.toFixed(3));
          glowRef.current.style.setProperty("--cursor-y", p.cy.toFixed(3));
        }
        rafRef.current = null; pendRef.current = null;
      });
    }
    if (!glowOn) setGlowOn(true);
  }, [pointerFine, glowOn]);

  const onLeave = useCallback(() => {
    if (innerRef.current) { innerRef.current.style.transform = ""; innerRef.current.style.boxShadow = ""; }
    setGlowOn(false);
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <motion.div
      ref={outerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="service-panel-outer h-full"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={innerRef} className="service-panel-inner relative flex h-full min-h-[240px] flex-col overflow-hidden p-7">
        <div ref={glowRef} className="panel-glow-overlay" style={{ opacity: glowOn ? 1 : 0 } as CSSProperties} />
        <span className="font-orbitron text-xs tracking-[0.2em] text-[var(--text-secondary)] opacity-50 select-none">{num}</span>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2, ease: EASE }}
        >
          <Icon className="mt-4 h-9 w-9 text-[var(--accent-cyan)]" strokeWidth={1.5} aria-hidden />
        </motion.div>
        <h3 className="mt-4 font-orbitron text-lg font-semibold leading-snug text-[var(--text-primary)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{intro}</p>
        <ul className="mt-4 space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-cyan)] opacity-70" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const t = useTranslations("services");
  const pointerFine = usePointerCapable();

  return (
    <section id="services" data-ambient="services" className="section-ambient px-4 py-28 md:px-8 md:py-36">
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

        <div className="mt-16 flex flex-col gap-5">
          {/* Row 1: 55/45 asymmetric */}
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="md:w-[55%]">
              <ServicePanel
                Icon={PANELS[0].Icon} num={PANELS[0].num} delay={PANELS[0].delay}
                title={t("web.title")} intro={t("web.intro")}
                bullets={[t("web.bullet1"), t("web.bullet2"), t("web.bullet3")]}
                pointerFine={pointerFine}
              />
            </div>
            <div className="md:w-[45%]">
              <ServicePanel
                Icon={PANELS[1].Icon} num={PANELS[1].num} delay={PANELS[1].delay}
                title={t("backend.title")} intro={t("backend.intro")}
                bullets={[t("backend.bullet1"), t("backend.bullet2"), t("backend.bullet3")]}
                pointerFine={pointerFine}
              />
            </div>
          </div>
          {/* Row 2: three equal with mid offset */}
          <div className="flex flex-col gap-5 md:flex-row">
            {(["android", "ios", "smm"] as const).map((key, ri) => {
              const p = PANELS.find((x) => x.key === key)!;
              return (
                <div key={key} className={`md:flex-1${ri === 1 ? " md:mt-6" : ""}`}>
                  <ServicePanel
                    Icon={p.Icon} num={p.num} delay={p.delay}
                    title={t(`${key}.title`)} intro={t(`${key}.intro`)}
                    bullets={[t(`${key}.bullet1`), t(`${key}.bullet2`), t(`${key}.bullet3`)]}
                    pointerFine={pointerFine}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
