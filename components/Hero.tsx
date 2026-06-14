"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BadgeIndianRupee,
  Clock4,
  Star,
  MapPin,
  Users,
  CheckCircle2,
  ArrowDown,
} from "lucide-react";
import BookingForm from "./BookingForm";
import { useSite } from "./SiteProvider";

const PERK_ICONS = [BadgeIndianRupee, ShieldCheck, Clock4, Star];

function tokenize(headline: string): { word: string; shimmer: boolean }[] {
  const out: { word: string; shimmer: boolean }[] = [];
  headline.split(/\*([^*]+)\*/g).forEach((part, i) => {
    part
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({ word: w, shimmer: i % 2 === 1 }));
  });
  return out;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function TaxiSvg() {
  return (
    <svg viewBox="0 0 120 48" className="h-10 w-auto" fill="none" aria-hidden>
      <rect x="14" y="18" width="92" height="18" rx="9" fill="var(--brand-400)" />
      <path d="M30 19c3-8 10-12 22-12h14c12 0 19 4 24 12H30z" fill="var(--brand-400)" />
      <path d="M36 18c2.5-6 7-9 14-9h4v9H36zm24-9h6c7 0 11 3 14 9H60V9z" fill="#0b1020" opacity=".85" />
      <rect x="52" y="2" width="16" height="7" rx="2" fill="#0b1020" />
      <text x="54.5" y="7.6" fontSize="5.2" fontWeight="bold" fill="var(--brand-400)">
        TAXI
      </text>
      <circle cx="34" cy="38" r="7.5" fill="#0b1020" stroke="#475569" strokeWidth="2" />
      <circle cx="34" cy="38" r="3" fill="#94a3b8" />
      <circle cx="88" cy="38" r="7.5" fill="#0b1020" stroke="#475569" strokeWidth="2" />
      <circle cx="88" cy="38" r="3" fill="#94a3b8" />
      <rect x="104" y="22" width="5" height="5" rx="1.5" fill="#fff7d6" />
      <rect x="13" y="22" width="4" height="5" rx="1.5" fill="#f87171" />
    </svg>
  );
}

export default function Hero() {
  const { site, hero, stats } = useSite();
  const words = tokenize(hero.headline);

  const trustItems = [
    { icon: MapPin, value: stats[0]?.value ?? 500, suffix: stats[0]?.suffix ?? "+", label: stats[0]?.label ?? "Cities" },
    { icon: Users, value: stats[1]?.value ?? 10000, suffix: stats[1]?.suffix ?? "+", label: stats[1]?.label ?? "Happy Customers" },
    { icon: Star, value: stats[2]?.value ?? 4, suffix: stats[2]?.suffix ?? ".8", label: stats[2]?.label ?? "Star Rating" },
  ];

  const hasImage = !!hero.heroImage;

  return (
    <section className={`relative isolate ${hasImage ? "text-white" : ""}`}>
      {/* ── Background ── */}
      {/* "screen": fills viewport height (cover). "content": shows full image at top, section height driven by content. */}
      <div className={`pointer-events-none absolute -z-10 overflow-hidden ${hero.heroImageFit === "content" ? "inset-0" : "inset-x-0 top-0 h-screen"}`}>
        {hero.heroImage ? (
          <>
            <img
              src={hero.heroImage}
              alt=""
              fetchPriority="high"
              className="h-full w-full object-cover object-center"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[var(--page-bg)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
          </>
        ) : (
          <div className="hero-car-bg absolute inset-0 opacity-[0.035] dark:opacity-[0.04]" />
        )}
        {/* Gradient blobs */}
        <div className="animate-blob absolute -left-40 -top-20 size-[500px] rounded-full bg-brand-400/15 blur-[100px] dark:bg-brand-400/10" />
        <div className="animate-blob absolute -right-20 top-32 size-[400px] rounded-full bg-indigo-400/12 blur-[100px] [animation-delay:-6s] dark:bg-indigo-500/10" />
        <div className="animate-blob absolute bottom-0 left-1/3 size-[350px] rounded-full bg-purple-400/8 blur-[80px] [animation-delay:-3s] dark:bg-purple-500/6" />
        {/* Top spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.05),transparent_50%)]" />
        {/* Right-side car glow */}
        <div className="absolute -right-10 top-1/4 hidden h-[400px] w-[500px] bg-[radial-gradient(ellipse,rgba(251,191,36,0.06),transparent_70%)] lg:block dark:bg-[radial-gradient(ellipse,rgba(251,191,36,0.04),transparent_70%)]" />
        {/* Grid overlay */}
        <div className="hero-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      {/* ── Hero Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top section: Headline + Booking side by side on desktop */}
        <div className="grid items-start gap-8 pt-28 sm:pt-36 lg:grid-cols-[1fr_1.2fr] lg:gap-10 xl:gap-12">
          {/* Left: Copy */}
          <div className="pt-2 lg:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-400/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:border-brand-400/30 dark:text-brand-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
                </span>
                {site.tagline}
              </span>
            </motion.div>

            <h1 className="font-display mt-5 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:mt-7 sm:text-5xl sm:leading-[1.08] lg:text-[3.4rem] lg:leading-[1.06] xl:text-[3.8rem]">
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className={`mr-2.5 inline-block sm:mr-3.5 ${w.shimmer ? "text-shimmer" : ""}`}
                >
                  {w.word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`mt-4 max-w-lg text-[13px] leading-relaxed sm:mt-6 sm:text-[15px] sm:leading-relaxed ${hasImage ? "text-slate-200" : "text-slate-600 dark:text-slate-400"}`}
            >
              {hero.description}
            </motion.p>

            {/* Perk badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95 }}
              className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5"
            >
              {hero.perks.map((label, i) => {
                const Icon = PERK_ICONS[i % PERK_ICONS.length];
                return (
                  <div
                    key={`${label}-${i}`}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm transition hover:border-brand-400/40 hover:bg-brand-400/5 sm:px-3.5 sm:py-2 sm:text-xs ${hasImage ? "border-white/15 bg-black/30 text-white/90" : "border-slate-900/8 bg-white/60 text-slate-700 dark:border-white/8 dark:bg-white/5 dark:text-slate-300"}`}
                  >
                    <Icon className="size-3.5 text-brand-500 dark:text-brand-400" />
                    {label}
                  </div>
                );
              })}
            </motion.div>

            {/* Trust counters — desktop only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className={`mt-8 hidden items-center gap-6 border-t pt-7 lg:flex xl:gap-8 ${hasImage ? "border-white/15" : "border-slate-900/8 dark:border-white/8"}`}
            >
              {trustItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-400/10 text-brand-600 dark:text-brand-400">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-extrabold leading-none xl:text-2xl">
                      <AnimatedCounter target={item.value} suffix={item.suffix} />
                    </p>
                    <p className={`mt-0.5 text-[11px] font-medium ${hasImage ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>{item.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Scroll indicator — desktop only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-10 hidden items-center gap-2 text-[11px] font-medium text-slate-400 lg:flex"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown className="size-3.5" />
              </motion.div>
              Scroll to explore
            </motion.div>
          </div>

          {/* Right: Booking form */}
          <div className="flex justify-center lg:justify-end">
            <BookingForm />
          </div>
        </div>

        {/* Trust counters — mobile/tablet only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 lg:hidden"
        >
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="glass flex flex-col items-center gap-1.5 rounded-2xl px-2 py-4 text-center"
            >
              <item.icon className="size-5 text-brand-500 dark:text-brand-400" />
              <p className="font-display text-lg font-extrabold sm:text-xl">
                <AnimatedCounter target={item.value} suffix={item.suffix} />
              </p>
              <p className="text-[10px] font-medium leading-tight text-slate-500 sm:text-[11px] dark:text-slate-400">
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Checklist strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl border px-5 py-3.5 text-[11px] font-semibold backdrop-blur-sm sm:mt-10 sm:gap-x-8 sm:text-xs ${hasImage ? "border-white/10 bg-black/25 text-white/80" : "border-slate-900/6 bg-white/40 text-slate-600 dark:border-white/6 dark:bg-white/[0.03] dark:text-slate-400"}`}
        >
          {["No Hidden Charges", "Verified Drivers", "Instant Confirmation", "Pay Driver Directly"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-green-500 dark:text-green-400" />
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Animated road ── */}
      <div className="relative mt-8 h-16 w-full overflow-hidden sm:mt-12 sm:h-20">
        <div className="absolute bottom-0 h-9 w-full bg-slate-800 sm:h-12 dark:bg-slate-900/90" />
        <div className="road-line absolute bottom-4 h-1 w-full opacity-70 sm:bottom-5.5" />
        <div className="animate-taxi absolute bottom-5 left-0 sm:bottom-7">
          <div className="animate-taxi-bounce">
            <TaxiSvg />
          </div>
        </div>
      </div>
    </section>
  );
}
