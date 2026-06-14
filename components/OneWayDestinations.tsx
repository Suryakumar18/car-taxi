"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

const TYPE_COLORS: Record<string, string> = {
  city:      "bg-blue-500",
  temple:    "bg-amber-500",
  hill:      "bg-green-600",
  coastal:   "bg-cyan-500",
  business:  "bg-slate-600",
  scenic:    "bg-emerald-500",
};

export default function OneWayDestinations() {
  const { site, destinationsHead, destinations, destinationsColumns, phoneHref, wa } = useSite();
  const is1Col = destinationsColumns === 1;

  return (
    <section id="destinations" className="scroll-mt-20 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">
            {destinationsHead.kicker}
          </span>
          <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
            <Shimmer text={destinationsHead.title} />
          </h2>
          {destinationsHead.subtitle && (
            <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-600 sm:mt-3 sm:text-sm dark:text-slate-400">
              {destinationsHead.subtitle}
            </p>
          )}
        </Reveal>

        <div className={`mt-8 grid gap-4 sm:mt-12 ${is1Col ? "grid-cols-1" : "sm:grid-cols-2"}`}>
          {destinations.map((dest, i) => {
            const badgeColor = TYPE_COLORS[dest.type] ?? "bg-blue-500";
            return (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: is1Col ? 0 : (i % 2) * 0.08 }}
                className={`glass flex overflow-hidden rounded-2xl ${is1Col ? "min-h-[220px]" : "min-h-[180px]"}`}
              >
                {/* Image — left */}
                <div className={`relative shrink-0 ${is1Col ? "w-[45%] sm:w-2/5" : "w-[45%]"}`}>
                  <img
                    src={dest.image}
                    alt={`${dest.name} one way taxi destination`}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute left-2 top-2 rounded-full ${badgeColor} px-2.5 py-0.5 text-[10px] font-semibold capitalize text-white`}
                  >
                    {dest.type}
                  </span>
                </div>

                {/* Content — right */}
                <div className={`flex flex-1 flex-col justify-between ${is1Col ? "p-5 sm:p-8" : "p-3.5 sm:p-4"}`}>
                  <div>
                    <h3 className={`font-display font-extrabold leading-tight ${is1Col ? "text-lg sm:text-2xl" : "text-sm sm:text-base"}`}>
                      {dest.name} One Way Taxi
                    </h3>
                    <p className={`mt-1 text-slate-500 dark:text-slate-400 ${is1Col ? "text-sm" : "text-[11px]"}`}>
                      {dest.subtitle}
                    </p>
                  </div>

                  <div className={is1Col ? "mt-6" : "mt-3"}>
                    <div className={`grid grid-cols-2 ${is1Col ? "gap-3 sm:max-w-sm" : "gap-2"}`}>
                      <a
                        href={phoneHref}
                        className={`flex items-center justify-center gap-1.5 rounded-full bg-green-500 font-bold text-white transition hover:bg-green-400 ${is1Col ? "py-2.5 text-sm" : "py-2 text-[11px]"}`}
                      >
                        <Phone className={is1Col ? "size-4" : "size-3.5"} /> Call Now
                      </a>
                      <a
                        href={wa(`Hi ${site.name}! I need a one way taxi to ${dest.name}. Please share fare details.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-1.5 rounded-full bg-green-500 font-bold text-white transition hover:bg-green-400 ${is1Col ? "py-2.5 text-sm" : "py-2 text-[11px]"}`}
                      >
                        <MessageCircle className={is1Col ? "size-4" : "size-3.5"} /> Get Fare
                      </a>
                    </div>
                    <p className={`mt-2 text-slate-500 dark:text-slate-400 ${is1Col ? "text-xs" : "text-[10px]"}`}>
                      Fixed fare &bull; No return charge &bull; 24/7 support
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
