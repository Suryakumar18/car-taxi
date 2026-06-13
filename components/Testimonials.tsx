"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

export default function Testimonials() {
  const { reviews } = useSite();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
      <Reveal className="text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">{reviews.kicker}</span>
        <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
          <Shimmer text={reviews.title} />
        </h2>
      </Reveal>

      {/* mobile: swipeable carousel · desktop: grid */}
      <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-12 sm:grid sm:snap-none sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3">
        {reviews.items.map((r, i) => (
          <motion.figure
            key={`${r.name}-${i}`}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="glass relative w-[82vw] max-w-sm shrink-0 snap-center rounded-2xl p-5 sm:w-auto sm:max-w-none sm:shrink sm:rounded-3xl sm:p-7"
          >
            <Quote className="absolute right-5 top-5 size-7 text-brand-500/20 sm:right-6 sm:top-6 sm:size-8 dark:text-brand-400/15" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="size-3.5 fill-brand-400 text-brand-600 sm:size-4 dark:text-brand-400" />
              ))}
            </div>
            <blockquote className="mt-3 text-[13px] leading-relaxed text-slate-700 sm:mt-4 sm:text-sm dark:text-slate-300">
              “{r.text}”
            </blockquote>
            <figcaption className="mt-4 border-t border-slate-900/10 pt-3 sm:mt-5 sm:pt-4 dark:border-white/8">
              <p className="font-display text-sm font-bold">{r.name}</p>
              <p className="text-[11px] text-brand-600 sm:text-xs dark:text-brand-400/90">{r.trip}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
