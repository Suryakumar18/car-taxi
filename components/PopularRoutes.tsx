"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoveRight, Clock3, Gauge, Snowflake, Wind, Check } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";
import { estimateFare } from "@/lib/config";

function routeSlug(from: string, to: string) {
  return `${from}-to-${to}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

type AcMode = "AC" | "Non-AC";

export default function PopularRoutes() {
  const { routes, routesHead, vehicles, wa, site } = useSite();
  const [selectedVehicle, setSelectedVehicle] = useState<string>(vehicles[0]?.name ?? "");
  const [acMode, setAcMode] = useState<AcMode>("AC");

  const vehicle = vehicles.find((v) => v.name === selectedVehicle) ?? vehicles[0];
  const rate = vehicle
    ? (acMode === "AC" ? vehicle.oneWayRate : (vehicle.nonAcOneWayRate ?? vehicle.oneWayRate))
    : 0;

  return (
    <section id="routes" className="relative scroll-mt-20 overflow-hidden py-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-200 -translate-x-1/2 rounded-full bg-brand-400/6 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">{routesHead.kicker}</span>
          <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
            <Shimmer text={routesHead.title} />
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-slate-600 sm:mt-3 sm:text-sm dark:text-slate-400">
            Pick a vehicle & cooling option below — fares update instantly. Tap any route to book on WhatsApp.
          </p>
        </Reveal>

        {/* Vehicle picker — 2 cols mobile / 5 cols desktop */}
        <Reveal delay={0.05}>
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
            {vehicles.map((v) => {
              const active = selectedVehicle === v.name;
              const carRate = acMode === "AC" ? v.oneWayRate : (v.nonAcOneWayRate ?? v.oneWayRate);
              return (
                <button
                  key={v.name}
                  onClick={() => setSelectedVehicle(v.name)}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-2.5 text-left transition active:scale-[0.98] sm:p-3 ${
                    active
                      ? "border-brand-500 bg-brand-400/10 shadow-lg shadow-brand-500/20"
                      : "border-transparent glass hover:border-brand-500/40"
                  }`}
                >
                  {active && (
                    <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-brand-500 text-white">
                      <Check className="size-3" />
                    </span>
                  )}
                  <div className="relative h-12 w-full sm:h-14">
                    {v.image ? (
                      <Image src={v.image} alt={v.name} fill sizes="120px" className="object-contain" unoptimized />
                    ) : (
                      <div className="grid h-full place-items-center text-[10px] text-slate-400">No image</div>
                    )}
                  </div>
                  <p className="font-display mt-1.5 text-xs font-bold leading-tight sm:text-sm">{v.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{v.seats} seater</p>
                  <p className={`mt-1 text-xs font-extrabold sm:text-sm ${active ? "text-brand-600 dark:text-brand-400" : "text-slate-700 dark:text-slate-300"}`}>
                    ₹{carRate}/km
                  </p>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* AC / Non-AC toggle */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-4 flex w-fit gap-1 rounded-full border border-slate-900/10 bg-white/60 p-1 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            {(["AC", "Non-AC"] as AcMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setAcMode(m)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition sm:text-sm ${
                  acMode === m
                    ? "bg-brand-400 text-slate-950 shadow"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {m === "AC" ? <Snowflake className="size-3.5" /> : <Wind className="size-3.5" />}
                {m}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Routes grid — fares recompute from selected vehicle + AC mode */}
        <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-8 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {routes.map((r, i) => {
            const fare = vehicle
              ? estimateFare(vehicle, "One Way", r.km, undefined, acMode).total
              : r.fare;
            return (
              <motion.div
                key={`${r.from}-${r.to}-${i}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="glass group relative w-[78vw] max-w-xs shrink-0 snap-center overflow-hidden rounded-2xl p-4 transition hover:border-brand-500/60 sm:w-auto sm:max-w-none sm:shrink sm:rounded-3xl sm:p-6 dark:hover:border-brand-400/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display text-sm font-bold sm:gap-3 sm:text-lg">
                    {r.from}
                    <span className="relative flex h-5 w-8 items-center overflow-hidden sm:w-10">
                      <MoveRight className="size-4 text-brand-600 transition-transform duration-300 group-hover:translate-x-2 sm:size-5 dark:text-brand-400" />
                    </span>
                    {r.to}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-4 text-[11px] text-slate-600 sm:mt-4 sm:gap-5 sm:text-xs dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="size-3 text-brand-600 sm:size-3.5 dark:text-brand-400" /> {r.km} km
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="size-3 text-brand-600 sm:size-3.5 dark:text-brand-400" /> {r.time}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-900/10 pt-3 sm:mt-5 sm:pt-4 dark:border-white/8">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-500 sm:text-[10px]">
                      {vehicle?.name} · {acMode} · ₹{rate}/km
                    </p>
                    <p className="font-display text-lg font-extrabold text-brand-600 sm:text-xl dark:text-brand-400">
                      ₹{fare.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <Link
                    href={`/routes/${routeSlug(r.from, r.to)}`}
                    className="flex items-center gap-1.5 rounded-full bg-brand-400/15 px-3 py-1.5 text-[11px] font-bold text-brand-700 transition group-hover:bg-brand-500 group-hover:text-white sm:px-3.5 sm:py-2 sm:text-xs dark:text-brand-300"
                  >
                    Check Fare
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-1 text-center text-[10px] text-slate-500 sm:hidden">← swipe for more routes →</p>

        <Reveal delay={0.1} className="mt-6 text-center sm:mt-10">
          <a
            href={wa(`Hi ${site.name}! 🚖 I need a quote for a custom route. My trip details:`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/50 px-5 py-2.5 text-xs font-bold text-brand-700 transition hover:bg-brand-400/10 sm:px-6 sm:py-3 sm:text-sm dark:border-brand-400/40 dark:text-brand-300"
          >
            Different route? Get a quote on WhatsApp <MoveRight className="size-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
