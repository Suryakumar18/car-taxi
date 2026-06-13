"use client";

import { CarTaxiFront, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useSite } from "./SiteProvider";

export default function Footer() {
  const { site, footerColumns, footerBottom, phoneHref, wa, quickMessage } = useSite();

  return (
    <footer id="contact" className="scroll-mt-20 border-t border-slate-900/8 bg-white/60 dark:border-white/5 dark:bg-black/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 sm:gap-12 sm:py-16 lg:grid-cols-4">
        {/* Brand column */}
        <div className="col-span-2 lg:col-span-1">
          <a href="#" className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-400 text-slate-950">
              <CarTaxiFront className="size-6" />
            </span>
            <span className="font-display text-lg font-bold">{site.name}</span>
          </a>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {site.tagline}. One way & round trip outstation cabs across {site.regions}.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={phoneHref}
              className="flex items-center gap-2 rounded-full border border-brand-500/50 px-4 py-2 text-xs font-bold text-brand-700 transition hover:bg-brand-400/10 dark:border-brand-400/40 dark:text-brand-300"
            >
              <Phone className="size-3.5" /> Call
            </a>
            <a
              href={wa(quickMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-400"
            >
              <MessageCircle className="size-3.5" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Dynamic footer columns */}
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">{col.title}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              {col.links.map((link) => (
                <li key={link.label + link.href}>
                  <a href={link.href} className="transition hover:text-brand-600 dark:hover:text-brand-400">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact column */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Contact</h4>
          <ul className="mt-4 space-y-3.5 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-brand-400" />
              <a href={phoneHref} className="transition hover:text-brand-600 dark:hover:text-brand-400">{site.phone}</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-brand-400" />
              <a href={`mailto:${site.email}`} className="break-all transition hover:text-brand-600 dark:hover:text-brand-400">{site.email}</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-brand-400" />
              <span>{site.regions}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900/8 px-4 pt-5 pb-24 text-center text-[11px] text-slate-500 sm:pb-5 sm:text-xs dark:border-white/5">
        &copy; {new Date().getFullYear()} {site.name}. All rights reserved. &bull; {footerBottom}
      </div>
    </footer>
  );
}
