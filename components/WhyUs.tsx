"use client";

import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  ShieldCheck,
  Clock4,
  Sparkles,
  HandCoins,
  Headset,
} from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

const FEATURE_ICONS = [BadgeIndianRupee, HandCoins, ShieldCheck, Sparkles, Clock4, Headset];

export default function WhyUs() {
  const { why } = useSite();
  return (
    <section id="why-us" className="relative scroll-mt-20 overflow-hidden py-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob absolute -right-40 top-20 size-105 rounded-full bg-brand-400/8 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">{why.kicker}</span>
          <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
            <Shimmer text={why.title} />
          </h2>
        </Reveal>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {why.features.map((f, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
            return (
              <motion.div
                key={`${f.title}-${i}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                whileHover={{ y: -6 }}
                className="glass group rounded-2xl p-4 transition hover:border-brand-500/60 sm:rounded-3xl sm:p-7 dark:hover:border-brand-400/40"
              >
                <div className="grid size-9 place-items-center rounded-xl bg-brand-400/10 text-brand-600 transition group-hover:scale-110 group-hover:bg-brand-400 group-hover:text-slate-950 sm:size-12 sm:rounded-2xl dark:text-brand-400">
                  <Icon className="size-4.5 sm:size-6" />
                </div>
                <h3 className="font-display mt-3 text-[13px] font-bold leading-snug sm:mt-5 sm:text-base">{f.title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 sm:mt-2 sm:text-sm dark:text-slate-400">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
