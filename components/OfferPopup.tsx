"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, MessageCircle, Phone } from "lucide-react";
import { useSite } from "./SiteProvider";

export default function OfferPopup() {
  const { offer, wa, phoneHref, site } = useSite();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!offer.enabled) return;
    const dismissed = sessionStorage.getItem("offer_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, [offer.enabled]);

  function dismiss() {
    setShow(false);
    sessionStorage.setItem("offer_dismissed", "1");
  }

  function getLink() {
    if (offer.buttonLink === "whatsapp") return wa(`Hi ${site.name}! I saw your offer: ${offer.title}. I'd like to claim it.`);
    if (offer.buttonLink === "call") return phoneHref;
    return offer.buttonLink;
  }

  const isWa = offer.buttonLink === "whatsapp";
  const isCall = offer.buttonLink === "call";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="h-2 bg-gradient-to-r from-brand-400 to-brand-600" />

            <button
              onClick={dismiss}
              className="absolute right-3 top-5 grid size-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="size-4" />
            </button>

            <div className="px-6 pb-6 pt-5 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-400/15 text-brand-600 dark:text-brand-400">
                <Gift className="size-7" />
              </div>

              <h3 className="font-display mt-4 text-xl font-extrabold">{offer.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {offer.description}
              </p>

              <a
                href={getLink()}
                target={isWa ? "_blank" : undefined}
                rel={isWa ? "noopener noreferrer" : undefined}
                onClick={dismiss}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:brightness-105 active:scale-95"
              >
                {isWa ? <MessageCircle className="size-4" /> : isCall ? <Phone className="size-4" /> : null}
                {offer.buttonText}
              </a>

              <button
                onClick={dismiss}
                className="mt-3 text-xs font-medium text-slate-500 transition hover:text-slate-700 dark:hover:text-slate-300"
              >
                {offer.dismissLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
