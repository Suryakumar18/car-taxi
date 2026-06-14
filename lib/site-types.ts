// Client-safe types & theme presets (no database imports here).

export type SiteInfo = {
  name: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  regions: string;
};

export type NavLink = { label: string; href: string };

export type FooterColumn = { title: string; links: NavLink[] };

export type VehicleDoc = {
  name: string;
  seats: string;
  oneWayRate: number;
  roundRate: number;
  nonAcOneWayRate: number;
  nonAcRoundRate: number;
  bataOneWay: number;
  bataRound: number;
  image: string;
  tag?: string;
};

export type AcMode = "AC" | "Non-AC";

export type RouteDoc = {
  from: string;
  to: string;
  km: number;
  time: string;
  fare: number;
};

export type NavbarColors = {
  text: string;
  hover: string;
  active: string;
};

export type ThemeSettings = {
  preset: string;
  defaultMode: "dark" | "light";
  navbarLight: NavbarColors;
  navbarDark: NavbarColors;
};

export type SectionHeading = {
  kicker: string;
  title: string;
  subtitle?: string;
};

export type HeroContent = {
  headline: string;
  description: string;
  perks: string[];
  heroImage: string;
  heroImageFit?: "screen" | "content";
};

export type StatItem = { value: number; suffix: string; label: string; decimals?: number };
export type StepItem = { title: string; desc: string };
export type ReviewItem = { name: string; trip: string; text: string };
export type FaqItem = { q: string; a: string };
export type CtaContent = { title: string; subtitle: string };

export type ServiceCityItem = { name: string; desc: string };
export type TravelTermsColumn = { title: string; items: string[] };

export type ServiceItem = {
  title: string;
  desc: string;
  icon: string; // lucide icon name
};

export type GalleryItem = {
  image: string;
  caption: string;
};

export type OfferPopup = {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string; // "whatsapp" | "call" | custom url
  dismissLabel: string;
};

export type TourPackage = {
  title: string;
  image: string;
  duration: string;
  price: string;        // AC price (or single price when includesCar=false)
  nonAcPrice: string;   // Non-AC price (used only when includesCar=true)
  includesCar: boolean; // false = no vehicle in package, hide AC/Non-AC toggle
  description: string;
  highlights: string[];
  inclusions: string[];
};

export type SiteData = {
  site: SiteInfo;
  navLinks: NavLink[];
  footerColumns: FooterColumn[];
  footerBottom: string;
  hero: HeroContent;
  stats: StatItem[];
  cities: string[];
  tariffHead: SectionHeading;
  vehicles: VehicleDoc[];
  routesHead: SectionHeading;
  routes: RouteDoc[];
  how: SectionHeading & { steps: StepItem[] };
  why: SectionHeading & { features: StepItem[] };
  reviews: SectionHeading & { items: ReviewItem[] };
  faq: SectionHeading & { items: FaqItem[] };
  cta: CtaContent;
  theme: ThemeSettings;
  cityServiceHead: SectionHeading;
  featuredCities: ServiceCityItem[];
  allCities: string[];
  trustBadges: string[];
  infoStrip: string[];
  importantInfo: {
    general: TravelTermsColumn;
    oneWay: TravelTermsColumn;
    roundTrip: TravelTermsColumn;
  };
  services: SectionHeading & { items: ServiceItem[] };
  gallery: SectionHeading & { items: GalleryItem[] };
  offer: OfferPopup;
  tours: SectionHeading & { items: TourPackage[] };
  customThemes: ThemePreset[];
};

export type ThemePreset = {
  label: string;
  colors: { 300: string; 400: string; 500: string; 600: string; 700: string };
};

export const THEME_PRESETS: Record<string, ThemePreset> = {
  amber: { label: "Taxi Amber", colors: { 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309" } },
  orange: { label: "Sunset Orange", colors: { 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c" } },
  red: { label: "Racing Red", colors: { 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c" } },
  rose: { label: "Rose Pink", colors: { 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c" } },
  emerald: { label: "Emerald Green", colors: { 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857" } },
  teal: { label: "Ocean Teal", colors: { 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e" } },
  sky: { label: "Sky Blue", colors: { 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1" } },
  blue: { label: "Royal Blue", colors: { 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8" } },
  violet: { label: "Violet", colors: { 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9" } },
};
