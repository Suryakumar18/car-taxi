"use client";

import { motion } from "framer-motion";
import { ClipboardList, PhoneCall, CarFront, PartyPopper } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

const STEP_ICONS = [ClipboardList, PhoneCall, CarFront, PartyPopper];

export default function HowItWorks() {
  const { how } = useSite();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
      <Reveal className="text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">{how.kicker}</span>
        <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
          <Shimmer text={how.title} />
        </h2>
      </Reveal>

      <div className="relative mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:mt-14 sm:gap-10 lg:grid-cols-4">
        {/* connector line */}
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent lg:block" />

        {how.steps.map((s, i) => {
          const Icon = STEP_ICONS[i % STEP_ICONS.length];
          return (
            <motion.div
              key={`${s.title}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="relative mx-auto grid size-12 place-items-center rounded-xl bg-brand-400/10 ring-1 ring-brand-400/30 sm:size-16 sm:rounded-2xl">
                <Icon className="size-5 text-brand-600 sm:size-7 dark:text-brand-400" />
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-brand-400 text-[10px] font-extrabold text-slate-950 sm:-right-2 sm:-top-2 sm:size-6 sm:text-xs">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display mt-3 text-sm font-bold sm:mt-5 sm:text-base">{s.title}</h3>
              <p className="mx-auto mt-1.5 max-w-55 text-[11px] leading-relaxed text-slate-600 sm:mt-2 sm:text-xs dark:text-slate-400">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
