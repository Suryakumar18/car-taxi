"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

export default function Faq() {
  const { faq } = useSite();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <Reveal className="text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">{faq.kicker}</span>
        <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
          <Shimmer text={faq.title} />
        </h2>
      </Reveal>

      <div className="mt-6 space-y-2.5 sm:mt-10 sm:space-y-3">
        {faq.items.map((f, i) => {
          const open = openIdx === i;
          return (
            <Reveal key={`${f.q}-${i}`} delay={i * 0.05}>
              <div className={`glass overflow-hidden rounded-2xl transition ${open ? "border-brand-500/50 dark:border-brand-400/40" : ""}`}>
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:gap-4 sm:px-6 sm:py-4"
                >
                  <span className="text-[13px] font-bold sm:text-base">{f.q}</span>
                  <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className={`size-5 shrink-0 ${open ? "text-brand-600 dark:text-brand-400" : "text-slate-600 dark:text-slate-400"}`} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-4 pb-4 text-[13px] leading-relaxed text-slate-600 sm:px-6 sm:pb-5 sm:text-sm dark:text-slate-400">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
