"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useSite } from "./SiteProvider";

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-2xl font-extrabold text-brand-600 sm:text-4xl dark:text-brand-400">
      {display.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { stats } = useSite();
  return (
    <section className="border-y border-slate-900/8 bg-slate-900/3 dark:border-white/5 dark:bg-white/2">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-7 sm:px-6 sm:gap-8 sm:py-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={`${s.label}-${i}`} className="text-center">
            <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:mt-1.5 sm:text-xs dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
