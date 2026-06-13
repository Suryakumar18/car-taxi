"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, X, Plus, Pipette, Trash2 } from "lucide-react";
import { THEME_PRESETS, type ThemePreset } from "@/lib/site-types";
import { useSite } from "./SiteProvider";

function hexToShades(hex: string): ThemePreset["colors"] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lighten = (r: number, g: number, b: number, amt: number) =>
    `#${[r, g, b].map((c) => Math.min(255, Math.round(c + (255 - c) * amt)).toString(16).padStart(2, "0")).join("")}`;
  const darken = (r: number, g: number, b: number, amt: number) =>
    `#${[r, g, b].map((c) => Math.max(0, Math.round(c * (1 - amt))).toString(16).padStart(2, "0")).join("")}`;
  return {
    300: lighten(r, g, b, 0.4),
    400: lighten(r, g, b, 0.15),
    500: hex,
    600: darken(r, g, b, 0.15),
    700: darken(r, g, b, 0.3),
  };
}

function applyTheme(colors: ThemePreset["colors"]) {
  const el = document.documentElement;
  el.style.setProperty("--brand-300", colors[300]);
  el.style.setProperty("--brand-400", colors[400]);
  el.style.setProperty("--brand-500", colors[500]);
  el.style.setProperty("--brand-600", colors[600]);
  el.style.setProperty("--brand-700", colors[700]);
  try {
    localStorage.setItem("user-theme", JSON.stringify(colors));
  } catch {}
}

function loadUserThemes(): ThemePreset[] {
  try {
    const raw = localStorage.getItem("user-custom-themes");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveUserThemes(themes: ThemePreset[]) {
  try {
    localStorage.setItem("user-custom-themes", JSON.stringify(themes));
  } catch {}
}

export default function ThemePicker() {
  const { customThemes } = useSite();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [customColor, setCustomColor] = useState("#f59e0b");
  const [customName, setCustomName] = useState("");
  const [userThemes, setUserThemes] = useState<ThemePreset[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserThemes(loadUserThemes());
    try {
      const saved = localStorage.getItem("user-theme");
      if (saved) {
        const colors = JSON.parse(saved);
        if (colors?.[500]) {
          applyTheme(colors);
          setActive("user-saved");
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const allPresets: [string, ThemePreset][] = [
    ...Object.entries(THEME_PRESETS),
    ...customThemes.map((t, i) => [`admin-${i}`, t] as [string, ThemePreset]),
    ...userThemes.map((t, i) => [`user-${i}`, t] as [string, ThemePreset]),
  ];

  function select(key: string, preset: ThemePreset) {
    applyTheme(preset.colors);
    setActive(key);
  }

  function createCustom() {
    if (!customName.trim()) return;
    const colors = hexToShades(customColor);
    const newTheme: ThemePreset = { label: customName.trim(), colors };
    const updated = [...userThemes, newTheme];
    setUserThemes(updated);
    saveUserThemes(updated);
    applyTheme(colors);
    setActive(`user-${updated.length - 1}`);
    setCreating(false);
    setCustomName("");
    setCustomColor("#f59e0b");
  }

  function deleteUserTheme(index: number) {
    const updated = userThemes.filter((_, i) => i !== index);
    setUserThemes(updated);
    saveUserThemes(updated);
    if (active === `user-${index}`) {
      setActive(null);
      resetTheme();
    }
  }

  function resetTheme() {
    try { localStorage.removeItem("user-theme"); } catch {}
    window.location.reload();
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change theme colour"
        className="glass grid size-10 place-items-center rounded-full text-brand-500 transition hover:scale-110 dark:text-brand-300"
      >
        <Palette className="size-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-slate-900/10 bg-white/95 shadow-2xl backdrop-blur-xl sm:w-80 dark:border-white/10 dark:bg-slate-900/95"
          >
            <div className="flex items-center justify-between border-b border-slate-900/8 px-4 py-3 dark:border-white/8">
              <h3 className="text-sm font-bold">Choose Colour</h3>
              <button onClick={() => setOpen(false)} className="grid size-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto px-3 py-3 [scrollbar-width:thin]">
              {/* Built-in + admin themes */}
              <div className="grid grid-cols-3 gap-2">
                {allPresets.map(([key, preset]) => {
                  const isActive = active === key;
                  const isUserTheme = key.startsWith("user-");
                  const userIdx = isUserTheme ? parseInt(key.split("-")[1]) : -1;
                  return (
                    <button
                      key={key}
                      onClick={() => select(key, preset)}
                      className={`group relative rounded-xl border-2 p-2 text-center transition active:scale-95 ${isActive ? "border-brand-500" : "border-transparent hover:bg-slate-100 dark:hover:bg-white/5"}`}
                    >
                      {isActive && (
                        <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-brand-500 text-white">
                          <Check className="size-2.5" />
                        </span>
                      )}
                      {isUserTheme && (
                        <span
                          onClick={(e) => { e.stopPropagation(); deleteUserTheme(userIdx); }}
                          className="absolute -left-1 -top-1 hidden size-4 cursor-pointer place-items-center rounded-full bg-red-500 text-white group-hover:grid"
                        >
                          <X className="size-2.5" />
                        </span>
                      )}
                      <span className="mx-auto flex w-fit overflow-hidden rounded-full">
                        {([400, 500, 600] as const).map((k) => (
                          <span key={k} className="size-5 sm:size-6" style={{ background: preset.colors[k] }} />
                        ))}
                      </span>
                      <span className="mt-1.5 block text-[10px] font-semibold">{preset.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Create custom */}
              {!creating ? (
                <button
                  onClick={() => setCreating(true)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-900/10 py-3 text-xs font-bold text-slate-500 transition hover:border-brand-500/40 hover:text-brand-600 dark:border-white/10 dark:hover:text-brand-400"
                >
                  <Plus className="size-3.5" /> Create Your Own
                </button>
              ) : (
                <div className="mt-3 rounded-xl border border-slate-900/10 p-3 dark:border-white/10">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Create New Theme</p>
                  <div className="mb-2">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full rounded-lg border border-slate-900/10 bg-white/80 px-2.5 py-1.5 text-xs outline-none placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5"
                      placeholder="Theme name (e.g. Ocean Blue)"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="size-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && setCustomColor(e.target.value)}
                        className="w-full rounded-lg border border-slate-900/10 bg-white/80 px-2.5 py-1.5 text-xs font-mono outline-none dark:border-white/10 dark:bg-white/5"
                        placeholder="#f59e0b"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex overflow-hidden rounded-full">
                    {Object.values(hexToShades(customColor)).map((c, i) => (
                      <span key={i} className="h-5 flex-1" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="mt-2.5 flex gap-2">
                    <button
                      onClick={createCustom}
                      disabled={!customName.trim()}
                      className="flex-1 rounded-lg bg-brand-400 py-2 text-xs font-bold text-slate-950 transition hover:brightness-105 disabled:opacity-40"
                    >
                      <Pipette className="mr-1 inline size-3" /> Save & Apply
                    </button>
                    <button onClick={() => { setCreating(false); setCustomName(""); }} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Reset */}
            {active && (
              <div className="border-t border-slate-900/8 px-4 py-2.5 dark:border-white/8">
                <button onClick={resetTheme} className="w-full text-center text-[11px] font-semibold text-slate-400 transition hover:text-red-500">
                  Reset to Default
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
