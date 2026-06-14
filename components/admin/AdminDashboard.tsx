"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CarTaxiFront, Save, LogOut, Loader2, Plus, Trash2, Upload, Check, ExternalLink,
  Building2, Palette, Car, Route as RouteIcon, Sparkles, BarChart3, MapPin,
  ListOrdered, ShieldCheck, Star, HelpCircle, Megaphone, Globe, BadgeCheck,
  Info, ScrollText, Menu, X, ChevronRight, Navigation, LayoutGrid, ImageIcon,
  Gift, Wrench, Phone, MessageCircle, Settings, Map, Paintbrush,
  ZoomIn, ZoomOut, Crop,
} from "lucide-react";
import EasyCropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import type {
  SiteData, VehicleDoc, RouteDoc, StatItem, StepItem, ReviewItem, FaqItem,
  SectionHeading, ServiceCityItem, TravelTermsColumn, NavLink, FooterColumn,
  ServiceItem, GalleryItem, TourPackage, ThemePreset, DestinationItem,
} from "@/lib/site-types";
import { THEME_PRESETS } from "@/lib/site-types";

type Tab =
  | "site" | "theme" | "customThemes" | "hero" | "stats" | "cities" | "vehicles" | "routes"
  | "how" | "why" | "reviews" | "faq" | "cta" | "cityServices" | "trustBadges"
  | "infoStrip" | "importantInfo" | "navbar" | "footer" | "services" | "gallery" | "offer"
  | "tours" | "destinations";

type TabGroup = { label: string; items: { key: Tab; label: string; icon: typeof Building2 }[] };

const TAB_GROUPS: TabGroup[] = [
  {
    label: "Site Settings",
    items: [
      { key: "site", label: "Business Info", icon: Building2 },
      { key: "theme", label: "Theme & Colours", icon: Palette },
      { key: "customThemes", label: "User Themes", icon: Paintbrush },
      { key: "navbar", label: "Navbar Links", icon: Navigation },
      { key: "footer", label: "Footer", icon: LayoutGrid },
      { key: "offer", label: "Offer Popup", icon: Gift },
    ],
  },
  {
    label: "Homepage Sections",
    items: [
      { key: "hero", label: "Hero Section", icon: Sparkles },
      { key: "stats", label: "Stats Counters", icon: BarChart3 },
      { key: "cities", label: "City Marquee", icon: MapPin },
      { key: "trustBadges", label: "Trust Badges", icon: BadgeCheck },
      { key: "infoStrip", label: "Info Strip", icon: Info },
    ],
  },
  {
    label: "Services & Pricing",
    items: [
      { key: "services", label: "Services", icon: Wrench },
      { key: "vehicles", label: "Vehicles & Tariff", icon: Car },
      { key: "routes", label: "Popular Routes", icon: RouteIcon },
      { key: "tours", label: "Tour Packages", icon: Map },
      { key: "destinations", label: "One Way Destinations", icon: RouteIcon },
      { key: "cityServices", label: "City Services", icon: Globe },
    ],
  },
  {
    label: "Content & Media",
    items: [
      { key: "how", label: "How It Works", icon: ListOrdered },
      { key: "why", label: "Why Choose Us", icon: ShieldCheck },
      { key: "gallery", label: "Photo Gallery", icon: ImageIcon },
      { key: "reviews", label: "Testimonials", icon: Star },
      { key: "faq", label: "FAQ", icon: HelpCircle },
      { key: "importantInfo", label: "Travel Terms", icon: ScrollText },
      { key: "cta", label: "CTA Banner", icon: Megaphone },
    ],
  },
];

const inp = "w-full rounded-xl border border-slate-900/15 bg-white/80 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500/70 dark:border-white/10 dark:bg-white/5 dark:text-white";
const lbl = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500";
const ta = "w-full rounded-xl border border-slate-900/15 bg-white/80 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500/70 dark:border-white/10 dark:bg-white/5 dark:text-white resize-y min-h-[60px]";

type P = { data: SiteData; setData: (d: SiteData) => void };

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<SiteData | null>(null);
  const [tab, setTab] = useState<Tab>("site");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: SiteData) => {
        const defaults: SiteData = {
          site: { name: "", tagline: "", phone: "", whatsappNumber: "", email: "", regions: "" },
          navLinks: [], footerColumns: [], footerBottom: "",
          hero: { headline: "", description: "", perks: [], heroImage: "" },
          stats: [], cities: [],
          tariffHead: { kicker: "", title: "" }, vehicles: [],
          routesHead: { kicker: "", title: "" }, routes: [],
          how: { kicker: "", title: "", subtitle: "", steps: [] },
          why: { kicker: "", title: "", subtitle: "", features: [] },
          reviews: { kicker: "", title: "", items: [] },
          faq: { kicker: "", title: "", items: [] },
          cta: { title: "", subtitle: "" },
          theme: {
            preset: "amber", defaultMode: "dark",
            navbarLight: { text: "#1e293b", hover: "#d97706", active: "#b45309" },
            navbarDark: { text: "#f1f5f9", hover: "#fbbf24", active: "#fcd34d" },
          },
          cityServiceHead: { kicker: "", title: "" },
          featuredCities: [], allCities: [],
          trustBadges: [], infoStrip: [],
          importantInfo: { general: { title: "", items: [] }, oneWay: { title: "", items: [] }, roundTrip: { title: "", items: [] } },
          services: { kicker: "", title: "", subtitle: "", items: [] },
          gallery: { kicker: "", title: "", subtitle: "", items: [] },
          offer: { enabled: false, title: "", description: "", buttonText: "", buttonLink: "whatsapp", dismissLabel: "" },
          tours: { kicker: "", title: "", subtitle: "", items: [] },
          customThemes: [],
          destinationsHead: { kicker: "", title: "" },
          destinations: [],
          destinationsColumns: 2 as 1 | 2,
        };
        setData({ ...defaults, ...d,
          hero: { ...defaults.hero, ...d.hero },
          theme: {
            ...defaults.theme, ...d.theme,
            navbarLight: { ...defaults.theme.navbarLight, ...d.theme?.navbarLight },
            navbarDark: { ...defaults.theme.navbarDark, ...d.theme?.navbarDark },
          },
          services: { ...defaults.services, ...d.services },
          gallery: { ...defaults.gallery, ...d.gallery, items: d.gallery?.items ?? [] },
          offer: { ...defaults.offer, ...d.offer },
          tours: { ...defaults.tours, ...d.tours, items: d.tours?.items ?? [] },
          customThemes: Array.isArray(d.customThemes) ? d.customThemes : [],
          destinationsHead: { ...defaults.destinationsHead, ...d.destinationsHead },
          destinations: Array.isArray(d.destinations) ? d.destinations : [],
          destinationsColumns: (d.destinationsColumns as 1 | 2) ?? 2,
          importantInfo: {
            general: { ...defaults.importantInfo.general, ...d.importantInfo?.general },
            oneWay: { ...defaults.importantInfo.oneWay, ...d.importantInfo?.oneWay },
            roundTrip: { ...defaults.importantInfo.roundTrip, ...d.importantInfo?.roundTrip },
          },
        });
      })
      .catch(() => setError("Could not load data. Check your database connection."));
  }, []);

  async function save() {
    if (!data) return;
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/site", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || "Save failed"); }
      setSaved(true); setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); router.refresh(); }
  function selectTab(t: Tab) { setTab(t); setSidebarOpen(false); }

  if (error && !data) return <main className="grid min-h-screen place-items-center px-4"><p className="glass rounded-2xl p-6 text-sm text-red-500">{error}</p></main>;
  if (!data) return <main className="grid min-h-screen place-items-center"><Loader2 className="size-8 animate-spin text-brand-500" /></main>;

  const activeLabel = TAB_GROUPS.flatMap((g) => g.items).find((t) => t.key === tab)?.label ?? "";

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Fixed Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-900/10 bg-white/95 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 dark:border-white/5 dark:bg-slate-950/95 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-2.5 border-b border-slate-900/10 px-4 py-4 dark:border-white/5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-400 text-slate-950"><CarTaxiFront className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display truncate text-sm font-bold">Site Manager</h1>
            <p className="truncate text-[10px] text-slate-500">{data.site.name}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-white/5"><X className="size-4" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
          {TAB_GROUPS.map((g) => (
            <div key={g.label} className="mb-5">
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{g.label}</p>
              {g.items.map((t) => {
                const active = tab === t.key;
                return (
                  <button key={t.key} onClick={() => selectTab(t.key)}
                    className={`mb-0.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition ${active ? "bg-brand-400/15 font-bold text-brand-700 dark:text-brand-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"}`}>
                    <t.icon className={`size-4 ${active ? "text-brand-600 dark:text-brand-400" : ""}`} />
                    {t.label}
                    {active && <ChevronRight className="ml-auto size-3.5 text-brand-500" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-900/10 px-3 py-3 dark:border-white/5">
          <a href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-white/5 dark:hover:text-brand-400">
            <ExternalLink className="size-3.5" /> View Live Site
          </a>
          <button onClick={logout} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400">
            <LogOut className="size-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Fixed top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-900/10 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6 dark:border-white/5 dark:bg-slate-950/90">
          <button onClick={() => setSidebarOpen(true)} className="grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-white/5"><Menu className="size-5" /></button>
          <div className="min-w-0 flex-1">
            <h2 className="font-display truncate text-sm font-bold sm:text-base">{activeLabel}</h2>
          </div>
          {/* Quick info */}
          <div className="hidden items-center gap-3 text-[11px] text-slate-500 md:flex">
            <span className="flex items-center gap-1"><Phone className="size-3" />{data.site.phone}</span>
            <span className="flex items-center gap-1"><MessageCircle className="size-3" />{data.site.whatsappNumber}</span>
          </div>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 rounded-full bg-brand-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-105 active:scale-95 disabled:opacity-60">
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : saved ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
            {saved ? "Saved!" : "Save"}
          </button>
        </header>

        {error && <p className="mx-4 mt-3 rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-500 sm:mx-6">{error}</p>}

        {/* Scrolling content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-4xl space-y-5 pb-10">
            {tab === "site" && <SiteTab data={data} setData={setData} />}
            {tab === "theme" && <ThemeTab data={data} setData={setData} />}
            {tab === "customThemes" && <CustomThemesTab data={data} setData={setData} />}
            {tab === "navbar" && <NavbarTab data={data} setData={setData} />}
            {tab === "footer" && <FooterTab data={data} setData={setData} />}
            {tab === "offer" && <OfferTab data={data} setData={setData} />}
            {tab === "hero" && <HeroTab data={data} setData={setData} />}
            {tab === "stats" && <StatsTab data={data} setData={setData} />}
            {tab === "cities" && <CitiesTab data={data} setData={setData} />}
            {tab === "trustBadges" && <ListTab data={data} setData={setData} field="trustBadges" title="Trust Badges" desc="Short trust indicators shown below Why Us." />}
            {tab === "infoStrip" && <ListTab data={data} setData={setData} field="infoStrip" title="Info Strip" desc="Checkmark items in the horizontal banner." />}
            {tab === "services" && <ServicesTab data={data} setData={setData} />}
            {tab === "vehicles" && <VehiclesTab data={data} setData={setData} />}
            {tab === "routes" && <RoutesTab data={data} setData={setData} />}
            {tab === "tours" && <ToursTab data={data} setData={setData} />}
            {tab === "destinations" && <DestinationsTab data={data} setData={setData} />}
            {tab === "cityServices" && <CityServicesTab data={data} setData={setData} />}
            {tab === "how" && <StepsTab data={data} setData={setData} section="how" title="How It Works" noun="Step" />}
            {tab === "why" && <FeaturesTab data={data} setData={setData} />}
            {tab === "gallery" && <GalleryTab data={data} setData={setData} />}
            {tab === "reviews" && <ReviewsTab data={data} setData={setData} />}
            {tab === "faq" && <FaqTab data={data} setData={setData} />}
            {tab === "importantInfo" && <ImportantInfoTab data={data} setData={setData} />}
            {tab === "cta" && <CtaTab data={data} setData={setData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════ Image crop helpers ════════════════════ */

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    if (!url.startsWith("blob:")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))), "image/jpeg", 0.92);
  });
}

/* ════════════════════ Shared helpers ════════════════════ */

function HeadingEditor({ heading, onChange, showSubtitle = true }: { heading: SectionHeading; onChange: (h: SectionHeading) => void; showSubtitle?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div><label className={lbl}>Kicker</label><input className={inp} value={heading.kicker} onChange={(e) => onChange({ ...heading, kicker: e.target.value })} /></div>
      <div><label className={lbl}>Title (*word* = shimmer)</label><input className={inp} value={heading.title} onChange={(e) => onChange({ ...heading, title: e.target.value })} /></div>
      {showSubtitle && <div className="sm:col-span-2"><label className={lbl}>Subtitle</label><input className={inp} value={heading.subtitle ?? ""} onChange={(e) => onChange({ ...heading, subtitle: e.target.value })} /></div>}
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <h2 className="font-display text-base font-bold">{title}</h2>
      {desc && <p className="mt-1 text-xs text-slate-500">{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/* ════════════════════ Tab Components ════════════════════ */

function SiteTab({ data, setData }: P) {
  const set = (key: keyof SiteData["site"]) => (e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, site: { ...data.site, [key]: e.target.value } });
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  async function uploadLogo(file: File) {
    setLogoUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file, file.name);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!json.url) { alert(json.error || "Upload failed"); return; }
      const newData = { ...data, site: { ...data.site, logoUrl: json.url } };
      setData(newData);
      await fetch("/api/admin/site", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newData) });
    } catch { alert("Logo upload failed. Try again."); }
    finally { setLogoUploading(false); if (logoInputRef.current) logoInputRef.current.value = ""; }
  }

  return (
    <div className="space-y-5">
      {/* Logo */}
      <Card title="Brand Logo" desc="Shown in the navbar. Transparent PNG recommended.">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {/* Preview at actual rendered size */}
            <div className="flex h-16 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
              {data.site.logoUrl ? (
                <img
                  src={data.site.logoUrl}
                  alt="Logo"
                  className="w-auto object-contain"
                  style={{ height: `${data.site.logoSize ?? 40}px` }}
                />
              ) : (
                <span className="text-[10px] text-slate-400">No logo</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={`flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold transition hover:border-brand-500 hover:text-brand-600 dark:border-white/10 ${logoUploading ? "pointer-events-none opacity-60" : ""}`}>
                {logoUploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                {logoUploading ? "Uploading…" : data.site.logoUrl ? "Replace Logo" : "Upload Logo"}
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
              </label>
              {data.site.logoUrl && (
                <button
                  onClick={() => setData({ ...data, site: { ...data.site, logoUrl: "" } })}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="size-3.5" /> Remove Logo
                </button>
              )}
              <p className="text-[10px] text-slate-400">PNG with transparent background works best</p>
            </div>
          </div>

          {/* Size control */}
          {data.site.logoUrl && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className={lbl}>Logo Size in Navbar</label>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{data.site.logoSize ?? 40}px</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setData({ ...data, site: { ...data.site, logoSize: Math.max(24, (data.site.logoSize ?? 40) - 4) } })}
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-200 text-sm font-bold transition hover:border-brand-500 hover:text-brand-600 dark:border-white/10"
                >−</button>
                <input
                  type="range"
                  min={24}
                  max={80}
                  step={4}
                  value={data.site.logoSize ?? 40}
                  onChange={(e) => setData({ ...data, site: { ...data.site, logoSize: Number(e.target.value) } })}
                  className="flex-1 accent-brand-500"
                />
                <button
                  onClick={() => setData({ ...data, site: { ...data.site, logoSize: Math.min(80, (data.site.logoSize ?? 40) + 4) } })}
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-200 text-sm font-bold transition hover:border-brand-500 hover:text-brand-600 dark:border-white/10"
                >+</button>
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>24px (small)</span>
                <span>80px (large)</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card title="Business Information" desc="Name, contact details, coverage — shown across the site.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={lbl}>Business Name</label><input className={inp} value={data.site.name} onChange={set("name")} /></div>
          <div><label className={lbl}>Tagline</label><input className={inp} value={data.site.tagline} onChange={set("tagline")} /></div>
          <div><label className={lbl}>Phone (display)</label><input className={inp} value={data.site.phone} onChange={set("phone")} /></div>
          <div><label className={lbl}>WhatsApp Number</label><input className={inp} value={data.site.whatsappNumber} onChange={set("whatsappNumber")} /></div>
          <div><label className={lbl}>Email</label><input className={inp} value={data.site.email} onChange={set("email")} /></div>
          <div><label className={lbl}>Service Regions</label><input className={inp} value={data.site.regions} onChange={set("regions")} /></div>
        </div>
      </Card>
    </div>
  );
}

function ThemeTab({ data, setData }: P) {
  const setNb = (mode: "navbarLight" | "navbarDark", patch: Partial<SiteData["theme"]["navbarLight"]>) =>
    setData({ ...data, theme: { ...data.theme, [mode]: { ...data.theme[mode], ...patch } } });

  const ColorRow = ({ mode, label, field }: { mode: "navbarLight" | "navbarDark"; label: string; field: "text" | "hover" | "active" }) => {
    const val = data.theme[mode][field];
    return (
      <div className="flex items-center gap-3">
        <input type="color" value={val} onChange={(e) => setNb(mode, { [field]: e.target.value })} className="size-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
        <div className="min-w-0 flex-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
          <input type="text" value={val} onChange={(e) => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && setNb(mode, { [field]: e.target.value })} className="w-full rounded-lg border border-slate-900/10 bg-white/80 px-2 py-1 text-xs font-mono outline-none dark:border-white/10 dark:bg-white/5" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <Card title="Brand Colour Theme" desc="Brand colour for buttons, highlights and accents.">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {Object.entries(THEME_PRESETS).map(([key, preset]) => {
            const active = data.theme.preset === key;
            return (
              <button key={key} onClick={() => setData({ ...data, theme: { ...data.theme, preset: key } })}
                className={`relative rounded-2xl border-2 p-3 text-center transition active:scale-95 ${active ? "border-brand-500" : "border-transparent glass"}`}>
                {active && <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-brand-500 text-white"><Check className="size-3" /></span>}
                <span className="mx-auto flex w-fit overflow-hidden rounded-full">
                  {([300, 400, 500, 600, 700] as const).map((k) => <span key={k} className="size-5" style={{ background: preset.colors[k] }} />)}
                </span>
                <span className="mt-2 block text-[11px] font-bold">{preset.label}</span>
              </button>
            );
          })}
        </div>
        <h3 className="font-display mt-7 text-sm font-bold">Default Mode</h3>
        <div className="mt-3 flex gap-2">
          {(["dark", "light"] as const).map((m) => (
            <button key={m} onClick={() => setData({ ...data, theme: { ...data.theme, defaultMode: m } })}
              className={`rounded-full px-5 py-2 text-xs font-bold capitalize transition ${data.theme.defaultMode === m ? "bg-brand-400 text-slate-950" : "glass text-slate-600 dark:text-slate-300"}`}>{m} mode</button>
          ))}
        </div>
      </Card>

      <Card title="Navbar Colours — Light Mode" desc="Menu text & link colours when the site is in light mode. Over the hero background image, text is always white for readability.">
        <div className="grid gap-3 sm:grid-cols-3">
          <ColorRow mode="navbarLight" label="Text Colour" field="text" />
          <ColorRow mode="navbarLight" label="Hover Colour" field="hover" />
          <ColorRow mode="navbarLight" label="Active Colour" field="active" />
        </div>
        <div className="mt-4 rounded-xl border border-slate-900/10 bg-white p-4 dark:border-white/10">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Preview</p>
          <div className="flex gap-5">
            {["Home", "Services", "Tours", "Contact"].map((l, i) => (
              <span key={l} className="text-sm font-medium" style={{ color: i === 0 ? data.theme.navbarLight.active : data.theme.navbarLight.text }}>{l}</span>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Navbar Colours — Dark Mode" desc="Menu text & link colours when the site is in dark mode.">
        <div className="grid gap-3 sm:grid-cols-3">
          <ColorRow mode="navbarDark" label="Text Colour" field="text" />
          <ColorRow mode="navbarDark" label="Hover Colour" field="hover" />
          <ColorRow mode="navbarDark" label="Active Colour" field="active" />
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-slate-900 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Preview</p>
          <div className="flex gap-5">
            {["Home", "Services", "Tours", "Contact"].map((l, i) => (
              <span key={l} className="text-sm font-medium" style={{ color: i === 0 ? data.theme.navbarDark.active : data.theme.navbarDark.text }}>{l}</span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function NavbarTab({ data, setData }: P) {
  const update = (i: number, patch: Partial<NavLink>) => setData({ ...data, navLinks: data.navLinks.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
  return (
    <Card title="Navbar Links" desc="Navigation links shown in the top menu bar.">
      <div className="space-y-2">
        {data.navLinks.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input className={inp} value={l.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Label" />
            <input className={inp} value={l.href} onChange={(e) => update(i, { href: e.target.value })} placeholder="#section" />
            <button onClick={() => setData({ ...data, navLinks: data.navLinks.filter((_, j) => j !== i) })} className="shrink-0 rounded-lg px-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => setData({ ...data, navLinks: [...data.navLinks, { label: "New Link", href: "#" }] })} className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400"><Plus className="size-3.5" /> Add Link</button>
    </Card>
  );
}

function FooterTab({ data, setData }: P) {
  const updateCol = (ci: number, patch: Partial<FooterColumn>) => setData({ ...data, footerColumns: data.footerColumns.map((c, j) => (j === ci ? { ...c, ...patch } : c)) });
  const updateLink = (ci: number, li: number, patch: Partial<NavLink>) => {
    const links = data.footerColumns[ci].links.map((l, j) => (j === li ? { ...l, ...patch } : l));
    updateCol(ci, { links });
  };
  return (
    <div className="space-y-5">
      {data.footerColumns.map((col, ci) => (
        <Card key={ci} title={`Footer Column: ${col.title}`}>
          <div className="mb-4"><label className={lbl}>Column Title</label><input className={inp} value={col.title} onChange={(e) => updateCol(ci, { title: e.target.value })} /></div>
          <div className="space-y-2">
            {col.links.map((l, li) => (
              <div key={li} className="flex gap-2">
                <input className={inp} value={l.label} onChange={(e) => updateLink(ci, li, { label: e.target.value })} placeholder="Label" />
                <input className={inp} value={l.href} onChange={(e) => updateLink(ci, li, { href: e.target.value })} placeholder="#section" />
                <button onClick={() => updateCol(ci, { links: col.links.filter((_, j) => j !== li) })} className="shrink-0 rounded-lg px-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button onClick={() => updateCol(ci, { links: [...col.links, { label: "New Link", href: "#" }] })} className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400"><Plus className="size-3.5" /> Add Link</button>
            <button onClick={() => setData({ ...data, footerColumns: data.footerColumns.filter((_, j) => j !== ci) })} className="text-xs font-bold text-red-500 hover:underline">Remove Column</button>
          </div>
        </Card>
      ))}
      <button onClick={() => setData({ ...data, footerColumns: [...data.footerColumns, { title: "New Column", links: [] }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add Footer Column</button>
      <Card title="Footer Bottom Text" desc="Copyright line suffix.">
        <input className={inp} value={data.footerBottom} onChange={(e) => setData({ ...data, footerBottom: e.target.value })} />
      </Card>
    </div>
  );
}

function OfferTab({ data, setData }: P) {
  const set = (patch: Partial<SiteData["offer"]>) => setData({ ...data, offer: { ...data.offer, ...patch } });
  return (
    <Card title="Offer Popup" desc="Shows a popup when visitors first open the site. Toggle off to disable.">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => set({ enabled: !data.offer.enabled })}
          className={`relative h-7 w-12 rounded-full transition ${data.offer.enabled ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}>
          <span className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition-all ${data.offer.enabled ? "left-[22px]" : "left-0.5"}`} />
        </button>
        <span className="text-sm font-bold">{data.offer.enabled ? "Active" : "Disabled"}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={lbl}>Title</label><input className={inp} value={data.offer.title} onChange={(e) => set({ title: e.target.value })} /></div>
        <div><label className={lbl}>Button Text</label><input className={inp} value={data.offer.buttonText} onChange={(e) => set({ buttonText: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className={lbl}>Description</label><textarea className={ta} value={data.offer.description} onChange={(e) => set({ description: e.target.value })} /></div>
        <div><label className={lbl}>Button Link (whatsapp / call / custom URL)</label><input className={inp} value={data.offer.buttonLink} onChange={(e) => set({ buttonLink: e.target.value })} /></div>
        <div><label className={lbl}>Dismiss Label</label><input className={inp} value={data.offer.dismissLabel} onChange={(e) => set({ dismissLabel: e.target.value })} /></div>
      </div>
    </Card>
  );
}

function HeroTab({ data, setData }: P) {
  const setHero = (patch: Partial<SiteData["hero"]>) => setData({ ...data, hero: { ...data.hero, ...patch } });
  const setPerk = (i: number, v: string) => { const perks = [...data.hero.perks]; perks[i] = v; setHero({ perks }); };

  const [editSrc, setEditSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [previewCropArea, setPreviewCropArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [directUploading, setDirectUploading] = useState(false);
  const [loadingEditor, setLoadingEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const directUploadRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const cachedImgRef = useRef<HTMLImageElement | null>(null);
  const croppedAreaPixelsRef = useRef<Area | null>(null);

  // Pre-load editSrc into a cached HTMLImageElement for canvas drawing
  useEffect(() => {
    if (!editSrc) { cachedImgRef.current = null; return; }
    const img = new window.Image();
    img.onload = () => {
      cachedImgRef.current = img;
      // If onCropComplete already fired, draw now
      if (previewCanvasRef.current && croppedAreaPixelsRef.current) {
        drawPreview(img, croppedAreaPixelsRef.current);
      }
    };
    img.src = editSrc;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSrc]);

  // Re-draw whenever crop area changes (fires when user drags/zooms)
  useEffect(() => {
    if (!previewCropArea || !cachedImgRef.current || !previewCanvasRef.current) return;
    drawPreview(cachedImgRef.current, previewCropArea);
  }, [previewCropArea]);

  function drawPreview(img: HTMLImageElement, area: Area) {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    croppedAreaPixelsRef.current = pixels;
    setPreviewCropArea(pixels);
  }, []);

  function resetEditorState() {
    croppedAreaPixelsRef.current = null;
    cachedImgRef.current = null;
    setPreviewCropArea(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  function openEditor(file: File) {
    if (editSrc && editSrc.startsWith("blob:")) URL.revokeObjectURL(editSrc);
    resetEditorState();
    setEditSrc(URL.createObjectURL(file));
  }

  async function openEditorUrl(url: string) {
    setLoadingEditor(true);
    if (editSrc && editSrc.startsWith("blob:")) URL.revokeObjectURL(editSrc);
    resetEditorState();
    setEditSrc(null);
    try {
      // Fetch as local blob so canvas can draw cross-origin images without taint
      const res = await fetch(url);
      const blob = await res.blob();
      setEditSrc(URL.createObjectURL(blob));
    } catch {
      setEditSrc(url); // fallback: use URL directly
    } finally {
      setLoadingEditor(false);
    }
  }

  function cancelEdit() {
    if (editSrc && editSrc.startsWith("blob:")) URL.revokeObjectURL(editSrc);
    setEditSrc(null);
    resetEditorState();
  }

  async function uploadDirect(file: File) {
    setDirectUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file, file.name);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.url) { alert(uploadJson.error || "Upload failed"); return; }
      const newData = { ...data, hero: { ...data.hero, heroImage: uploadJson.url } };
      setData(newData);
      const saveRes = await fetch("/api/admin/site", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newData) });
      if (!saveRes.ok) alert("Image uploaded but save failed — click Save manually.");
    } catch (e) {
      console.error(e);
      alert("Upload failed. Try again.");
    } finally {
      setDirectUploading(false);
      if (directUploadRef.current) directUploadRef.current.value = "";
    }
  }

  async function cropAndUpload() {
    if (!editSrc) return;
    const pixels = croppedAreaPixelsRef.current;
    if (!pixels) { alert("Please adjust the crop first, then try again."); return; }
    setUploading(true);
    try {
      const blob = await getCroppedImg(editSrc, pixels);
      const fd = new FormData();
      fd.append("file", blob, "hero-image.jpg");
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.url) { alert(uploadJson.error || "Upload failed"); return; }
      // Save updated URL into local state AND auto-persist to DB
      const newData = { ...data, hero: { ...data.hero, heroImage: uploadJson.url } };
      setData(newData);
      cancelEdit();
      const saveRes = await fetch("/api/admin/site", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newData) });
      if (!saveRes.ok) alert("Image uploaded but save failed — click Save manually.");
    } catch (e) {
      console.error(e);
      alert("Crop & upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card title="Hero Background Image" desc="Upload a high-quality car/road image for the hero section background.">
        {loadingEditor ? (
          <div className="flex h-32 items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="size-5 animate-spin" /> Loading image editor…
          </div>
        ) : editSrc ? (
          /* ── Image Editor Mode ── */
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Crop panel */}
              <div>
                <p className={lbl + " mb-2"}>Drag to reposition · Scroll or use slider to zoom</p>
                <div className="relative h-52 overflow-hidden rounded-xl bg-black">
                  <EasyCropper
                    image={editSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 7}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    classes={{ containerClassName: "rounded-xl" }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))} className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-900/15 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"><ZoomOut className="size-3.5" /></button>
                  <input type="range" min={1} max={3} step={0.02} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-500 dark:bg-slate-700" />
                  <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))} className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-900/15 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"><ZoomIn className="size-3.5" /></button>
                  <span className="w-10 text-right text-xs font-mono text-slate-500">{zoom.toFixed(1)}×</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={cancelEdit} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-900/12 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"><X className="size-3.5" /> Cancel</button>
                  <button onClick={cropAndUpload} disabled={uploading} className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-2.5 text-xs font-bold text-white hover:bg-brand-600 disabled:opacity-60">
                    {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                    {uploading ? "Uploading…" : "Crop & Upload"}
                  </button>
                </div>
              </div>

              {/* Live preview — canvas shows EXACT cropped region */}
              <div>
                <p className={lbl + " mb-2"}>Live Preview</p>
                <div className="relative h-52 overflow-hidden rounded-xl bg-slate-900 shadow-lg">
                  {/* Canvas renders the exact crop selection */}
                  <canvas ref={previewCanvasRef} width={640} height={280} className="absolute inset-0 h-full w-full" />
                  {!previewCropArea && (
                    <div className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-500">Adjust the crop to see preview</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 flex flex-col justify-center px-5 pt-3 pointer-events-none">
                    <span className="mb-1.5 inline-flex w-fit items-center gap-1 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-yellow-300">
                      <span className="size-1.5 rounded-full bg-yellow-400" /> {data.site.tagline || "One Way Taxi"}
                    </span>
                    <p className="font-bold text-white leading-snug" style={{ fontSize: "clamp(12px,2.2vw,18px)" }}>
                      {data.hero.headline.replace(/\*([^*]+)\*/g, "$1") || "Book Your Taxi"}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-300 leading-relaxed line-clamp-2">{data.hero.description || "Fast, reliable outstation taxi service."}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {data.hero.perks.slice(0, 3).map((p) => (
                        <span key={p} className="rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[9px] font-semibold text-white/85">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 w-28 rounded-xl border border-white/10 bg-white/10 px-2.5 py-2 backdrop-blur-sm pointer-events-none">
                    <p className="text-[8px] font-bold text-white mb-1">Quick Booking</p>
                    <div className="space-y-1">
                      <div className="h-2.5 w-full rounded bg-white/20" />
                      <div className="h-2.5 w-full rounded bg-white/20" />
                      <div className="mt-1.5 h-3 w-full rounded bg-green-500/80 text-center text-[7px] font-bold text-white leading-3">Book Now</div>
                    </div>
                  </div>
                </div>
                <p className="mt-1.5 text-[10px] text-slate-500">Preview updates as you adjust the crop.</p>
              </div>
            </div>
          </div>
        ) : (
          /* ── Normal Mode ── */
          <div className="space-y-4">
            {data.hero.heroImage && (
              <div className="relative overflow-hidden rounded-xl">
                <img src={data.hero.heroImage} alt="Hero background" className="h-48 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">Current hero image</span>
                </div>
                <div className="absolute right-2 top-2 flex gap-1.5">
                  <button onClick={() => openEditorUrl(data.hero.heroImage!)} className="flex items-center gap-1.5 rounded-full bg-brand-500/90 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-brand-600">
                    <Crop className="size-3" /> Edit & Crop
                  </button>
                  <button onClick={() => setHero({ heroImage: "" })} className="grid size-7 place-items-center rounded-full bg-red-500/90 text-white hover:bg-red-600"><Trash2 className="size-3" /></button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-900/15 py-4 text-center text-sm font-bold transition hover:border-brand-500/50 hover:bg-brand-400/5 dark:border-white/10">
                <Upload className="size-4" />
                <span>{data.hero.heroImage ? "Replace" : "Upload"} + Crop</span>
                <span className="text-[10px] font-normal text-slate-400">Opens editor</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { e.target.files?.[0] && openEditor(e.target.files[0]); e.target.value = ""; }} />
              </label>
              <label className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-900/15 py-4 text-center text-sm font-bold transition hover:border-brand-500/50 hover:bg-brand-400/5 dark:border-white/10 ${directUploading ? "pointer-events-none opacity-60" : ""}`}>
                {directUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                <span>{directUploading ? "Uploading…" : (data.hero.heroImage ? "Replace" : "Upload")}</span>
                <span className="text-[10px] font-normal text-slate-400">No crop</span>
                <input ref={directUploadRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDirect(f); }} />
              </label>
            </div>
            <div><label className={lbl}>Or paste image URL</label><input className={inp} value={data.hero.heroImage ?? ""} onChange={(e) => setHero({ heroImage: e.target.value })} placeholder="https://images.unsplash.com/..." /></div>
          </div>
        )}
      </Card>
      <Card title="Background Display Mode" desc="How the hero background image is sized on the site.">
        <div className="grid grid-cols-2 gap-3">
          {(["screen", "content"] as const).map((mode) => {
            const active = (data.hero.heroImageFit ?? "screen") === mode;
            return (
              <button
                key={mode}
                onClick={() => setHero({ heroImageFit: mode })}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-left transition ${active ? "border-brand-500 bg-brand-400/10" : "border-slate-200 hover:border-brand-400/50 dark:border-white/10"}`}
              >
                <div className={`w-full rounded-lg overflow-hidden border ${active ? "border-brand-400/50" : "border-slate-200 dark:border-white/10"}`} style={{ height: 56 }}>
                  {mode === "screen" ? (
                    <div className="h-full w-full bg-slate-700 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-br from-slate-500 to-slate-800 flex items-end pb-1 pl-1">
                        <div className="text-[6px] text-white/60 font-bold">FILLS SCREEN</div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full bg-slate-900 flex flex-col">
                      <div className="flex-1 bg-gradient-to-br from-slate-500 to-slate-700" style={{ maxHeight: 30 }} />
                      <div className="flex-1 bg-slate-900" />
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-bold ${active ? "text-brand-600 dark:text-brand-400" : ""}`}>
                    {mode === "screen" ? "Fill Screen" : "Fit to Content"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {mode === "screen" ? "Image covers full viewport height" : "Full image shown at top, no cropping"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
      <Card title="Hero Content" desc="*word* = shimmer highlight.">
        <div className="space-y-4">
          <div><label className={lbl}>Headline</label><input className={inp} value={data.hero.headline} onChange={(e) => setHero({ headline: e.target.value })} /></div>
          <div><label className={lbl}>Description</label><textarea className={ta} value={data.hero.description} onChange={(e) => setHero({ description: e.target.value })} /></div>
        </div>
      </Card>
      <Card title="Hero Perks" desc="Short badges below the hero.">
        <div className="space-y-2">
          {data.hero.perks.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input className={inp} value={p} onChange={(e) => setPerk(i, e.target.value)} />
              <button onClick={() => setHero({ perks: data.hero.perks.filter((_, j) => j !== i) })} className="shrink-0 rounded-lg px-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setHero({ perks: [...data.hero.perks, "New perk"] })} className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400"><Plus className="size-3.5" /> Add Perk</button>
      </Card>
    </div>
  );
}

function StatsTab({ data, setData }: P) {
  const update = (i: number, patch: Partial<StatItem>) => setData({ ...data, stats: data.stats.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  return (
    <div className="space-y-3">
      <Card title="Stats Counters" desc="Animated numbers on the homepage."><div /></Card>
      {data.stats.map((s, i) => (
        <section key={i} className="glass grid grid-cols-2 gap-3 rounded-2xl p-4 sm:grid-cols-5 sm:items-end">
          <div><label className={lbl}>Value</label><input className={inp} type="number" value={s.value} onChange={(e) => update(i, { value: Number(e.target.value) })} /></div>
          <div><label className={lbl}>Suffix</label><input className={inp} value={s.suffix} onChange={(e) => update(i, { suffix: e.target.value })} /></div>
          <div><label className={lbl}>Label</label><input className={inp} value={s.label} onChange={(e) => update(i, { label: e.target.value })} /></div>
          <div><label className={lbl}>Decimals</label><input className={inp} type="number" value={s.decimals ?? 0} onChange={(e) => update(i, { decimals: Number(e.target.value) })} /></div>
          <button onClick={() => setData({ ...data, stats: data.stats.filter((_, j) => j !== i) })} className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /> Remove</button>
        </section>
      ))}
      <button onClick={() => setData({ ...data, stats: [...data.stats, { value: 0, suffix: "+", label: "New" }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add Stat</button>
    </div>
  );
}

function CitiesTab({ data, setData }: P) {
  const update = (i: number, v: string) => { const c = [...data.cities]; c[i] = v; setData({ ...data, cities: c }); };
  return (
    <Card title="Cities Marquee" desc="Scrolling city names below the hero.">
      <div className="flex flex-wrap gap-2">
        {data.cities.map((c, i) => (
          <div key={i} className="flex items-center gap-1 rounded-full border border-slate-900/10 py-1 pl-3 pr-1 dark:border-white/10">
            <input className="w-28 border-none bg-transparent text-sm outline-none" value={c} onChange={(e) => update(i, e.target.value)} />
            <button onClick={() => setData({ ...data, cities: data.cities.filter((_, j) => j !== i) })} className="grid size-6 place-items-center rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="size-3" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => setData({ ...data, cities: [...data.cities, "New City"] })} className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400"><Plus className="size-3.5" /> Add City</button>
    </Card>
  );
}

// Reusable for trustBadges and infoStrip
function ListTab({ data, setData, field, title, desc }: P & { field: "trustBadges" | "infoStrip"; title: string; desc: string }) {
  const items = data[field];
  const update = (i: number, v: string) => { const a = [...items]; a[i] = v; setData({ ...data, [field]: a }); };
  return (
    <Card title={title} desc={desc}>
      <div className="space-y-2">
        {items.map((b, i) => (
          <div key={i} className="flex gap-2">
            <input className={inp} value={b} onChange={(e) => update(i, e.target.value)} />
            <button onClick={() => setData({ ...data, [field]: items.filter((_, j) => j !== i) })} className="shrink-0 rounded-lg px-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => setData({ ...data, [field]: [...items, "New item"] })} className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400"><Plus className="size-3.5" /> Add Item</button>
    </Card>
  );
}

function ServicesTab({ data, setData }: P) {
  const setSvc = (patch: Partial<SiteData["services"]>) => setData({ ...data, services: { ...data.services, ...patch } });
  const updateItem = (i: number, patch: Partial<ServiceItem>) => setSvc({ items: data.services.items.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  return (
    <div className="space-y-4">
      <Card title="Services Section Heading"><HeadingEditor heading={{ kicker: data.services.kicker, title: data.services.title, subtitle: data.services.subtitle }} onChange={(h) => setSvc({ kicker: h.kicker, title: h.title, subtitle: h.subtitle })} /></Card>
      {data.services.items.map((s, i) => (
        <section key={i} className="glass grid grid-cols-[1fr_auto] items-start gap-3 rounded-2xl p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className={lbl}>Title</label><input className={inp} value={s.title} onChange={(e) => updateItem(i, { title: e.target.value })} /></div>
            <div><label className={lbl}>Description</label><input className={inp} value={s.desc} onChange={(e) => updateItem(i, { desc: e.target.value })} /></div>
            <div><label className={lbl}>Icon Name</label><input className={inp} value={s.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} placeholder="ArrowRight, Plane..." /></div>
          </div>
          <button onClick={() => setSvc({ items: data.services.items.filter((_, j) => j !== i) })} className="mt-5 shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
        </section>
      ))}
      <button onClick={() => setSvc({ items: [...data.services.items, { title: "New Service", desc: "Description", icon: "Car" }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add Service</button>
    </div>
  );
}

function VehiclesTab({ data, setData }: P) {
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [uploading, setUploading] = useState<number | null>(null);
  const update = (i: number, patch: Partial<VehicleDoc>) => setData({ ...data, vehicles: data.vehicles.map((v, j) => (j === i ? { ...v, ...patch } : v)) });
  async function upload(i: number, file: File) {
    setUploading(i);
    try { const fd = new FormData(); fd.append("file", file); const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const j = await res.json(); if (j.url) update(i, { image: j.url }); else alert(j.error || "Upload failed"); } catch { alert("Upload failed"); } finally { setUploading(null); }
  }
  return (
    <div className="space-y-4">
      <Card title="Tariff Heading"><HeadingEditor heading={data.tariffHead} onChange={(tariffHead) => setData({ ...data, tariffHead })} /></Card>
      {data.vehicles.map((v, i) => (
        <section key={i} className="glass rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-start gap-4">
            <div className="w-36 shrink-0">
              <div className="relative h-20 w-36 overflow-hidden rounded-xl bg-slate-900/5 dark:bg-white/5">
                {v.image ? <Image src={v.image} alt={v.name} fill sizes="144px" className="object-contain p-1" unoptimized /> : <span className="grid h-full place-items-center text-[10px] text-slate-400">No image</span>}
              </div>
              <input ref={(el) => { fileRefs.current[i] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(i, e.target.files[0])} />
              <button onClick={() => fileRefs.current[i]?.click()} disabled={uploading === i} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand-500/40 py-1.5 text-[11px] font-bold text-brand-600 hover:bg-brand-400/10 dark:text-brand-400">
                {uploading === i ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />} {uploading === i ? "Uploading..." : "Change Image"}
              </button>
            </div>
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1"><label className={lbl}>Name</label><input className={inp} value={v.name} onChange={(e) => update(i, { name: e.target.value })} /></div>
              <div><label className={lbl}>Seats</label><input className={inp} value={v.seats} onChange={(e) => update(i, { seats: e.target.value })} /></div>
              <div><label className={lbl}>Tag</label><input className={inp} value={v.tag ?? ""} onChange={(e) => update(i, { tag: e.target.value || undefined })} /></div>
              <div><label className={lbl}>AC One Way/km</label><input className={inp} type="number" value={v.oneWayRate} onChange={(e) => update(i, { oneWayRate: Number(e.target.value) })} /></div>
              <div><label className={lbl}>AC Round/km</label><input className={inp} type="number" value={v.roundRate} onChange={(e) => update(i, { roundRate: Number(e.target.value) })} /></div>
              <div><label className={lbl}>Non-AC One Way/km</label><input className={inp} type="number" value={v.nonAcOneWayRate ?? v.oneWayRate} onChange={(e) => update(i, { nonAcOneWayRate: Number(e.target.value) })} /></div>
              <div><label className={lbl}>Non-AC Round/km</label><input className={inp} type="number" value={v.nonAcRoundRate ?? v.roundRate} onChange={(e) => update(i, { nonAcRoundRate: Number(e.target.value) })} /></div>
              <div><label className={lbl}>Bata 1-Way</label><input className={inp} type="number" value={v.bataOneWay} onChange={(e) => update(i, { bataOneWay: Number(e.target.value) })} /></div>
              <div><label className={lbl}>Bata Round</label><input className={inp} type="number" value={v.bataRound} onChange={(e) => update(i, { bataRound: Number(e.target.value) })} /></div>
              <div className="flex items-end"><button onClick={() => setData({ ...data, vehicles: data.vehicles.filter((_, j) => j !== i) })} className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /> Remove</button></div>
            </div>
          </div>
        </section>
      ))}
      <button onClick={() => setData({ ...data, vehicles: [...data.vehicles, { name: "New Vehicle", seats: "4 + 1", oneWayRate: 15, roundRate: 14, nonAcOneWayRate: 14, nonAcRoundRate: 13, bataOneWay: 500, bataRound: 500, image: "" }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add Vehicle</button>
    </div>
  );
}

function RoutesTab({ data, setData }: P) {
  const update = (i: number, patch: Partial<RouteDoc>) => setData({ ...data, routes: data.routes.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  return (
    <div className="space-y-3">
      <Card title="Routes Heading"><HeadingEditor heading={data.routesHead} onChange={(routesHead) => setData({ ...data, routesHead })} /></Card>
      {data.routes.map((r, i) => (
        <section key={i} className="glass grid grid-cols-2 gap-3 rounded-2xl p-4 sm:grid-cols-6 sm:items-end">
          <div><label className={lbl}>From</label><input className={inp} value={r.from} onChange={(e) => update(i, { from: e.target.value })} /></div>
          <div><label className={lbl}>To</label><input className={inp} value={r.to} onChange={(e) => update(i, { to: e.target.value })} /></div>
          <div><label className={lbl}>Km</label><input className={inp} type="number" value={r.km} onChange={(e) => update(i, { km: Number(e.target.value) })} /></div>
          <div><label className={lbl}>Time</label><input className={inp} value={r.time} onChange={(e) => update(i, { time: e.target.value })} /></div>
          <div><label className={lbl}>Fare</label><input className={inp} type="number" value={r.fare} onChange={(e) => update(i, { fare: Number(e.target.value) })} /></div>
          <button onClick={() => setData({ ...data, routes: data.routes.filter((_, j) => j !== i) })} className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /> Remove</button>
        </section>
      ))}
      <button onClick={() => setData({ ...data, routes: [...data.routes, { from: "Chennai", to: "", km: 0, time: "", fare: 0 }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add Route</button>
    </div>
  );
}

function CityServicesTab({ data, setData }: P) {
  const updateF = (i: number, patch: Partial<ServiceCityItem>) => setData({ ...data, featuredCities: data.featuredCities.map((c, j) => (j === i ? { ...c, ...patch } : c)) });
  const updateA = (i: number, v: string) => { const a = [...data.allCities]; a[i] = v; setData({ ...data, allCities: a }); };
  return (
    <div className="space-y-5">
      <Card title="City Services Heading"><HeadingEditor heading={data.cityServiceHead} onChange={(cityServiceHead) => setData({ ...data, cityServiceHead })} /></Card>
      <Card title="Featured Cities" desc="Major city service cards.">
        <div className="space-y-3">
          {data.featuredCities.map((c, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-slate-900/10 p-3 dark:border-white/10">
              <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
                <div><label className={lbl}>City</label><input className={inp} value={c.name} onChange={(e) => updateF(i, { name: e.target.value })} /></div>
                <div><label className={lbl}>Description</label><input className={inp} value={c.desc} onChange={(e) => updateF(i, { desc: e.target.value })} /></div>
              </div>
              <button onClick={() => setData({ ...data, featuredCities: data.featuredCities.filter((_, j) => j !== i) })} className="self-center rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setData({ ...data, featuredCities: [...data.featuredCities, { name: "New City", desc: "One way taxi • Outstation • Airport drop" }] })} className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400"><Plus className="size-3.5" /> Add Featured City</button>
      </Card>
      <Card title="All Cities Grid" desc="City tags shown below featured cards.">
        <div className="flex flex-wrap gap-2">
          {data.allCities.map((c, i) => (
            <div key={i} className="flex items-center gap-1 rounded-full border border-slate-900/10 py-1 pl-3 pr-1 dark:border-white/10">
              <input className="w-28 border-none bg-transparent text-sm outline-none" value={c} onChange={(e) => updateA(i, e.target.value)} />
              <button onClick={() => setData({ ...data, allCities: data.allCities.filter((_, j) => j !== i) })} className="grid size-6 place-items-center rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="size-3" /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setData({ ...data, allCities: [...data.allCities, "New City"] })} className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400"><Plus className="size-3.5" /> Add City</button>
      </Card>
    </div>
  );
}

function StepsTab({ data, setData, section, title, noun }: P & { section: "how"; title: string; noun: string }) {
  const sec = data[section];
  const setSec = (patch: Partial<typeof sec>) => setData({ ...data, [section]: { ...sec, ...patch } });
  const updateStep = (i: number, patch: Partial<StepItem>) => setSec({ steps: sec.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)) } as Partial<typeof sec>);
  return (
    <div className="space-y-4">
      <Card title={`${title} - Heading`}><HeadingEditor heading={{ kicker: sec.kicker, title: sec.title, subtitle: sec.subtitle }} onChange={(h) => setSec({ kicker: h.kicker, title: h.title, subtitle: h.subtitle } as Partial<typeof sec>)} /></Card>
      {sec.steps.map((s, i) => (
        <section key={i} className="glass flex items-start gap-3 rounded-2xl p-4 sm:p-5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-400/15 text-sm font-bold text-brand-600 dark:text-brand-400">{i + 1}</span>
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
            <div><label className={lbl}>Title</label><input className={inp} value={s.title} onChange={(e) => updateStep(i, { title: e.target.value })} /></div>
            <div><label className={lbl}>Description</label><input className={inp} value={s.desc} onChange={(e) => updateStep(i, { desc: e.target.value })} /></div>
          </div>
          <button onClick={() => setSec({ steps: sec.steps.filter((_, j) => j !== i) } as Partial<typeof sec>)} className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
        </section>
      ))}
      <button onClick={() => setSec({ steps: [...sec.steps, { title: `New ${noun}`, desc: "Description" }] } as Partial<typeof sec>)} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add {noun}</button>
    </div>
  );
}

function FeaturesTab({ data, setData }: P) {
  const setWhy = (patch: Partial<SiteData["why"]>) => setData({ ...data, why: { ...data.why, ...patch } });
  const updateF = (i: number, patch: Partial<StepItem>) => setWhy({ features: data.why.features.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
  return (
    <div className="space-y-4">
      <Card title="Why Choose Us - Heading"><HeadingEditor heading={{ kicker: data.why.kicker, title: data.why.title, subtitle: data.why.subtitle }} onChange={(h) => setWhy({ kicker: h.kicker, title: h.title, subtitle: h.subtitle })} /></Card>
      {data.why.features.map((f, i) => (
        <section key={i} className="glass grid grid-cols-[1fr_auto] items-start gap-3 rounded-2xl p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className={lbl}>Title</label><input className={inp} value={f.title} onChange={(e) => updateF(i, { title: e.target.value })} /></div>
            <div><label className={lbl}>Description</label><input className={inp} value={f.desc} onChange={(e) => updateF(i, { desc: e.target.value })} /></div>
          </div>
          <button onClick={() => setWhy({ features: data.why.features.filter((_, j) => j !== i) })} className="mt-5 shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
        </section>
      ))}
      <button onClick={() => setWhy({ features: [...data.why.features, { title: "New Feature", desc: "Description" }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add Feature</button>
    </div>
  );
}

function GalleryTab({ data, setData }: P) {
  const setG = (patch: Partial<SiteData["gallery"]>) => setData({ ...data, gallery: { ...data.gallery, ...patch } });
  const updateItem = (i: number, patch: Partial<GalleryItem>) => setG({ items: data.gallery.items.map((g, j) => (j === i ? { ...g, ...patch } : g)) });
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [uploading, setUploading] = useState<number | null>(null);

  async function upload(i: number, file: File) {
    setUploading(i);
    try { const fd = new FormData(); fd.append("file", file); const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const j = await res.json(); if (j.url) updateItem(i, { image: j.url }); else alert(j.error || "Upload failed"); } catch { alert("Upload failed"); } finally { setUploading(null); }
  }

  return (
    <div className="space-y-4">
      <Card title="Gallery Section Heading"><HeadingEditor heading={{ kicker: data.gallery.kicker, title: data.gallery.title, subtitle: data.gallery.subtitle }} onChange={(h) => setG({ kicker: h.kicker, title: h.title, subtitle: h.subtitle })} /></Card>
      {data.gallery.items.map((g, i) => (
        <section key={i} className="glass flex items-start gap-4 rounded-2xl p-4 sm:p-5">
          <div className="w-28 shrink-0">
            <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-slate-900/5 dark:bg-white/5">
              {g.image ? <Image src={g.image} alt={g.caption || ""} fill sizes="112px" className="object-cover" unoptimized /> : <span className="grid h-full place-items-center text-[10px] text-slate-400">No image</span>}
            </div>
            <input ref={(el) => { fileRefs.current[i] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(i, e.target.files[0])} />
            <button onClick={() => fileRefs.current[i]?.click()} disabled={uploading === i} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand-500/40 py-1.5 text-[11px] font-bold text-brand-600 hover:bg-brand-400/10 dark:text-brand-400">
              {uploading === i ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />} {uploading === i ? "Uploading..." : "Upload"}
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <label className={lbl}>Caption</label>
            <input className={inp} value={g.caption} onChange={(e) => updateItem(i, { caption: e.target.value })} placeholder="Photo description..." />
          </div>
          <button onClick={() => setG({ items: data.gallery.items.filter((_, j) => j !== i) })} className="mt-5 shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
        </section>
      ))}
      <button onClick={() => setG({ items: [...data.gallery.items, { image: "", caption: "" }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add Photo</button>
    </div>
  );
}

function ReviewsTab({ data, setData }: P) {
  const setR = (patch: Partial<SiteData["reviews"]>) => setData({ ...data, reviews: { ...data.reviews, ...patch } });
  const update = (i: number, patch: Partial<ReviewItem>) => setR({ items: data.reviews.items.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  return (
    <div className="space-y-4">
      <Card title="Testimonials Heading"><HeadingEditor heading={{ kicker: data.reviews.kicker, title: data.reviews.title, subtitle: data.reviews.subtitle }} onChange={(h) => setR({ kicker: h.kicker, title: h.title, subtitle: h.subtitle })} showSubtitle={false} /></Card>
      {data.reviews.items.map((r, i) => (
        <section key={i} className="glass rounded-2xl p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className={lbl}>Name</label><input className={inp} value={r.name} onChange={(e) => update(i, { name: e.target.value })} /></div>
            <div><label className={lbl}>Trip</label><input className={inp} value={r.trip} onChange={(e) => update(i, { trip: e.target.value })} /></div>
            <div className="flex items-end"><button onClick={() => setR({ items: data.reviews.items.filter((_, j) => j !== i) })} className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /> Remove</button></div>
          </div>
          <div className="mt-3"><label className={lbl}>Review</label><textarea className={ta} value={r.text} onChange={(e) => update(i, { text: e.target.value })} /></div>
        </section>
      ))}
      <button onClick={() => setR({ items: [...data.reviews.items, { name: "Customer", trip: "City A to City B", text: "Great service!" }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add Review</button>
    </div>
  );
}

function FaqTab({ data, setData }: P) {
  const setF = (patch: Partial<SiteData["faq"]>) => setData({ ...data, faq: { ...data.faq, ...patch } });
  const update = (i: number, patch: Partial<FaqItem>) => setF({ items: data.faq.items.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
  return (
    <div className="space-y-4">
      <Card title="FAQ Heading"><HeadingEditor heading={{ kicker: data.faq.kicker, title: data.faq.title, subtitle: data.faq.subtitle }} onChange={(h) => setF({ kicker: h.kicker, title: h.title, subtitle: h.subtitle })} showSubtitle={false} /></Card>
      {data.faq.items.map((f, i) => (
        <section key={i} className="glass rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-brand-400/15 text-[10px] font-bold text-brand-600 dark:text-brand-400">{i + 1}</span>
            <div className="min-w-0 flex-1 space-y-3">
              <div><label className={lbl}>Question</label><input className={inp} value={f.q} onChange={(e) => update(i, { q: e.target.value })} /></div>
              <div><label className={lbl}>Answer</label><textarea className={ta} value={f.a} onChange={(e) => update(i, { a: e.target.value })} /></div>
            </div>
            <button onClick={() => setF({ items: data.faq.items.filter((_, j) => j !== i) })} className="mt-5 shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
          </div>
        </section>
      ))}
      <button onClick={() => setF({ items: [...data.faq.items, { q: "New question?", a: "Answer." }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add FAQ</button>
    </div>
  );
}

function ImportantInfoTab({ data, setData }: P) {
  const setCol = (key: "general" | "oneWay" | "roundTrip", patch: Partial<TravelTermsColumn>) => setData({ ...data, importantInfo: { ...data.importantInfo, [key]: { ...data.importantInfo[key], ...patch } } });
  const updateItem = (key: "general" | "oneWay" | "roundTrip", i: number, v: string) => { const items = [...data.importantInfo[key].items]; items[i] = v; setCol(key, { items }); };
  const cols: { key: "general" | "oneWay" | "roundTrip"; label: string }[] = [
    { key: "general", label: "General Information" }, { key: "oneWay", label: "One Way Terms" }, { key: "roundTrip", label: "Round Trip Terms" },
  ];
  return (
    <div className="space-y-5">
      {cols.map((col) => (
        <Card key={col.key} title={col.label}>
          <div className="mb-4"><label className={lbl}>Column Title</label><input className={inp} value={data.importantInfo[col.key].title} onChange={(e) => setCol(col.key, { title: e.target.value })} /></div>
          <div className="space-y-2">
            {data.importantInfo[col.key].items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input className={inp} value={item} onChange={(e) => updateItem(col.key, i, e.target.value)} />
                <button onClick={() => setCol(col.key, { items: data.importantInfo[col.key].items.filter((_, j) => j !== i) })} className="shrink-0 rounded-lg px-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setCol(col.key, { items: [...data.importantInfo[col.key].items, "New item"] })} className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400"><Plus className="size-3.5" /> Add Item</button>
        </Card>
      ))}
    </div>
  );
}

function CtaTab({ data, setData }: P) {
  const set = (patch: Partial<SiteData["cta"]>) => setData({ ...data, cta: { ...data.cta, ...patch } });
  return (
    <Card title="CTA Banner" desc="Bottom banner prompting visitors to book.">
      <div className="space-y-4">
        <div><label className={lbl}>Title</label><input className={inp} value={data.cta.title} onChange={(e) => set({ title: e.target.value })} /></div>
        <div><label className={lbl}>Subtitle</label><textarea className={ta} value={data.cta.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></div>
      </div>
    </Card>
  );
}

function ToursTab({ data, setData }: P) {
  const setT = (patch: Partial<SiteData["tours"]>) => setData({ ...data, tours: { ...data.tours, ...patch } });
  const updateItem = (i: number, patch: Partial<TourPackage>) => setT({ items: data.tours.items.map((t, j) => (j === i ? { ...t, ...patch } : t)) });
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [uploading, setUploading] = useState<number | null>(null);

  async function upload(i: number, file: File) {
    setUploading(i);
    try { const fd = new FormData(); fd.append("file", file); const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const j = await res.json(); if (j.url) updateItem(i, { image: j.url }); else alert(j.error || "Upload failed"); } catch { alert("Upload failed"); } finally { setUploading(null); }
  }

  const updateHighlight = (ti: number, hi: number, v: string) => { const h = [...data.tours.items[ti].highlights]; h[hi] = v; updateItem(ti, { highlights: h }); };
  const updateInclusion = (ti: number, ii: number, v: string) => { const inc = [...data.tours.items[ti].inclusions]; inc[ii] = v; updateItem(ti, { inclusions: inc }); };

  return (
    <div className="space-y-4">
      <Card title="Tour Packages Heading"><HeadingEditor heading={{ kicker: data.tours.kicker, title: data.tours.title, subtitle: data.tours.subtitle }} onChange={(h) => setT({ kicker: h.kicker, title: h.title, subtitle: h.subtitle })} /></Card>
      {data.tours.items.map((t, i) => (
        <section key={i} className="glass rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="w-28 shrink-0">
              <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-slate-900/5 dark:bg-white/5">
                {t.image ? <Image src={t.image} alt={t.title} fill sizes="112px" className="object-cover" unoptimized /> : <span className="grid h-full place-items-center text-[10px] text-slate-400">No image</span>}
              </div>
              <input ref={(el) => { fileRefs.current[i] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(i, e.target.files[0])} />
              <button onClick={() => fileRefs.current[i]?.click()} disabled={uploading === i} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand-500/40 py-1.5 text-[11px] font-bold text-brand-600 hover:bg-brand-400/10 dark:text-brand-400">
                {uploading === i ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />} {uploading === i ? "..." : "Upload"}
              </button>
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div><label className={lbl}>Title</label><input className={inp} value={t.title} onChange={(e) => updateItem(i, { title: e.target.value })} /></div>
                <div><label className={lbl}>Duration</label><input className={inp} value={t.duration} onChange={(e) => updateItem(i, { duration: e.target.value })} placeholder="2 Days / 1 Night" /></div>
                <div className="flex items-end gap-3">
                  <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-slate-900/15 bg-white/80 px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
                    <input type="checkbox" checked={t.includesCar !== false} onChange={(e) => updateItem(i, { includesCar: e.target.checked })} className="accent-brand-500" />
                    <span className="text-xs font-bold">Includes Car</span>
                  </label>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className={lbl}>{t.includesCar !== false ? "AC Price" : "Package Price"}</label><input className={inp} value={t.price} onChange={(e) => updateItem(i, { price: e.target.value })} placeholder="₹4,999" /></div>
                {t.includesCar !== false && (
                  <div><label className={lbl}>Non-AC Price</label><input className={inp} value={t.nonAcPrice ?? ""} onChange={(e) => updateItem(i, { nonAcPrice: e.target.value })} placeholder="₹4,499" /></div>
                )}
              </div>
              <div><label className={lbl}>Description</label><textarea className={ta} value={t.description} onChange={(e) => updateItem(i, { description: e.target.value })} /></div>
              <div>
                <label className={lbl}>Highlights</label>
                <div className="space-y-1.5">
                  {t.highlights.map((h, hi) => (
                    <div key={hi} className="flex gap-2">
                      <input className={inp} value={h} onChange={(e) => updateHighlight(i, hi, e.target.value)} />
                      <button onClick={() => updateItem(i, { highlights: t.highlights.filter((_, j) => j !== hi) })} className="shrink-0 rounded-lg px-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3" /></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => updateItem(i, { highlights: [...t.highlights, "New highlight"] })} className="mt-1.5 text-[11px] font-bold text-brand-600 dark:text-brand-400"><Plus className="inline size-3" /> Add</button>
              </div>
              <div>
                <label className={lbl}>Inclusions</label>
                <div className="space-y-1.5">
                  {t.inclusions.map((inc, ii) => (
                    <div key={ii} className="flex gap-2">
                      <input className={inp} value={inc} onChange={(e) => updateInclusion(i, ii, e.target.value)} />
                      <button onClick={() => updateItem(i, { inclusions: t.inclusions.filter((_, j) => j !== ii) })} className="shrink-0 rounded-lg px-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3" /></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => updateItem(i, { inclusions: [...t.inclusions, "New inclusion"] })} className="mt-1.5 text-[11px] font-bold text-brand-600 dark:text-brand-400"><Plus className="inline size-3" /> Add</button>
              </div>
            </div>
            <button onClick={() => setT({ items: data.tours.items.filter((_, j) => j !== i) })} className="mt-5 shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
          </div>
        </section>
      ))}
      <button onClick={() => setT({ items: [...data.tours.items, { title: "New Tour", image: "", duration: "1 Day", price: "₹2,999", nonAcPrice: "₹2,599", includesCar: true, description: "Tour description", highlights: [], inclusions: [] }] })} className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400"><Plus className="size-4" /> Add Tour Package</button>
    </div>
  );
}

const DEST_TYPES = ["city", "temple", "hill", "coastal", "business", "scenic"];

function DestinationsTab({ data, setData }: P) {
  const setHead = (patch: Partial<SiteData["destinationsHead"]>) =>
    setData({ ...data, destinationsHead: { ...data.destinationsHead, ...patch } });
  const update = (i: number, patch: Partial<DestinationItem>) =>
    setData({ ...data, destinations: data.destinations.map((d, j) => (j === i ? { ...d, ...patch } : d)) });
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [uploading, setUploading] = useState<number | null>(null);

  async function upload(i: number, file: File) {
    setUploading(i);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j.url) {
        const newDestinations = data.destinations.map((dest, idx) =>
          idx === i ? { ...dest, image: j.url } : dest
        );
        const newData = { ...data, destinations: newDestinations };
        setData(newData);
        const saveRes = await fetch("/api/admin/site", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        });
        if (!saveRes.ok) alert("Image uploaded but save failed — click Save manually.");
      } else {
        alert(j.error || "Upload failed");
      }
    } catch { alert("Upload failed"); } finally { setUploading(null); }
  }

  return (
    <div className="space-y-4">
      <Card title="Section Heading">
        <HeadingEditor heading={data.destinationsHead} onChange={setHead} />
      </Card>

      <Card title="Cards Per Row" desc="Choose how many destination cards appear side-by-side.">
        <div className="flex gap-3">
          {([1, 2] as const).map((col) => {
            const active = (data.destinationsColumns ?? 2) === col;
            return (
              <button
                key={col}
                onClick={() => setData({ ...data, destinationsColumns: col })}
                className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 py-4 transition ${active ? "border-brand-500 bg-brand-400/10" : "border-slate-200 hover:border-brand-400/50 dark:border-white/10"}`}
              >
                <div className={`flex gap-1 ${active ? "opacity-100" : "opacity-50"}`}>
                  {Array.from({ length: col }).map((_, j) => (
                    <div key={j} className="h-10 w-12 rounded-md bg-slate-300 dark:bg-slate-600" />
                  ))}
                </div>
                <span className={`text-xs font-bold ${active ? "text-brand-600 dark:text-brand-400" : ""}`}>
                  {col === 1 ? "1 per row — Full width" : "2 per row — Side by side"}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {data.destinations.map((dest, i) => (
        <section key={i} className="glass flex items-start gap-4 rounded-2xl p-4 sm:p-5">
          {/* Image preview + upload */}
          <div className="w-28 shrink-0">
            <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-slate-900/5 dark:bg-white/5">
              {dest.image
                ? <img src={dest.image} alt={dest.name} className="h-full w-full object-cover" />
                : <span className="grid h-full place-items-center text-[10px] text-slate-400">No image</span>}
            </div>
            <input ref={(el) => { fileRefs.current[i] = el; }} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(i, e.target.files[0])} />
            <button onClick={() => fileRefs.current[i]?.click()} disabled={uploading === i}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-brand-500/40 py-1.5 text-[11px] font-bold text-brand-600 hover:bg-brand-400/10 dark:text-brand-400">
              {uploading === i ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
              {uploading === i ? "..." : "Upload"}
            </button>
          </div>

          {/* Fields */}
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
            <div><label className={lbl}>City Name</label><input className={inp} value={dest.name} onChange={(e) => update(i, { name: e.target.value })} /></div>
            <div><label className={lbl}>Subtitle</label><input className={inp} value={dest.subtitle} onChange={(e) => update(i, { subtitle: e.target.value })} /></div>
            <div>
              <label className={lbl}>Type (badge)</label>
              <select className={inp} value={dest.type} onChange={(e) => update(i, { type: e.target.value })}>
                {DEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={lbl}>Image URL</label><input className={inp} value={dest.image} onChange={(e) => update(i, { image: e.target.value })} placeholder="https://..." /></div>
          </div>

          <button onClick={() => setData({ ...data, destinations: data.destinations.filter((_, j) => j !== i) })}
            className="mt-5 shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
        </section>
      ))}

      <button
        onClick={() => setData({ ...data, destinations: [...data.destinations, { name: "New City", subtitle: "City travel", type: "city", image: "" }] })}
        className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-brand-600 hover:border-brand-500/50 dark:text-brand-400">
        <Plus className="size-4" /> Add Destination
      </button>
    </div>
  );
}

function CustomThemesTab({ data, setData }: P) {
  const update = (i: number, patch: Partial<ThemePreset>) => setData({ ...data, customThemes: data.customThemes.map((t, j) => (j === i ? { ...t, ...patch } : t)) });
  const updateColor = (i: number, key: keyof ThemePreset["colors"], v: string) => {
    const colors = { ...data.customThemes[i].colors, [key]: v };
    update(i, { colors });
  };

  function hexToShades(hex: string): ThemePreset["colors"] {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    const lighten = (r: number, g: number, b: number, a: number) => `#${[r,g,b].map(c => Math.min(255, Math.round(c + (255-c)*a)).toString(16).padStart(2,"0")).join("")}`;
    const darken = (r: number, g: number, b: number, a: number) => `#${[r,g,b].map(c => Math.max(0, Math.round(c*(1-a))).toString(16).padStart(2,"0")).join("")}`;
    return { 300: lighten(r,g,b,0.4), 400: lighten(r,g,b,0.15), 500: hex, 600: darken(r,g,b,0.15), 700: darken(r,g,b,0.3) };
  }

  return (
    <Card title="User Custom Themes" desc="Extra colour themes visible in the site's theme picker. Users can also create their own on-the-fly.">
      <div className="space-y-3">
        {(data.customThemes ?? []).map((t, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-900/10 p-3 dark:border-white/10">
            <input type="color" value={t.colors[500]} onChange={(e) => update(i, { colors: hexToShades(e.target.value) })} className="size-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
            <div className="flex overflow-hidden rounded-full">
              {([300,400,500,600,700] as const).map((k) => <span key={k} className="size-5" style={{ background: t.colors[k] }} />)}
            </div>
            <input className={`${inp} max-w-40`} value={t.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Theme Name" />
            <button onClick={() => setData({ ...data, customThemes: data.customThemes.filter((_, j) => j !== i) })} className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 className="size-3.5" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => setData({ ...data, customThemes: [...(data.customThemes ?? []), { label: "Custom", colors: { 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309" } }] })} className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400"><Plus className="size-3.5" /> Add Custom Theme</button>
    </Card>
  );
}
