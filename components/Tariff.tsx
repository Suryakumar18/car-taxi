"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Wallet, Route as RouteIcon, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { MIN_KM_ONE_WAY, MIN_KM_ROUND } from "@/lib/config";
import { useSite } from "./SiteProvider";

type Tab = "One Way" | "Round Trip";

export default function Tariff() {
  const { site, vehicles, tariffHead, wa } = useSite();
  const [tab, setTab] = useState<Tab>("One Way");
  const oneWay = tab === "One Way";

  return (
    <section id="tariff" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-20">
      <Reveal className="text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">{tariffHead.kicker}</span>
        <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
          <Shimmer text={tariffHead.title} />
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs text-slate-600 sm:mt-3 sm:text-sm dark:text-slate-400">
          {tariffHead.subtitle} Minimum billing{" "}
          {oneWay ? `${MIN_KM_ONE_WAY} km for one way` : `${MIN_KM_ROUND} km for round trips`}.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-5 flex justify-center sm:mt-8">
        <div className="glass grid grid-cols-2 gap-1 rounded-full p-1">
          {(["One Way", "Round Trip"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-6 py-2 text-sm font-bold transition sm:px-7 sm:py-2.5 ${
                tab === t
                  ? "bg-brand-400 text-slate-950 shadow glow-brand"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35 }}
          className="mt-6 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
        >
          {vehicles.map((v, i) => {
            const rate = oneWay ? v.oneWayRate : v.roundRate;
            const bata = oneWay ? v.bataOneWay : v.bataRound;
            const msg = `Hi ${site.name}! 🚖 I want to book a *${v.name}* (${tab}, ₹${rate}/km). Please share availability.`;
            return (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                whileHover={{ y: -6 }}
                className="glass group relative flex items-center gap-3 overflow-hidden rounded-2xl p-3.5 transition hover:border-brand-500/50 sm:block sm:rounded-3xl sm:p-6 dark:hover:border-brand-400/40"
              >
                {v.tag && (
                  <span className="absolute right-3 top-2.5 z-10 rounded-full bg-brand-400/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-700 sm:right-4 sm:top-4 sm:px-3 sm:py-1 sm:text-[10px] dark:bg-brand-400/15 dark:text-brand-300">
                    {v.tag}
                  </span>
                )}

                {/* car photo */}
                <div className="relative h-20 w-28 shrink-0 sm:h-32 sm:w-full">
                  <div className="absolute inset-x-3 bottom-0.5 h-3 rounded-[50%] bg-slate-900/15 blur-md sm:inset-x-4 sm:bottom-1 sm:h-4 dark:bg-black/50" />
                  {v.image && (
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      sizes="(max-width: 640px) 112px, (max-width: 1024px) 45vw, 300px"
                      className="object-contain transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                    />
                  )}
                </div>

                {/* details */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm font-bold sm:mt-4 sm:text-lg">{v.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-600 sm:mt-1 sm:text-xs dark:text-slate-400">
                    <Users className="size-3 sm:size-3.5" /> {v.seats} Seater
                  </p>

                  <div className="mt-1 flex items-end gap-1 sm:mt-4">
                    <span className="font-display text-xl font-extrabold text-brand-600 sm:text-3xl dark:text-brand-400">₹{rate}</span>
                    <span className="pb-0.5 text-[11px] text-slate-600 sm:pb-1 sm:text-xs dark:text-slate-400">/ km</span>
                  </div>

                  <p className="mt-1 text-[10px] text-slate-500 sm:hidden">
                    Bata ₹{bata}{oneWay ? "" : "/day"} • Min {oneWay ? MIN_KM_ONE_WAY : MIN_KM_ROUND} km
                  </p>
                  <ul className="mt-4 hidden space-y-2 border-t border-slate-900/10 pt-4 text-xs text-slate-600 sm:block dark:border-white/8 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Wallet className="size-3.5 text-brand-600 dark:text-brand-400" />
                      Driver Bata ₹{bata}
                      {oneWay ? "" : " / day"}
                    </li>
                    <li className="flex items-center gap-2">
                      <RouteIcon className="size-3.5 text-brand-600 dark:text-brand-400" />
                      Min {oneWay ? MIN_KM_ONE_WAY : MIN_KM_ROUND} km billing
                    </li>
                  </ul>
                </div>

                {/* mobile: round book button | desktop: full-width button */}
                <a
                  href={wa(msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Book ${v.name} on WhatsApp`}
                  className="grid size-11 shrink-0 place-items-center self-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/25 transition active:scale-90 sm:hidden"
                >
                  <MessageCircle className="size-5" />
                </a>
                <a
                  href={wa(msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 hidden w-full items-center justify-center gap-2 rounded-xl bg-slate-900/5 py-2.5 text-sm font-bold text-slate-900 transition group-hover:bg-green-500 group-hover:text-white sm:flex dark:bg-white/5 dark:text-white"
                >
                  <MessageCircle className="size-4" /> Book {v.name}
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <Reveal delay={0.15}>
        <p className="mt-5 text-center text-[10px] text-slate-500 sm:mt-8 sm:text-xs">
          * Toll, parking, permit & hill station charges extra (as per actuals). Round trip driver bata is per day.
        </p>
      </Reveal>
    </section>
  );
}
