"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CarTaxiFront, Phone, MessageCircle, Menu, X } from "lucide-react";
import { useSite } from "./SiteProvider";
import ThemeToggle from "./ThemeToggle";
import ThemePicker from "./ThemePicker";

export default function Navbar() {
  const { site, navLinks, phoneHref, wa, quickMessage, hero } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathname = usePathname();
  const words = site.name.split(" ");

  // Force light text over hero image when not scrolled and on homepage
  const overHeroImage = !!hero.heroImage && !scrolled && pathname === "/";

  const NavAnchor = ({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) => {
    const isHash = href.startsWith("#");
    if (isHash && pathname !== "/") {
      return <Link href={`/${href}`} className={className} onClick={onClick}>{children}</Link>;
    }
    if (isHash) {
      return <a href={href} className={className} onClick={onClick}>{children}</a>;
    }
    return <Link href={href} className={className} onClick={onClick}>{children}</Link>;
  };

  // Navbar text color logic:
  // - Over hero image (not scrolled): force white for readability
  // - Otherwise: use admin-configured colors via .nav-link CSS class
  const linkBaseClass = overHeroImage
    ? "text-white/95 transition hover:text-brand-300 [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
    : "nav-link";

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/10 dark:shadow-black/30" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#" className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-400 text-slate-950 glow-brand">
            <CarTaxiFront className="size-6" />
          </span>
          <span className={`font-display text-lg font-bold tracking-tight ${overHeroImage ? "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]" : ""}`}>
            {words[0]}
            {words.length > 1 && <span className="text-brand-500 dark:text-brand-400"> {words.slice(1).join(" ")}</span>}
          </span>
        </a>

        <ul className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {navLinks.map((l) => {
            const isActive = !l.href.startsWith("#") && pathname === l.href;
            return (
              <li key={l.href + l.label}>
                <NavAnchor href={l.href} className={`${linkBaseClass} ${isActive ? "is-active font-bold" : ""}`}>
                  {l.label}
                </NavAnchor>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 sm:flex">
          <ThemePicker />
          <ThemeToggle />
          <a
            href={phoneHref}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${overHeroImage ? "border-white/50 text-white hover:bg-white/10" : "border-brand-500/50 text-brand-700 hover:bg-brand-400/10 dark:border-brand-400/40 dark:text-brand-300"}`}
          >
            <Phone className="size-4" /> Call Now
          </a>
          <a
            href={wa(quickMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-400"
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemePicker />
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className={`grid size-10 place-items-center rounded-lg ${overHeroImage ? "border border-white/30 bg-black/30 text-white backdrop-blur-sm" : "glass"}`}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`hidden size-10 place-items-center rounded-lg sm:grid lg:hidden ${overHeroImage ? "border border-white/30 bg-black/30 text-white backdrop-blur-sm" : "glass"}`}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass border-t border-slate-900/8 px-6 py-4 lg:hidden dark:border-white/5"
        >
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((l) => {
              const isActive = !l.href.startsWith("#") && pathname === l.href;
              return (
                <li key={l.href + l.label}>
                  <NavAnchor href={l.href} onClick={() => setOpen(false)} className={`nav-link block py-1 ${isActive ? "is-active font-bold" : ""}`}>
                    {l.label}
                  </NavAnchor>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex gap-3">
            <a href={phoneHref} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-500/50 px-4 py-2.5 text-sm font-semibold text-brand-700 dark:border-brand-400/40 dark:text-brand-300">
              <Phone className="size-4" /> Call
            </a>
            <a href={wa(quickMessage)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-sm font-semibold text-white">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
