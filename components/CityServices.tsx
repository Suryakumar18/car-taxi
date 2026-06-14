"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight, Phone, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

export default function CityServices() {
  const { site, cityServiceHead, featuredCities, allCities, phoneHref, wa } = useSite();

  return (
    <section id="cities" className="relative scroll-mt-20 overflow-hidden py-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-200 -translate-x-1/2 rounded-full bg-brand-400/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">
            {cityServiceHead.kicker}
          </span>
          <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
            <Shimmer text={cityServiceHead.title} />
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-600 sm:mt-3 sm:text-sm dark:text-slate-400">
            {cityServiceHead.subtitle}
          </p>
        </Reveal>

        {/* Featured cities */}
        <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {featuredCities.map((city, i) => (
            <motion.a
              key={city.name}
              href={wa(`Hi ${site.name}! I need a taxi from ${city.name}. Please share details.`)}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
              whileHover={{ y: -4 }}
              className="glass group flex items-start gap-4 rounded-2xl p-4 transition hover:border-brand-500/60 sm:p-5 dark:hover:border-brand-400/40"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-400/10 text-brand-600 transition group-hover:bg-brand-400 group-hover:text-slate-950 sm:size-12 dark:text-brand-400">
                <MapPin className="size-5 sm:size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm font-bold sm:text-base">{city.name}</h3>
                <p className="mt-0.5 text-[11px] text-slate-600 sm:text-xs dark:text-slate-400">
                  {city.desc}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 transition group-hover:gap-2 sm:text-xs dark:text-brand-400">
                  View Taxi in {city.name} <ArrowRight className="size-3" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* All cities grid */}
        {allCities.length > 0 && (
          <Reveal delay={0.1} className="mt-8 sm:mt-12">
            <div className="flex flex-wrap justify-center gap-2">
              {allCities.map((city) => (
                <a
                  key={city}
                  href={wa(`Hi ${site.name}! I need a taxi from ${city}. Please share details.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-brand-500/60 hover:text-brand-600 sm:px-4 sm:py-2 sm:text-xs dark:text-slate-300 dark:hover:text-brand-400"
                >
                  {city}
                </a>
              ))}
            </div>
          </Reveal>
        )}

        {/* Book from any city CTA */}
        <Reveal delay={0.15}>
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-brand-400/10 via-brand-400/5 to-transparent p-5 text-center sm:mt-12 sm:p-8">
            <h3 className="font-display text-lg font-extrabold sm:text-xl">
              Book Taxi from Any City Instantly
            </h3>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
              Fixed fare &bull; No hidden charges &bull; Instant confirmation
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
              <a
                href={phoneHref}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-500/50 px-6 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-400/10 sm:w-auto dark:border-brand-400/40 dark:text-brand-300"
              >
                <Phone className="size-4" /> Call Now
              </a>
              <a
                href={wa(`Hi ${site.name}! I want to book a taxi. Please share details.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-green-400 sm:w-auto"
              >
                <MessageCircle className="size-4" /> Get Instant Fare on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
