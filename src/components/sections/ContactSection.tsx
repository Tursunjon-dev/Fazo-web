"use client";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Loader2 } from "lucide-react";

const EASE = [0.4, 0, 0.2, 1] as const;
const SERVICE_KEYS = ["web", "backend", "android", "ios", "smm"] as const;
const PHONE_PREFIX = "+998 ";

/* ── Phone mask helpers ─────────────────────────────────────────── */
function formatPhone(raw: string): string {
  // Strip everything except digits after the prefix
  const digits = raw.replace(/\D/g, "").slice(3); // remove 998 if present
  const d = digits.slice(0, 9);
  let out = PHONE_PREFIX;
  if (d.length > 0) out += d.slice(0, 2);
  if (d.length > 2) out += " " + d.slice(2, 5);
  if (d.length > 5) out += " " + d.slice(5, 7);
  if (d.length > 7) out += " " + d.slice(7, 9);
  return out;
}

function stripPhone(val: string): string {
  return val.replace(/\D/g, "");
}

/* ── Floating label field ────────────────────────────────────────── */
interface FloatFieldProps {
  id: string;
  label: string;
  value: string;
  type?: string;
  hasError?: boolean;
  children?: React.ReactNode;
  onChange: (v: string) => void;
}

function FloatField({ id, label, value, type = "text", hasError, onChange, children }: FloatFieldProps) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <motion.div
      className="relative"
      animate={hasError ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 z-10 origin-left transition-all duration-300"
        style={{
          top: floated ? "8px" : "50%",
          transform: floated ? "translateY(0) scale(0.78)" : "translateY(-50%) scale(1)",
          color: focused ? "var(--accent-cyan)" : "var(--text-secondary)",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </label>
      {children ?? (
        <input
          id={id}
          type={type}
          value={value}
          inputMode={type === "tel" ? "numeric" : undefined}
          autoComplete={type === "tel" ? "tel" : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="input-glass w-full pb-2 pt-6"
          style={{
            borderColor: hasError
              ? "rgba(248,113,113,0.6)"
              : focused
              ? "var(--border-accent)"
              : undefined,
            boxShadow: focused
              ? "0 0 0 2px rgba(0,194,255,0.18)"
              : hasError
              ? "0 0 0 2px rgba(248,113,113,0.2)"
              : undefined,
          }}
        />
      )}
    </motion.div>
  );
}

/* ── Custom Glass Dropdown ───────────────────────────────────────── */
interface DropdownProps {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  hasError?: boolean;
  onChange: (v: string) => void;
}

function GlassDropdown({ value, placeholder, options, hasError, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const floated = value.length > 0;

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label
        className="pointer-events-none absolute left-4 z-10 origin-left transition-all duration-300"
        style={{
          top: floated || open ? "8px" : "50%",
          transform: floated || open ? "translateY(0) scale(0.78)" : "translateY(-50%) scale(1)",
          color: focused || open ? "var(--accent-cyan)" : "var(--text-secondary)",
          fontSize: "0.875rem",
        }}
      >
        {placeholder}
      </label>
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setFocused(true); }}
        onBlur={() => { if (!open) setFocused(false); }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="input-glass flex w-full items-center justify-between pb-2 pt-6 text-left"
        style={{
          borderColor: hasError
            ? "rgba(248,113,113,0.6)"
            : open
            ? "var(--border-accent)"
            : undefined,
          boxShadow: open ? "0 0 0 2px rgba(0,194,255,0.18)" : undefined,
        }}
      >
        <span className={selected ? "text-[var(--text-primary)]" : "opacity-0"}>
          {selected?.label ?? "\u00A0"}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25, ease: EASE }}>
          <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, scaleY: 0.92, y: -4 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.92, y: -4 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-[var(--border-subtle)] py-1"
            style={{
              background: "rgba(20,10,58,0.92)",
              backdropFilter: "blur(16px)",
              transformOrigin: "top",
            }}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); setFocused(false); }}
                className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors"
                style={{
                  color: value === opt.value ? "var(--accent-cyan)" : "var(--text-secondary)",
                  background: value === opt.value ? "rgba(0,194,255,0.06)" : undefined,
                }}
              >
                <span className="hover:text-[var(--text-primary)]">{opt.label}</span>
                {value === opt.value && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── FloatTextarea ───────────────────────────────────────────────── */
function FloatTextarea({ id, label, value, hasError, onChange }: Omit<FloatFieldProps, "type" | "children">) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <motion.div
      className="relative"
      animate={hasError ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 z-10 origin-left transition-all duration-300"
        style={{
          top: floated ? "8px" : "16px",
          transform: floated ? "translateY(0) scale(0.78)" : "scale(1)",
          color: focused ? "var(--accent-cyan)" : "var(--text-secondary)",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="input-glass w-full resize-none pb-3 pt-7"
        style={{
          borderColor: hasError
            ? "rgba(248,113,113,0.6)"
            : focused
            ? "var(--border-accent)"
            : undefined,
          boxShadow: focused
            ? "0 0 0 2px rgba(0,194,255,0.18)"
            : undefined,
        }}
      />
    </motion.div>
  );
}

/* ── Main ContactSection ─────────────────────────────────────────── */
export function ContactSection() {
  const t  = useTranslations("contact");
  const tS = useTranslations("services");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", phone: PHONE_PREFIX, service: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, boolean>>>({});

  const serviceOptions = SERVICE_KEYS.map((k) => ({ value: k, label: tS(`${k}.title`) }));

  const setField = useCallback(<K extends keyof typeof form>(key: K, val: (typeof form)[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  }, [errors]);

  const handlePhoneChange = (raw: string) => {
    if (!raw.startsWith("+998")) { setField("phone", PHONE_PREFIX); return; }
    setField("phone", formatPhone(raw));
  };

  const validate = () => {
    const e: Partial<Record<keyof typeof form, boolean>> = {};
    if (!form.name.trim()) e.name = true;
    const digits = stripPhone(form.phone);
    if (digits.length < 12) e.phone = true; // 998 + 9 digits
    if (!form.service) e.service = true;
    if (!form.message.trim()) e.message = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: stripPhone(form.phone) }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: PHONE_PREFIX, service: "", message: "" });
      } else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section id="contact" data-ambient="contact" className="section-ambient px-4 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          className="font-orbitron text-center text-3xl font-bold tracking-wide text-[var(--text-primary)] md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {t("title")}
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="glass-card mt-12 space-y-5 p-8 md:p-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          noValidate
        >
          <FloatField
            id="name" label={t("name")} value={form.name} hasError={errors.name}
            onChange={(v) => setField("name", v)}
          />

          <FloatField
            id="phone" label={t("phone")} type="tel" value={form.phone} hasError={errors.phone}
            onChange={handlePhoneChange}
          />

          <GlassDropdown
            value={form.service}
            placeholder={t("service")}
            options={serviceOptions}
            hasError={errors.service}
            onChange={(v) => setField("service", v)}
          />

          <FloatTextarea
            id="message" label={t("message")} value={form.message} hasError={errors.message}
            onChange={(v) => setField("message", v)}
          />

          <AnimatePresence mode="wait">
            {status === "success" && (
              <motion.p
                key="success"
                className="flex items-center justify-center gap-2 text-sm text-[var(--accent-cyan)]"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                <Check className="h-4 w-4" strokeWidth={2} />
                {t("success")}
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                key="error"
                className="text-center text-sm text-red-400"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                {t("error")}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="btn-glass flex w-full items-center justify-center gap-2 text-[var(--text-primary)] disabled:opacity-40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {status === "loading" ? (
              <><Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} /> {t("submit")}</>
            ) : status === "success" ? (
              <><Check className="h-4 w-4" strokeWidth={2} /> {t("success")}</>
            ) : t("submit")}
          </motion.button>

          <p className="mt-2 text-center text-xs tracking-wide text-[var(--text-secondary)] opacity-50">
            {t("trustLine")}
          </p>
        </motion.form>
      </div>
    </section>
  );
}
