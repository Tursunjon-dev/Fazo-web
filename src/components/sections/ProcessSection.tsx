"use client";
import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView, useAnimation, useMotionValue, useMotionValueEvent, animate } from "framer-motion";

const EASE = [0.4, 0, 0.2, 1] as const;
const STEPS = ["idea", "design", "development", "launch"] as const;
const S_PATH = "M 100 0 C 40 200, 160 400, 100 500 C 40 600, 160 700, 100 800";

export function ProcessSection() {
  const t = useTranslations("process");
  const sectionRef  = useRef<HTMLDivElement>(null);
  const svgPathRef  = useRef<SVGPathElement>(null);
  const particleRef = useRef<SVGCircleElement>(null);
  const glowDotRef  = useRef<SVGCircleElement>(null);
  const progressMV  = useMotionValue(0);
  const pathControls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  useEffect(() => {
    if (!isInView) return;
    pathControls.start({ pathLength: 1, transition: { duration: 2, ease: EASE } });
    const anim = animate(progressMV, 1, { duration: 2, ease: EASE });
    return () => anim.stop();
  }, [isInView, pathControls, progressMV]);

  useMotionValueEvent(progressMV, "change", (latest) => {
    const path = svgPathRef.current;
    if (!path) return;
    const pt = path.getPointAtLength(latest * path.getTotalLength());
    if (latest > 0.01) {
      particleRef.current?.setAttribute("opacity", "1");
      glowDotRef.current?.setAttribute("opacity", "1");
    }
    particleRef.current?.setAttribute("cx", pt.x.toFixed(1));
    particleRef.current?.setAttribute("cy", pt.y.toFixed(1));
    glowDotRef.current?.setAttribute("cx", pt.x.toFixed(1));
    glowDotRef.current?.setAttribute("cy", pt.y.toFixed(1));
  });

  return (
    <section id="process" data-ambient="process" className="section-ambient px-4 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="font-orbitron text-center text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {t("title")}
        </motion.h2>

        <div ref={sectionRef} className="relative mt-20">
          {/* SVG arc — desktop only */}
          <div className="absolute inset-0 hidden md:block pointer-events-none" aria-hidden>
            <svg className="absolute left-1/2 top-0 -translate-x-1/2 overflow-visible" width="200" height="100%" viewBox="0 0 200 800" preserveAspectRatio="none">
              <defs>
                <filter id="proc-glow" filterUnits="userSpaceOnUse" x="-30" y="-30" width="260" height="860">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="dot-glow" filterUnits="userSpaceOnUse" x="-30" y="-30" width="260" height="860">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path d={S_PATH} stroke="rgba(0,194,255,0.08)" strokeWidth="1" fill="none" />
              <motion.path d={S_PATH} stroke="rgba(0,194,255,0.3)" strokeWidth="10" fill="none" filter="url(#proc-glow)" initial={{ pathLength: 0 }} animate={pathControls} />
              <motion.path ref={svgPathRef} d={S_PATH} stroke="rgba(0,194,255,0.9)" strokeWidth="1.5" fill="none" initial={{ pathLength: 0 }} animate={pathControls} />
              <circle ref={glowDotRef} r="9" fill="rgba(0,194,255,0.35)" cx="100" cy="0" opacity="0" filter="url(#dot-glow)" />
              <circle ref={particleRef} r="3.5" fill="#00C2FF" cx="100" cy="0" opacity="0" />
            </svg>
          </div>

          {/* Mobile line */}
          <div className="absolute left-1/2 top-2 h-[calc(100%-1rem)] w-px -translate-x-1/2 overflow-hidden md:hidden" aria-hidden>
            <motion.div
              className="h-full w-full"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(0,194,255,0.5) 40%, rgba(0,194,255,0.5) 60%, transparent)", transformOrigin: "top" }}
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 0.45 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
            />
          </div>

          {/* Step cards */}
          <div className="flex flex-col gap-16 md:gap-24">
            {STEPS.map((step, i) => (
              <motion.div
                key={step}
                className={`flex flex-col md:flex-row items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                initial={{ opacity: 0.4, y: 4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
              >
                <div className={`w-full md:flex-1 flex ${i % 2 === 0 ? "justify-center md:justify-end md:pr-10" : "justify-center md:justify-start md:pl-10"}`}>
                  <div className="glass-card inline-flex flex-col gap-2 px-8 py-6 max-w-sm">
                    <span className="font-orbitron text-xs tracking-widest text-[var(--text-secondary)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-orbitron text-xl font-bold text-[var(--accent-cyan)]">
                      {t(`${step}.title`)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {t(`${step}.desc`)}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block md:w-[200px] flex-shrink-0" />
                <div className="hidden md:block md:flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
