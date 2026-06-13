"use client";

import { MapPin } from "lucide-react";
import { useSite } from "./SiteProvider";

export default function CityMarquee() {
  const { cities } = useSite();
  const items = [...cities, ...cities];
  return (
    <div className="relative overflow-hidden border-y border-slate-900/8 bg-slate-900/3 py-2.5 sm:py-4 dark:border-white/5 dark:bg-white/2">
      <div className="animate-marquee flex w-max items-center gap-10">
        {items.map((city, i) => (
          <span key={i} className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
            <MapPin className="size-4 text-brand-500 dark:text-brand-400" />
            {city}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-(--page-bg) to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-(--page-bg) to-transparent" />
    </div>
  );
}
