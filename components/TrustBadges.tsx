"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useSite } from "./SiteProvider";

export default function TrustBadges() {
  const { trustBadges } = useSite();

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        {trustBadges.map((badge, i) => (
          <motion.span
            key={badge}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="flex items-center gap-2 rounded-full bg-brand-400/10 px-4 py-2 text-xs font-bold text-brand-700 sm:px-5 sm:py-2.5 sm:text-sm dark:bg-brand-400/10 dark:text-brand-300"
          >
            <CheckCircle2 className="size-4 text-green-500" />
            {badge}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
