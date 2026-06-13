"use client";

import { CheckCircle2 } from "lucide-react";
import { useSite } from "./SiteProvider";

export default function InfoStrip() {
  const { infoStrip } = useSite();

  return (
    <div className="border-y border-slate-900/8 bg-brand-400/5 dark:border-white/5 dark:bg-brand-400/3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-3 sm:gap-x-10 sm:px-6 sm:py-4">
        {infoStrip.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 sm:text-xs dark:text-slate-300"
          >
            <CheckCircle2 className="size-3.5 text-green-500 sm:size-4" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
