"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";
import Shimmer from "./Shimmer";
import { useSite } from "./SiteProvider";

export default function GalleryPage() {
  const { gallery } = useSite();
  const [selected, setSelected] = useState<number | null>(null);

  function prev() {
    if (selected === null) return;
    setSelected(selected > 0 ? selected - 1 : gallery.items.length - 1);
  }
  function next() {
    if (selected === null) return;
    setSelected(selected < gallery.items.length - 1 ? selected + 1 : 0);
  }

  return (
    <section className="min-h-screen pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600 sm:text-xs dark:text-brand-400">
            {gallery.kicker}
          </span>
          <h1 className="font-display mt-2 text-3xl font-extrabold sm:mt-3 sm:text-5xl">
            <Shimmer text={gallery.title} />
          </h1>
          {gallery.subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:mt-4 sm:text-base dark:text-slate-400">
              {gallery.subtitle}
            </p>
          )}
        </Reveal>

        {gallery.items.length === 0 ? (
          <p className="mt-16 text-center text-sm text-slate-500">No photos yet. Check back soon!</p>
        ) : (
          <div className="mt-10 columns-2 gap-3 sm:mt-14 sm:columns-3 sm:gap-4 lg:columns-4">
            {gallery.items.map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                onClick={() => setSelected(i)}
                className="group relative mb-3 block w-full overflow-hidden rounded-2xl sm:mb-4"
              >
                <Image
                  src={item.image}
                  alt={item.caption || `Gallery photo ${i + 1}`}
                  width={500}
                  height={400}
                  className="w-full object-cover transition duration-500 group-hover:scale-105"
                  unoptimized
                />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 opacity-0 transition duration-300 group-hover:opacity-100">
                    <p className="text-xs font-semibold text-white sm:text-sm">{item.caption}</p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            {/* Navigation arrows */}
            {gallery.items.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-5 sm:size-12"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-5 sm:size-12"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}

            <motion.div
              key={selected}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl"
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
                width={1400}
                height={900}
                className="max-h-[85vh] w-auto object-contain"
                unoptimized
              />
              {gallery.items[selected].caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-12">
                  <p className="text-sm font-semibold text-white sm:text-base">{gallery.items[selected].caption}</p>
                </div>
              )}
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
              {selected + 1} / {gallery.items.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
