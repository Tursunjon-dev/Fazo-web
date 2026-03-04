"use client";
import { useRef, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { usePointerCapable } from "@/hooks/usePointerCapable";

const EASE = [0.4, 0, 0.2, 1] as const;

const TEAM = [
  { key: "amir",    initial: "A" },
  { key: "bobur",   initial: "B" },
  { key: "dilnoza", initial: "D" },
] as const;

function MemberCard({
  memberKey, initial, isHovered, isSiblingFocused,
  onEnter, onLeave, pointerFine,
}: {
  memberKey: string; initial: string;
  isHovered: boolean; isSiblingFocused: boolean;
  onEnter: () => void; onLeave: () => void;
  pointerFine: boolean;
}) {
  const t = useTranslations("team");
  const cardRef  = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!pointerFine || !cardRef.current) return;
    const r  = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / r.width;
    const dy = (e.clientY - r.top  - r.height / 2) / r.height;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (innerRef.current)
        innerRef.current.style.transform = `rotateY(${(dx * 0.8).toFixed(2)}deg) rotateX(${(-dy * 0.8).toFixed(2)}deg)`;
      rafRef.current = null;
    });
  }, [pointerFine]);

  const handleLeave = useCallback(() => {
    if (innerRef.current) innerRef.current.style.transform = "";
    onLeave();
  }, [onLeave]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
      style={{
        filter: isSiblingFocused ? "blur(0.8px)" : "blur(0px)",
        opacity: isSiblingFocused ? 0.62 : 1,
        transition: "filter 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div ref={cardRef} className="flex flex-col items-center gap-4 cursor-default" style={{ perspective: "600px" }}
           onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={handleLeave}>
        <div ref={innerRef} style={{ transformStyle: "preserve-3d", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
          <div className="relative">
            <div className="absolute -inset-10 rounded-full pointer-events-none"
                 style={{ background: "radial-gradient(circle, var(--glow-strong) 0%, transparent 65%)", opacity: isHovered ? 0.7 : 0, transition: "opacity 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
            <div className="absolute -inset-3 rounded-full border border-[var(--border-subtle)]"
                 style={{ opacity: isHovered ? 0.9 : 0.6, transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
            <div className="absolute -inset-1.5 rounded-full border border-[var(--border-accent)]"
                 style={{ opacity: isHovered ? 0.9 : 0.4, transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
            <div className="relative h-24 w-24 rounded-full border border-[var(--border-accent)] bg-[var(--surface)] flex items-center justify-center"
                 style={{ boxShadow: isHovered ? "0 0 48px var(--glow-strong)" : "0 0 28px var(--glow)", transition: "box-shadow 0.45s cubic-bezier(0.4,0,0.2,1)" }}>
              <span className="font-orbitron text-2xl font-bold text-[var(--accent-cyan)]">{initial}</span>
            </div>
          </div>
        </div>
        <div className="text-center max-w-[200px]"
             style={{ opacity: isHovered ? 0.7 : 1, transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
          <h3 className="font-orbitron font-semibold text-[var(--text-primary)]">{t(`${memberKey}.name`)}</h3>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{t(`${memberKey}.role`)}</p>
          <p className="mt-1.5 text-xs italic text-[var(--accent-cyan)] opacity-70">&ldquo;{t(`${memberKey}.quote`)}&rdquo;</p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{t(`${memberKey}.about`)}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TeamSection() {
  const t = useTranslations("team");
  const pointerFine = usePointerCapable();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="team" data-ambient="team" className="section-ambient px-4 py-28 md:px-8 md:py-36">
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
        <motion.p
          className="mt-3 text-center text-[var(--text-secondary)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }}
        >
          {TEAM.map(({ key, initial }, i) => (
            <MemberCard
              key={key} memberKey={key} initial={initial}
              isHovered={hoveredIdx === i}
              isSiblingFocused={hoveredIdx !== null && hoveredIdx !== i}
              onEnter={() => setHoveredIdx(i)}
              onLeave={() => setHoveredIdx(null)}
              pointerFine={pointerFine}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
