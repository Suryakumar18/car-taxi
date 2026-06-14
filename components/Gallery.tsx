"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

export default function Gallery() {
  const { gallery } = useSite();
  const [selected, setSelected] = useState<number | null>(null);

  if (!gallery.items.length) return null;

  return (
    <section id="gallery" className="scroll-mt-20 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">
            {gallery.kicker}
          </span>
          <h2 className="font-display mt-2 text-2xl font-extrabold sm:mt-3 sm:text-4xl">
            <Shimmer text={gallery.title} />
          </h2>
          {gallery.subtitle && (
            <p className="mx-auto mt-2 max-w-xl text-xs text-slate-600 sm:mt-3 sm:text-sm dark:text-slate-400">
              {gallery.subtitle}
            </p>
          )}
        </Reveal>

        <div className="mt-8 columns-2 gap-3 sm:mt-12 sm:columns-3 sm:gap-4 lg:columns-4">
          {gallery.items.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: (i % 4) * 0.05 }}
              onClick={() => setSelected(i)}
              className="group relative mb-3 block w-full overflow-hidden rounded-2xl sm:mb-4"
            >
              <Image
                src={item.image}
                alt={item.caption || `Gallery photo ${i + 1}`}
                width={400}
                height={300}
                className="w-full object-cover transition duration-500 group-hover:scale-105"
                unoptimized
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 opacity-0 transition group-hover:opacity-100">
                  <p className="text-xs font-semibold text-white sm:text-sm">{item.caption}</p>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              >
                <X className="size-5" />
              </button>
              <Image
                src={gallery.items[selected].image}
                alt={gallery.items[selected].caption || ""}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto object-contain"
                unoptimized
              />
              {gallery.items[selected].caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-10">
                  <p className="text-sm font-semibold text-white">{gallery.items[selected].caption}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
