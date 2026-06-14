"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { useSite } from "./SiteProvider";

export default function CtaBanner() {
  const { site, cta, phoneHref, wa, quickMessage } = useSite();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-400 via-brand-400 to-brand-600 px-5 py-9 text-center text-slate-950 sm:px-12 sm:py-14"
      >
        <div className="pointer-events-none absolute -left-10 -top-10 size-40 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -right-10 size-52 rounded-full bg-brand-700/30 blur-2xl" />

        <h2 className="font-display relative text-[1.55rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
          {cta.title}
        </h2>
        <p className="relative mx-auto mt-2 max-w-xl text-[13px] font-medium text-slate-900/80 sm:mt-3 sm:text-sm">
          {cta.subtitle}
        </p>

        <div className="relative mt-5 flex flex-col items-center justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
          <a
            href={wa(quickMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-3 text-sm font-bold text-white transition hover:scale-105 hover:bg-slate-900 sm:w-auto sm:py-3.5"
          >
            <MessageCircle className="size-5 text-green-400" /> WhatsApp Booking
          </a>
          <a
            href={phoneHref}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-950 px-8 py-3 text-sm font-extrabold transition hover:scale-105 hover:bg-slate-950 hover:text-white sm:w-auto sm:py-3.5"
          >
            <Phone className="size-5" /> {site.phone}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
