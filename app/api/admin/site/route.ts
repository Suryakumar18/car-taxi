import { isAdminRequest } from "@/lib/auth";
import { getSiteData, saveSiteData, DEFAULT_DATA, type SiteData } from "@/lib/site-data";

export async function GET() {
  if (!(await isAdminRequest())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getSiteData();
  return Response.json(data);
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Partial<SiteData> | null;
  if (!body?.site?.name) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data: SiteData = {
    site: { ...DEFAULT_DATA.site, ...body.site },
    navLinks: Array.isArray(body.navLinks) && body.navLinks.length ? body.navLinks : DEFAULT_DATA.navLinks,
    footerColumns: Array.isArray(body.footerColumns) ? body.footerColumns : DEFAULT_DATA.footerColumns,
    footerBottom: body.footerBottom ?? DEFAULT_DATA.footerBottom,
    hero: { ...DEFAULT_DATA.hero, ...body.hero },
    stats: Array.isArray(body.stats) && body.stats.length ? body.stats : DEFAULT_DATA.stats,
    cities: Array.isArray(body.cities) ? body.cities.map(String).filter(Boolean) : DEFAULT_DATA.cities,
    tariffHead: { ...DEFAULT_DATA.tariffHead, ...body.tariffHead },
    vehicles: Array.isArray(body.vehicles) ? body.vehicles : DEFAULT_DATA.vehicles,
    routesHead: { ...DEFAULT_DATA.routesHead, ...body.routesHead },
    routes: Array.isArray(body.routes) ? body.routes : DEFAULT_DATA.routes,
    how: { ...DEFAULT_DATA.how, ...body.how },
    why: { ...DEFAULT_DATA.why, ...body.why },
    reviews: { ...DEFAULT_DATA.reviews, ...body.reviews },
    faq: { ...DEFAULT_DATA.faq, ...body.faq },
    cta: { ...DEFAULT_DATA.cta, ...body.cta },
    theme: {
      ...DEFAULT_DATA.theme, ...body.theme,
      navbarLight: { ...DEFAULT_DATA.theme.navbarLight, ...body.theme?.navbarLight },
      navbarDark: { ...DEFAULT_DATA.theme.navbarDark, ...body.theme?.navbarDark },
    },
    cityServiceHead: { ...DEFAULT_DATA.cityServiceHead, ...body.cityServiceHead },
    featuredCities: Array.isArray(body.featuredCities) && body.featuredCities.length ? body.featuredCities : DEFAULT_DATA.featuredCities,
    allCities: Array.isArray(body.allCities) ? body.allCities.map(String).filter(Boolean) : DEFAULT_DATA.allCities,
    trustBadges: Array.isArray(body.trustBadges) ? body.trustBadges.map(String).filter(Boolean) : DEFAULT_DATA.trustBadges,
    infoStrip: Array.isArray(body.infoStrip) ? body.infoStrip.map(String).filter(Boolean) : DEFAULT_DATA.infoStrip,
    importantInfo: {
      general: { ...DEFAULT_DATA.importantInfo.general, ...body.importantInfo?.general },
      oneWay: { ...DEFAULT_DATA.importantInfo.oneWay, ...body.importantInfo?.oneWay },
      roundTrip: { ...DEFAULT_DATA.importantInfo.roundTrip, ...body.importantInfo?.roundTrip },
    },
    services: { ...DEFAULT_DATA.services, ...body.services },
    gallery: { ...DEFAULT_DATA.gallery, ...body.gallery, items: body.gallery?.items ?? DEFAULT_DATA.gallery.items },
    offer: { ...DEFAULT_DATA.offer, ...body.offer },
    tours: { ...DEFAULT_DATA.tours, ...body.tours, items: body.tours?.items ?? DEFAULT_DATA.tours.items },
    customThemes: Array.isArray(body.customThemes) ? body.customThemes : DEFAULT_DATA.customThemes,
  };

  // numeric coercion + cleanup
  data.site.whatsappNumber = String(data.site.whatsappNumber).replace(/\D/g, "");
  data.vehicles = data.vehicles.filter((v) => v.name).map((v) => ({
    name: String(v.name), seats: String(v.seats || ""),
    oneWayRate: Number(v.oneWayRate) || 0, roundRate: Number(v.roundRate) || 0,
    nonAcOneWayRate: Number(v.nonAcOneWayRate) || Number(v.oneWayRate) || 0,
    nonAcRoundRate: Number(v.nonAcRoundRate) || Number(v.roundRate) || 0,
    bataOneWay: Number(v.bataOneWay) || 0, bataRound: Number(v.bataRound) || 0,
    image: String(v.image || ""), ...(v.tag ? { tag: String(v.tag) } : {}),
  }));
  data.routes = data.routes.filter((r) => r.from && r.to).map((r) => ({
    from: String(r.from), to: String(r.to), km: Number(r.km) || 0, time: String(r.time || ""), fare: Number(r.fare) || 0,
  }));
  data.stats = data.stats.map((s) => ({
    value: Number(s.value) || 0, suffix: String(s.suffix || ""), label: String(s.label || ""),
    ...(s.decimals ? { decimals: Number(s.decimals) } : {}),
  }));
  data.featuredCities = data.featuredCities.filter((c) => c.name).map((c) => ({ name: String(c.name), desc: String(c.desc || "") }));
  data.importantInfo.general.items = data.importantInfo.general.items.map(String).filter(Boolean);
  data.importantInfo.oneWay.items = data.importantInfo.oneWay.items.map(String).filter(Boolean);
  data.importantInfo.roundTrip.items = data.importantInfo.roundTrip.items.map(String).filter(Boolean);
  data.navLinks = data.navLinks.filter((l) => l.label).map((l) => ({ label: String(l.label), href: String(l.href || "#") }));
  data.services.items = (data.services.items || []).filter((s) => s.title).map((s) => ({
    title: String(s.title), desc: String(s.desc || ""), icon: String(s.icon || "Car"),
  }));
  data.gallery.items = (data.gallery.items || []).filter((g) => g.image).map((g) => ({
    image: String(g.image), caption: String(g.caption || ""),
  }));
  data.tours.items = (data.tours.items || []).filter((t) => t.title).map((t) => ({
    title: String(t.title), image: String(t.image || ""), duration: String(t.duration || ""),
    price: String(t.price || ""),
    nonAcPrice: String(t.nonAcPrice || t.price || ""),
    includesCar: t.includesCar !== false,
    description: String(t.description || ""),
    highlights: Array.isArray(t.highlights) ? t.highlights.map(String).filter(Boolean) : [],
    inclusions: Array.isArray(t.inclusions) ? t.inclusions.map(String).filter(Boolean) : [],
  }));
  data.customThemes = (data.customThemes || []).filter((t) => t.label).map((t) => ({
    label: String(t.label), colors: {
      300: String(t.colors?.[300] || "#fcd34d"), 400: String(t.colors?.[400] || "#fbbf24"),
      500: String(t.colors?.[500] || "#f59e0b"), 600: String(t.colors?.[600] || "#d97706"),
      700: String(t.colors?.[700] || "#b45309"),
    },
  }));

  try {
    await saveSiteData(data);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("saveSiteData failed:", e);
    return Response.json({ error: "Could not save — database unreachable" }, { status: 500 });
  }
}
