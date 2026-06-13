"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { useSite } from "./SiteProvider";

export default function FloatingButtons() {
  const { site, phoneHref, wa, quickMessage } = useSite();

  return (
    <>
      {/* WhatsApp — bottom right */}
      <motion.a
        href={wa(quickMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-5 right-4 z-50 grid size-13 place-items-center rounded-full bg-green-500 text-white shadow-xl shadow-green-500/30 sm:bottom-5 sm:right-5 sm:size-14"
      >
        <span className="animate-ping-soft absolute inset-0 rounded-full bg-green-500" />
        <MessageCircle className="relative size-6.5 sm:size-7" />
      </motion.a>

      {/* Call — stacked above WhatsApp on the right */}
      <motion.a
        href={phoneHref}
        aria-label={`Call ${site.phone}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-22 right-4 z-50 grid size-13 place-items-center rounded-full bg-brand-400 text-slate-950 shadow-xl shadow-brand-400/30 sm:bottom-23 sm:right-5 sm:size-14"
      >
        <span className="animate-ping-soft absolute inset-0 rounded-full bg-brand-400" />
        <Phone className="relative size-5.5 sm:size-6" />
      </motion.a>
    </>
  );
}
