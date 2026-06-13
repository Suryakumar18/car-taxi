import { getDb } from "./db";
import type { SiteData } from "./site-types";

export * from "./site-types";

const CLD = "https://res.cloudinary.com/dgzvoqywg/image/upload/v1781266316/taxi-website/cars";

export const DEFAULT_DATA: SiteData = {
  site: {
    name: "Nagma Tours&Travels",
    tagline: "One Way Drop Taxi • Fixed Fare • 24/7",
    phone: "+91 98809 82741",
    whatsappNumber: "919880982741",
    email: "nonstopdroptaxi2026@gmail.com",
    regions: "Tamil Nadu • Kerala • Karnataka • Pondicherry",
  },
  navLinks: [
    { label: "Book Now", href: "#book" },
    { label: "Tariff", href: "#tariff" },
    { label: "Routes", href: "#routes" },
    { label: "Services", href: "#services" },
    { label: "Tours", href: "/tours" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "#contact" },
  ],
  footerColumns: [
    {
      title: "Quick Links",
      links: [
        { label: "Book a Cab", href: "#book" },
        { label: "Tariff Plans", href: "#tariff" },
        { label: "Popular Routes", href: "#routes" },
        { label: "Why Choose Us", href: "#why-us" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    {
      title: "Our Services",
      links: [
        { label: "One Way Taxi", href: "#services" },
        { label: "Round Trip", href: "#services" },
        { label: "Airport Transfer", href: "#services" },
        { label: "Outstation Cab", href: "#services" },
        { label: "Corporate Travel", href: "#services" },
      ],
    },
  ],
  footerBottom: "Fixed Fare • No Hidden Charges • 24/7",
  hero: {
    headline: "Ride *Anywhere.* Pay for One Way *Only.*",
    description:
      "Outstation drop taxis across Tamil Nadu, Kerala, Karnataka & Pondicherry. Transparent per-km pricing, clean cars and friendly drivers — book in 30 seconds on WhatsApp, we call you back to confirm. Pay the driver directly.",
    perks: ["Fixed Fare", "Verified Drivers", "24/7 Service", "4.8★ Rated"],
    heroImage: "https://images.unsplash.com/photo-1495430288918-03be19c7c485?w=1920&q=80",
  },
  stats: [
    { value: 10000, suffix: "+", label: "Happy Trips" },
    { value: 55, suffix: "+", label: "Cities Covered" },
    { value: 4.8, suffix: "★", label: "Average Rating", decimals: 1 },
    { value: 24, suffix: "/7", label: "Booking Support" },
  ],
  cities: [
    "Chennai", "Coimbatore", "Madurai", "Salem", "Trichy", "Tirunelveli",
    "Bangalore", "Pondicherry", "Ooty", "Kodaikanal", "Erode", "Vellore",
    "Thanjavur", "Dindigul", "Karur", "Tiruppur", "Nagercoil", "Kochi",
  ],
  tariffHead: {
    kicker: "Tariff Plans",
    title: "Simple, *Fixed* Pricing",
    subtitle: "No hidden charges. Toll, parking & permit as per actuals.",
  },
  routesHead: {
    kicker: "Popular Routes",
    title: "Where Do You Want To *Go?*",
    subtitle: "Pick a vehicle and AC/Non-AC — fares update live. Tap any route to book on WhatsApp.",
  },
  how: {
    kicker: "How It Works",
    title: "Booked In *4 Easy Steps*",
    steps: [
      { title: "Send Booking", desc: "Fill the form or tap WhatsApp — your trip details reach us instantly." },
      { title: "We Call You", desc: "Our team calls back within minutes to confirm fare, time & vehicle." },
      { title: "Driver Arrives", desc: "A clean car with a verified driver reaches your doorstep on time." },
      { title: "Ride & Pay", desc: "Enjoy the trip and pay the driver directly — cash or UPI. No advance." },
    ],
  },
  why: {
    kicker: "Why Choose Us",
    title: "Travel *Worry-Free*",
    features: [
      { title: "Fixed, Transparent Fares", desc: "Per-km pricing told upfront. What we quote is what you pay — no surge, no surprises." },
      { title: "No Advance Payment", desc: "Book free of cost. Pay the driver directly after your trip — cash or UPI, your choice." },
      { title: "Verified Drivers", desc: "Experienced, background-checked drivers who know the highways like home." },
      { title: "Clean, Sanitized Cars", desc: "Well-maintained AC vehicles — from budget Mini to luxury Innova HyCross." },
      { title: "On-Time, Every Time", desc: "Doorstep pickup at your chosen slot — early morning or late night, we show up." },
      { title: "24/7 Human Support", desc: "Real people on call & WhatsApp around the clock. We confirm every booking personally." },
    ],
  },
  reviews: {
    kicker: "Testimonials",
    title: "Riders *Love Us*",
    items: [
      { name: "Ramesh K.", trip: "Chennai → Madurai", text: "Booked on WhatsApp at night, driver was at my door by 5 AM sharp. Clean sedan, fair price, zero haggling. Best drop taxi experience so far." },
      { name: "Priya S.", trip: "Coimbatore → Bangalore", text: "They called within 5 minutes of my WhatsApp message and confirmed everything. Polite driver, smooth ride, and I paid exactly the quoted fare." },
      { name: "Abdul R.", trip: "Chennai → Ooty (Round Trip)", text: "Took the Innova Crysta for a family trip to Ooty. Comfortable, safe driving on the hills, and the per-day bata was clearly explained upfront." },
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Good To *Know*",
    items: [
      { q: "How does the booking work?", a: "Fill the booking form (or tap the WhatsApp button) — your trip details open in WhatsApp and reach us instantly. Our team calls you back to confirm the fare, vehicle and pickup time. No app download, no online payment." },
      { q: "Do I need to pay any advance?", a: "No advance is required for regular bookings. You pay the driver directly after the trip — cash or UPI, whichever you prefer." },
      { q: "What is included in the fare?", a: "The per-km rate plus a fixed driver bata. Toll, parking, inter-state permit and hill station charges are extra and charged as per actual receipts." },
      { q: "What is the minimum billing distance?", a: "One way trips have a minimum billing of 150 km, and round trips 300 km. If your trip is shorter, the minimum applies." },
      { q: "Is one way cheaper than a round trip?", a: "For a single drop, yes — you pay only for the one-way distance with no return fare. For multi-day or multi-stop journeys, a round trip package (₹1/km less, billed both ways, per-day driver bata) usually works out better." },
      { q: "Can I book for early morning or late night?", a: "Yes — we operate 24/7. Book in advance on WhatsApp and the driver will reach your doorstep at your chosen time." },
      { q: "Which areas do you cover?", a: "All over Tamil Nadu, plus Kerala, Karnataka and Pondicherry — including Chennai, Coimbatore, Madurai, Salem, Trichy, Bangalore, Ooty, Kodaikanal and 40+ more cities." },
    ],
  },
  cta: {
    title: "Bags Packed? Let's Hit The Road!",
    subtitle: "Book now on WhatsApp or call us — we're awake 24/7. Fixed fare, doorstep pickup, pay after the trip.",
  },
  vehicles: [
    { name: "Mini", seats: "4 + 1", oneWayRate: 14, roundRate: 13, nonAcOneWayRate: 13, nonAcRoundRate: 12, bataOneWay: 400, bataRound: 400, image: `${CLD.replace(/v\d+/, "v1781266319")}/mini.png`, tag: "Budget" },
    { name: "Sedan", seats: "4 + 1", oneWayRate: 15, roundRate: 14, nonAcOneWayRate: 14, nonAcRoundRate: 13, bataOneWay: 500, bataRound: 500, image: `${CLD.replace(/v\d+/, "v1781266321")}/sedan.png`, tag: "Popular" },
    { name: "SUV", seats: "6 + 1", oneWayRate: 20, roundRate: 19, nonAcOneWayRate: 19, nonAcRoundRate: 18, bataOneWay: 500, bataRound: 500, image: `${CLD.replace(/v\d+/, "v1781266322")}/suv.png` },
    { name: "Innova", seats: "7 + 1", oneWayRate: 22, roundRate: 21, nonAcOneWayRate: 21, nonAcRoundRate: 20, bataOneWay: 500, bataRound: 500, image: `${CLD.replace(/v\d+/, "v1781266318")}/innova.png` },
    { name: "Innova Crysta", seats: "7 + 1", oneWayRate: 24, roundRate: 23, nonAcOneWayRate: 23, nonAcRoundRate: 22, bataOneWay: 500, bataRound: 500, image: `${CLD}/crysta.png`, tag: "Premium" },
    { name: "Innova HyCross", seats: "7 + 1", oneWayRate: 26, roundRate: 25, nonAcOneWayRate: 25, nonAcRoundRate: 24, bataOneWay: 500, bataRound: 500, image: `${CLD.replace(/v\d+/, "v1781266317")}/hycross.png`, tag: "Luxury" },
    { name: "Tempo Traveller", seats: "12 + 1", oneWayRate: 30, roundRate: 29, nonAcOneWayRate: 28, nonAcRoundRate: 27, bataOneWay: 500, bataRound: 800, image: `${CLD.replace(/v\d+/, "v1781266323")}/tempo.png`, tag: "Group" },
  ],
  routes: [
    { from: "Chennai", to: "Madurai", km: 458, time: "7h 30m", fare: 7370 },
    { from: "Chennai", to: "Coimbatore", km: 500, time: "8h 00m", fare: 8000 },
    { from: "Chennai", to: "Salem", km: 340, time: "5h 30m", fare: 5600 },
    { from: "Chennai", to: "Trichy", km: 320, time: "5h 00m", fare: 5300 },
    { from: "Chennai", to: "Bangalore", km: 348, time: "6h 00m", fare: 5720 },
    { from: "Chennai", to: "Pondicherry", km: 150, time: "3h 00m", fare: 2750 },
    { from: "Chennai", to: "Ooty", km: 550, time: "10h 00m", fare: 8750 },
    { from: "Coimbatore", to: "Bangalore", km: 360, time: "6h 00m", fare: 5900 },
    { from: "Coimbatore", to: "Ooty", km: 90, time: "2h 30m", fare: 2750 },
  ],
  theme: {
    preset: "amber",
    defaultMode: "dark",
    navbarLight: { text: "#1e293b", hover: "#d97706", active: "#b45309" },
    navbarDark: { text: "#f1f5f9", hover: "#fbbf24", active: "#fcd34d" },
  },
  cityServiceHead: {
    kicker: "Service Areas",
    title: "Taxi Services Across *Tamil Nadu* & South India",
    subtitle: "Book one way and outstation taxi services in major cities with fixed pricing, professional drivers and 24/7 support.",
  },
  featuredCities: [
    { name: "Chennai", desc: "One way taxi • Outstation • Airport drop" },
    { name: "Coimbatore", desc: "One way taxi • Outstation • Airport drop" },
    { name: "Madurai", desc: "One way taxi • Outstation • Airport drop" },
    { name: "Salem", desc: "One way taxi • Outstation • Airport drop" },
    { name: "Tiruchirappalli", desc: "One way taxi • Outstation • Airport drop" },
    { name: "Tirunelveli", desc: "One way taxi • Outstation • Airport drop" },
  ],
  allCities: [
    "Ariyalur", "Bengaluru", "Chengalpattu", "Cuddalore", "Dharmapuri", "Dindigul",
    "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Kodaikanal", "Krishnagiri",
    "Kumbakonam", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur",
    "Puducherry", "Pudukkottai", "Ramanathapuram", "Rameswaram", "Ranipet", "Sivaganga",
    "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tirupathur", "Tiruppur",
    "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Virudhunagar", "Villupuram",
  ],
  trustBadges: ["Transparent Pricing", "24/7 Booking Support", "Verified Drivers", "Comfortable Travel"],
  infoStrip: ["Toll charges as per actual", "No hidden fees", "Transparent billing"],
  importantInfo: {
    general: {
      title: "Important Information",
      items: [
        "Toll, parking and permit charges are billed as per actual",
        "Driver bata varies by vehicle (see pricing cards)",
        "Route or distance changes may affect final fare",
        "Vehicle provided based on availability and trip type",
        "Night travel and hill station charges may apply if required",
      ],
    },
    oneWay: {
      title: "One Way Travel Terms",
      items: [
        "Minimum 150 KM billing",
        "Driver bata ₹400 (Mini) to ₹500 (Sedan & above)",
        "Toll & parking extra (actual)",
        "No return fare charged",
        "Ideal for city-to-city drop trips",
      ],
    },
    roundTrip: {
      title: "Round Trip Travel Terms",
      items: [
        "Minimum 300 KM billing",
        "Driver bata ₹400–₹500 per day (Tempo Traveller ₹800)",
        "Flexible return schedule",
        "Extra KM charged separately",
        "Best for multi-day trips",
      ],
    },
  },
  services: {
    kicker: "Our Services",
    title: "Complete *Taxi Solutions*",
    subtitle: "From quick city drops to multi-day outstation trips — we cover it all with fixed fares and reliable service.",
    items: [
      { title: "One Way Drop Taxi", desc: "Pay only for one-way distance. No return fare charged. Perfect for intercity drop trips.", icon: "ArrowRight" },
      { title: "Round Trip Taxi", desc: "Multi-day journeys with flexible return. Per-day driver bata and minimum km billing.", icon: "RotateCcw" },
      { title: "Airport Transfer", desc: "Reliable airport pickup and drop with flight tracking. On time, every time.", icon: "Plane" },
      { title: "Outstation Cab", desc: "Long distance travel across Tamil Nadu, Kerala, Karnataka and Pondicherry.", icon: "MapPin" },
      { title: "Corporate Travel", desc: "Regular employee transport and client pickups with dedicated account support.", icon: "Building2" },
      { title: "Hill Station Trips", desc: "Experienced hill road drivers for Ooty, Kodaikanal, Munnar and more.", icon: "Mountain" },
    ],
  },
  gallery: {
    kicker: "Gallery",
    title: "Our *Fleet* & Trips",
    subtitle: "Real photos from our vehicles and happy customers on the road.",
    items: [],
  },
  offer: {
    enabled: false,
    title: "Special Offer!",
    description: "Get 10% off on your first booking. Use code WELCOME10 on WhatsApp.",
    buttonText: "Claim Offer on WhatsApp",
    buttonLink: "whatsapp",
    dismissLabel: "Maybe Later",
  },
  tours: {
    kicker: "Tour Packages",
    title: "Explore *Popular* Destinations",
    subtitle: "Curated travel packages with comfortable rides, fixed pricing, and hassle-free bookings.",
    items: [
      {
        title: "Ooty Hill Station Tour",
        image: "",
        duration: "2 Days / 1 Night",
        price: "₹4,999",
        nonAcPrice: "₹4,499",
        includesCar: true,
        description: "Explore the queen of hill stations — Botanical Garden, Ooty Lake, Doddabetta Peak, and tea plantations.",
        highlights: ["Botanical Garden", "Ooty Lake", "Doddabetta Peak", "Tea Factory Visit"],
        inclusions: ["Sedan", "Driver Bata", "Fuel Charges", "Parking & Tolls"],
      },
      {
        title: "Kodaikanal Getaway",
        image: "",
        duration: "2 Days / 1 Night",
        price: "₹5,499",
        nonAcPrice: "₹4,999",
        includesCar: true,
        description: "The princess of hill stations — Coaker's Walk, Pillar Rocks, Kurinji Andavar Temple, and more.",
        highlights: ["Coaker's Walk", "Pillar Rocks", "Bryant Park", "Silver Cascade Falls"],
        inclusions: ["Sedan", "Driver Bata", "Fuel Charges", "Parking & Tolls"],
      },
      {
        title: "Pondicherry Beach Tour",
        image: "",
        duration: "1 Day",
        price: "₹2,999",
        nonAcPrice: "₹2,599",
        includesCar: true,
        description: "French colony vibes — Promenade Beach, Auroville, Paradise Beach, and local cuisine trail.",
        highlights: ["Promenade Beach", "Auroville", "Paradise Beach", "French Quarter Walk"],
        inclusions: ["Sedan", "Driver Bata", "Fuel Charges", "Parking & Tolls"],
      },
    ],
  },
  customThemes: [],
};

// ─── Read (auto-seeds on first run) ──────────────────────────
export async function getSiteData(): Promise<SiteData> {
  try {
    const db = await getDb();
    const col = db.collection<{ _id: string } & SiteData>("content");
    let doc = await col.findOne({ _id: "main" });
    if (!doc) {
      await col.updateOne({ _id: "main" }, { $setOnInsert: DEFAULT_DATA }, { upsert: true });
      doc = await col.findOne({ _id: "main" });
    }
    if (!doc) return DEFAULT_DATA;
    return {
      site: { ...DEFAULT_DATA.site, ...doc.site },
      navLinks: doc.navLinks?.length ? doc.navLinks : DEFAULT_DATA.navLinks,
      footerColumns: doc.footerColumns?.length ? doc.footerColumns : DEFAULT_DATA.footerColumns,
      footerBottom: doc.footerBottom ?? DEFAULT_DATA.footerBottom,
      hero: { ...DEFAULT_DATA.hero, ...doc.hero, heroImage: doc.hero?.heroImage || DEFAULT_DATA.hero.heroImage },
      stats: doc.stats?.length ? doc.stats : DEFAULT_DATA.stats,
      cities: doc.cities?.length ? doc.cities : DEFAULT_DATA.cities,
      tariffHead: { ...DEFAULT_DATA.tariffHead, ...doc.tariffHead },
      vehicles: doc.vehicles?.length
        ? doc.vehicles.map((v) => ({
            ...v,
            nonAcOneWayRate: v.nonAcOneWayRate ?? Math.max(0, (v.oneWayRate ?? 0) - 1),
            nonAcRoundRate: v.nonAcRoundRate ?? Math.max(0, (v.roundRate ?? 0) - 1),
          }))
        : DEFAULT_DATA.vehicles,
      routesHead: { ...DEFAULT_DATA.routesHead, ...doc.routesHead },
      routes: doc.routes ?? DEFAULT_DATA.routes,
      how: { ...DEFAULT_DATA.how, ...doc.how },
      why: { ...DEFAULT_DATA.why, ...doc.why },
      reviews: { ...DEFAULT_DATA.reviews, ...doc.reviews },
      faq: { ...DEFAULT_DATA.faq, ...doc.faq },
      cta: { ...DEFAULT_DATA.cta, ...doc.cta },
      theme: {
        ...DEFAULT_DATA.theme, ...doc.theme,
        navbarLight: { ...DEFAULT_DATA.theme.navbarLight, ...doc.theme?.navbarLight },
        navbarDark: { ...DEFAULT_DATA.theme.navbarDark, ...doc.theme?.navbarDark },
      },
      cityServiceHead: { ...DEFAULT_DATA.cityServiceHead, ...doc.cityServiceHead },
      featuredCities: doc.featuredCities?.length ? doc.featuredCities : DEFAULT_DATA.featuredCities,
      allCities: doc.allCities?.length ? doc.allCities : DEFAULT_DATA.allCities,
      trustBadges: doc.trustBadges?.length ? doc.trustBadges : DEFAULT_DATA.trustBadges,
      infoStrip: doc.infoStrip?.length ? doc.infoStrip : DEFAULT_DATA.infoStrip,
      importantInfo: {
        general: { ...DEFAULT_DATA.importantInfo.general, ...doc.importantInfo?.general },
        oneWay: { ...DEFAULT_DATA.importantInfo.oneWay, ...doc.importantInfo?.oneWay },
        roundTrip: { ...DEFAULT_DATA.importantInfo.roundTrip, ...doc.importantInfo?.roundTrip },
      },
      services: { ...DEFAULT_DATA.services, ...doc.services },
      gallery: { ...DEFAULT_DATA.gallery, ...doc.gallery, items: doc.gallery?.items?.length ? doc.gallery.items : DEFAULT_DATA.gallery.items },
      offer: { ...DEFAULT_DATA.offer, ...doc.offer },
      tours: {
        ...DEFAULT_DATA.tours, ...doc.tours,
        items: doc.tours?.items?.length
          ? doc.tours.items.map((t) => ({
              ...t,
              nonAcPrice: t.nonAcPrice ?? t.price ?? "",
              includesCar: t.includesCar !== false,
            }))
          : DEFAULT_DATA.tours.items,
      },
      customThemes: Array.isArray(doc.customThemes) ? doc.customThemes : DEFAULT_DATA.customThemes,
    };
  } catch (e) {
    console.error("getSiteData failed, using defaults:", e);
    return DEFAULT_DATA;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  const db = await getDb();
  const {
    site, navLinks, footerColumns, footerBottom, hero, stats, cities,
    tariffHead, vehicles, routesHead, routes, how, why, reviews, faq, cta, theme,
    cityServiceHead, featuredCities, allCities, trustBadges, infoStrip, importantInfo,
    services, gallery, offer, tours, customThemes,
  } = data;
  await db.collection("content").updateOne(
    { _id: "main" } as never,
    { $set: {
      site, navLinks, footerColumns, footerBottom, hero, stats, cities,
      tariffHead, vehicles, routesHead, routes, how, why, reviews, faq, cta, theme,
      cityServiceHead, featuredCities, allCities, trustBadges, infoStrip, importantInfo,
      services, gallery, offer, tours, customThemes,
    } },
    { upsert: true },
  );
}
