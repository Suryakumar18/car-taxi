"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  RotateCcw,
  Plane,
  MapPin,
  Building2,
  Mountain,
  Car,
  Clock,
  Shield,
  Briefcase,
  Truck,
  Heart,
} from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

const ICON_MAP: Record<string, typeof ArrowRight> = {
  ArrowRight, RotateCcw, Plane, MapPin, Building2, Mountain,
  Car, Clock, Shield, Briefcase, Truck, Heart,
};

export default function Services() {
  const { services } = useSite();

  return (
    <section id="services" className="relative scroll-mt-20 overflow-hidden py-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob absolute -left-40 top-40 size-96 rounded-full bg-brand-400/6 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">
            {services.kicker}
          </span>
          <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
            <Shimmer text={services.title} />
          </h2>
          {services.subtitle && (
            <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-600 sm:mt-3 sm:text-sm dark:text-slate-400">
              {services.subtitle}
            </p>
          )}
        </Reveal>

        <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {services.items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || Car;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                whileHover={{ y: -6 }}
                className="glass group rounded-2xl p-5 transition hover:border-brand-500/60 sm:rounded-3xl sm:p-7 dark:hover:border-brand-400/40"
              >
                <div className="grid size-11 place-items-center rounded-xl bg-brand-400/10 text-brand-600 transition group-hover:scale-110 group-hover:bg-brand-400 group-hover:text-slate-950 sm:size-14 sm:rounded-2xl dark:text-brand-400">
                  <Icon className="size-5 sm:size-6" />
                </div>
                <h3 className="font-display mt-4 text-sm font-bold sm:mt-5 sm:text-base">{item.title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 sm:mt-2 sm:text-sm dark:text-slate-400">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
