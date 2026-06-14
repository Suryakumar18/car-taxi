"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Info, ArrowRightLeft, RotateCcw } from "lucide-react";
import Reveal from "./Reveal";
import { useSite } from "./SiteProvider";

const COLUMN_ICONS = [Info, ArrowRightLeft, RotateCcw];

export default function ImportantInfo() {
  const { importantInfo } = useSite();

  const columns = [importantInfo.general, importantInfo.oneWay, importantInfo.roundTrip];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        {columns.map((col, ci) => {
          const Icon = COLUMN_ICONS[ci];
          return (
            <Reveal key={col.title} delay={ci * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="glass h-full rounded-2xl p-5 sm:rounded-3xl sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-brand-400/10 text-brand-600 sm:size-10 dark:text-brand-400">
                    <Icon className="size-4.5 sm:size-5" />
                  </span>
                  <h3 className="font-display text-sm font-bold sm:text-base">{col.title}</h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-slate-700 sm:text-[13px] dark:text-slate-300">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
