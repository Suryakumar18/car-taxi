"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, MapPin, MessageCircle, Snowflake, Wind } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

type AcMode = "AC" | "Non-AC";

function TourCard({ tour, index }: { tour: ReturnType<typeof useSite>["tours"]["items"][number]; index: number }) {
  const { wa, site } = useSite();
  const [acMode, setAcMode] = useState<AcMode>("AC");

  const includesCar = tour.includesCar !== false;
  const displayPrice = !includesCar
    ? tour.price
    : (acMode === "AC" ? tour.price : (tour.nonAcPrice || tour.price));
  const carNote = includesCar ? ` (${acMode})` : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="glass group flex flex-col overflow-hidden rounded-3xl transition hover:shadow-xl hover:shadow-brand-500/10"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900/5 sm:h-56 dark:bg-white/5">
        {tour.image ? (
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="grid h-full place-items-center text-slate-400">
            <MapPin className="size-10 opacity-30" />
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-brand-400 px-3 py-1 text-[11px] font-bold text-slate-950">
          {displayPrice}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          <Clock className="size-3" />
          {tour.duration}
        </div>
        {!includesCar && (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            No vehicle included
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{tour.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {tour.description}
        </p>

        {/* AC / Non-AC toggle (only if includesCar) */}
        {includesCar && (
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-900/5 p-1 dark:bg-white/5">
            {(["AC", "Non-AC"] as AcMode[]).map((m) => {
              const price = m === "AC" ? tour.price : (tour.nonAcPrice || tour.price);
              return (
                <button
                  key={m}
                  onClick={() => setAcMode(m)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                    acMode === m
                      ? "bg-brand-400 text-slate-950 shadow"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {m === "AC" ? <Snowflake className="size-3.5" /> : <Wind className="size-3.5" />}
                  {m} <span className="opacity-70">· {price}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Highlights */}
        {tour.highlights.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Highlights</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tour.highlights.map((h, j) => (
                <span key={j} className="rounded-full border border-brand-500/20 bg-brand-400/5 px-2.5 py-0.5 text-[10px] font-semibold text-brand-700 dark:border-brand-400/20 dark:text-brand-300">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Inclusions */}
        {tour.inclusions.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inclusions</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1">
              {tour.inclusions.map((inc, j) => (
                <span key={j} className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="size-3 shrink-0 text-green-500" />
                  {inc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-5">
          <a
            href={wa(`Hi ${site.name}! I'm interested in the "${tour.title}" package${carNote} (${displayPrice}). Please share more details.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white transition hover:bg-green-400 active:scale-[0.98]"
          >
            <MessageCircle className="size-4" />
            Book This Tour
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ToursPage() {
  const { tours } = useSite();

  return (
    <section className="min-h-screen pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">
            {tours.kicker}
          </span>
          <h1 className="font-display mt-2 text-3xl font-extrabold sm:mt-3 sm:text-5xl">
            <Shimmer text={tours.title} />
          </h1>
          {tours.subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:mt-4 sm:text-base dark:text-slate-400">
              {tours.subtitle}
            </p>
          )}
        </Reveal>

        {tours.items.length === 0 ? (
          <p className="mt-16 text-center text-sm text-slate-500">No tour packages available yet. Check back soon!</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            {tours.items.map((tour, i) => (
              <TourCard key={i} tour={tour} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
