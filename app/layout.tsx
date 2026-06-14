import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSiteData, THEME_PRESETS } from "@/lib/site-data";
import { SiteProvider } from "@/components/SiteProvider";

export const dynamic = "force-dynamic";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

// Guard against env var set to literal string "undefined" or missing protocol
const _rawUrl = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_URL =
  _rawUrl && _rawUrl !== "undefined" && _rawUrl.startsWith("http")
    ? _rawUrl
    : "https://droptaxi.live";

export async function generateMetadata(): Promise<Metadata> {
  const { site, hero } = await getSiteData();
  const ogImage = hero?.heroImage || `${SITE_URL}/og-default.jpg`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.name} — One Way Taxi Tamil Nadu, Karnataka & Kerala | ₹14/km`,
      template: `%s | ${site.name}`,
    },
    description: `Book one way drop taxi across Tamil Nadu, Karnataka & Kerala. Fixed fare from ₹14/km — no return charge, no hidden fees. Serving 80+ cities: Chennai, Bangalore, Coimbatore, Madurai, Kochi, Mysore, Salem, Trichy, Ooty & more. 24/7 WhatsApp booking. Call ${site.phone}.`,
    keywords: [
      // High-intent local searches
      "taxi near me", "one way taxi near me", "drop taxi near me", "cab near me",
      "outstation taxi near me", "taxi service near me", "cab service near me",

      // Core service keywords
      "one way taxi", "drop taxi", "outstation taxi", "outstation cab",
      "one way drop taxi", "round trip taxi", "airport taxi", "airport cab service",
      "intercity taxi", "inter state taxi",

      // ── TAMIL NADU ─────────────────────────────────────────────
      // State level
      "taxi Tamil Nadu", "one way taxi Tamil Nadu", "drop taxi Tamil Nadu",
      "outstation taxi Tamil Nadu", "cab service Tamil Nadu", "taxi service Tamil Nadu",
      "outstation cab Tamil Nadu", "Tamil Nadu cab booking", "best taxi Tamil Nadu",

      // Chennai (highest search volume city)
      "Chennai one way taxi", "Chennai drop taxi", "Chennai outstation cab",
      "Chennai to Madurai taxi", "Chennai to Coimbatore taxi", "Chennai to Bangalore taxi",
      "Chennai to Salem taxi", "Chennai to Trichy taxi", "Chennai to Ooty taxi",
      "Chennai to Tirupati taxi", "Chennai to Pondicherry taxi", "Chennai to Vellore taxi",
      "Chennai to Kochi taxi", "Chennai to Mysore taxi", "Chennai to Thanjavur taxi",
      "Chennai to Rameswaram taxi", "Chennai to Kanyakumari taxi", "Chennai to Kumbakonam taxi",
      "Chennai to Tirunelveli taxi", "Chennai to Dindigul taxi", "Chennai airport taxi",

      // Coimbatore
      "Coimbatore one way taxi", "Coimbatore drop taxi", "Coimbatore outstation cab",
      "Coimbatore to Bangalore taxi", "Coimbatore to Ooty taxi", "Coimbatore to Kochi taxi",
      "Coimbatore to Mysore taxi", "Coimbatore to Palakkad taxi", "Coimbatore to Munnar taxi",
      "Coimbatore to Salem taxi", "Coimbatore to Madurai taxi", "Coimbatore to Chennai taxi",
      "Coimbatore airport taxi",

      // Madurai
      "Madurai one way taxi", "Madurai drop taxi", "Madurai to Rameswaram taxi",
      "Madurai to Kodaikanal taxi", "Madurai to Kanyakumari taxi", "Madurai to Chennai taxi",
      "Madurai to Bangalore taxi", "Madurai to Coimbatore taxi", "Madurai to Tirunelveli taxi",

      // Salem & surroundings
      "Salem one way taxi", "Salem to Bangalore taxi", "Salem to Chennai taxi",
      "Salem to Coimbatore taxi", "Salem to Ooty taxi", "Salem to Trichy taxi",
      "Hosur one way taxi", "Hosur to Bangalore taxi", "Krishnagiri taxi",

      // Trichy & Thanjavur belt
      "Trichy one way taxi", "Trichy to Chennai taxi", "Trichy to Bangalore taxi",
      "Trichy to Madurai taxi", "Thanjavur taxi service", "Kumbakonam taxi",
      "Chidambaram taxi", "Nagapattinam taxi",

      // Southern TN
      "Tirunelveli one way taxi", "Tirunelveli to Chennai taxi", "Tirunelveli to Bangalore taxi",
      "Nagercoil taxi", "Kanyakumari taxi service", "Thoothukudi taxi", "Tuticorin taxi",

      // Hill stations & pilgrim towns (TN)
      "Ooty taxi service", "Kodaikanal taxi service", "Yercaud taxi",
      "Rameswaram taxi service", "Velankanni taxi", "Kutralam taxi",
      "Tiruvannamalai taxi", "Kanchipuram taxi", "Vellore taxi",
      "Erode taxi", "Tiruppur taxi", "Dindigul taxi",

      // Pondicherry
      "Pondicherry taxi service", "Puducherry one way taxi",
      "Pondicherry to Chennai taxi", "Pondicherry to Bangalore taxi",

      // ── KARNATAKA ──────────────────────────────────────────────
      // State level
      "taxi Karnataka", "one way taxi Karnataka", "drop taxi Karnataka",
      "outstation taxi Karnataka", "cab service Karnataka", "taxi service Karnataka",

      // Bangalore (Bengaluru) — highest volume
      "Bangalore one way taxi", "Bangalore drop taxi", "Bangalore outstation cab",
      "Bengaluru taxi", "Bangalore taxi service",
      "Bangalore to Chennai taxi", "Bangalore to Coimbatore taxi", "Bangalore to Mysore taxi",
      "Bangalore to Ooty taxi", "Bangalore to Salem taxi", "Bangalore to Madurai taxi",
      "Bangalore to Trichy taxi", "Bangalore to Tirupati taxi", "Bangalore to Mangalore taxi",
      "Bangalore to Coorg taxi", "Bangalore to Chikmagalur taxi", "Bangalore to Hampi taxi",
      "Bangalore to Kochi taxi", "Bangalore to Wayanad taxi", "Bangalore to Hassan taxi",
      "Bangalore to Tumkur taxi", "Bangalore airport taxi", "Bengaluru airport cab",

      // Mysore
      "Mysore one way taxi", "Mysore taxi service", "Mysore to Bangalore taxi",
      "Mysore to Ooty taxi", "Mysore to Coorg taxi", "Mysore to Wayanad taxi",
      "Mysore to Madurai taxi", "Mysore to Kochi taxi", "Mysore to Hassan taxi",

      // Other Karnataka cities
      "Mangalore taxi service", "Mangalore to Bangalore taxi", "Mangalore to Goa taxi",
      "Coorg taxi service", "Madikeri taxi", "Coorg to Bangalore taxi", "Coorg to Mysore taxi",
      "Chikmagalur taxi service", "Chikmagalur to Bangalore taxi",
      "Hassan taxi", "Hassan to Mysore taxi", "Hampi taxi", "Hampi to Bangalore taxi",
      "Hubli taxi", "Tumkur taxi",

      // ── KERALA ─────────────────────────────────────────────────
      // State level
      "taxi Kerala", "one way taxi Kerala", "drop taxi Kerala",
      "outstation taxi Kerala", "cab service Kerala", "taxi service Kerala",

      // Kochi (Cochin)
      "Kochi one way taxi", "Kochi taxi service", "Cochin taxi",
      "Kochi to Munnar taxi", "Kochi to Alleppey taxi", "Kochi to Coimbatore taxi",
      "Kochi to Thrissur taxi", "Kochi to Bangalore taxi", "Kochi to Chennai taxi",
      "Kochi to Trivandrum taxi", "Kochi to Palakkad taxi", "Kochi to Wayanad taxi",
      "Kochi airport taxi",

      // Trivandrum
      "Trivandrum one way taxi", "Thiruvananthapuram taxi",
      "Trivandrum to Kanyakumari taxi", "Trivandrum to Nagercoil taxi",
      "Trivandrum to Madurai taxi", "Trivandrum to Kochi taxi",
      "Trivandrum airport taxi",

      // Other Kerala cities & destinations
      "Munnar taxi service", "Munnar to Kochi taxi", "Munnar to Coimbatore taxi",
      "Alleppey taxi", "Alappuzha taxi", "Alleppey to Kochi taxi",
      "Wayanad taxi service", "Wayanad to Mysore taxi", "Wayanad to Kozhikode taxi",
      "Kozhikode taxi", "Calicut one way taxi", "Kozhikode to Mysore taxi",
      "Thrissur taxi", "Palakkad taxi", "Palakkad to Coimbatore taxi",
      "Kottayam taxi", "Guruvayur taxi", "Kannur taxi", "Varkala taxi",

      // ── SERVICE FEATURES ───────────────────────────────────────
      "fixed fare taxi", "no hidden charges taxi", "no return charge taxi",
      "24/7 taxi service", "WhatsApp taxi booking", "instant cab booking",
      "online cab booking South India", "affordable taxi South India",
      "cheap outstation taxi", "best taxi service South India",
      "transparent fare taxi", "pay after trip taxi",

      // Trip types
      "hill station taxi South India", "temple tour taxi South India",
      "pilgrimage taxi service", "corporate taxi service", "outstation cab booking",
      "airport transfer South India", "South India taxi service",
      site.name,
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: SITE_URL,
      siteName: site.name,
      title: `${site.name} — One Way Taxi Tamil Nadu, Karnataka & Kerala`,
      description: `Fixed fare one way taxi across Tamil Nadu, Karnataka & Kerala. ₹14/km, no return charge. 80+ cities including Chennai, Bangalore, Coimbatore, Kochi, Mysore, Madurai. Book via WhatsApp 24/7.`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${site.name} — One Way Taxi Tamil Nadu, Karnataka & Kerala` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — One Way Taxi Tamil Nadu, Karnataka & Kerala`,
      description: `Fixed fare taxi across Tamil Nadu, Karnataka & Kerala. ₹14/km, no hidden charges. 80+ cities. Book via WhatsApp 24/7.`,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: { canonical: SITE_URL },
    other: {
      "geo.region": "IN-TN",
      "geo.placename": "Tamil Nadu, Karnataka & Kerala, India",
      "ICBM": "11.1271, 78.6569",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getSiteData();
  const preset = THEME_PRESETS[data.theme.preset] ?? THEME_PRESETS.amber;
  const c = preset.colors;
  const defaultDark = data.theme.defaultMode !== "light";
  const nbL = data.theme.navbarLight;
  const nbD = data.theme.navbarDark;

  const { site, hero, faq } = data;

  let ldJson = "{}";
  try {
    ldJson = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["LocalBusiness", "TaxiService"],
          "@id": `${SITE_URL}/#business`,
          name: site?.name || "Taxi Service",
          description: "One way drop taxi service across Tamil Nadu, Kerala and Karnataka. Fixed fare from ₹14/km, no return charge, 24/7 booking.",
          telephone: site?.phone,
          email: site?.email,
          url: SITE_URL,
          priceRange: "₹14–₹26/km",
          currenciesAccepted: "INR",
          paymentAccepted: "Cash, UPI",
          openingHours: "Mo-Su 00:00-24:00",
          image: hero?.heroImage || `${SITE_URL}/og-default.jpg`,
          areaServed: [
            { "@type": "State", name: "Tamil Nadu" },
            { "@type": "State", name: "Kerala" },
            { "@type": "State", name: "Karnataka" },
            { "@type": "AdministrativeArea", name: "Pondicherry" },
          ],
          address: { "@type": "PostalAddress", addressRegion: "Tamil Nadu", addressCountry: "IN" },
          serviceType: ["One Way Taxi", "Round Trip Taxi", "Airport Transfer", "Outstation Cab", "Hill Station Tour"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Taxi Services",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "One Way Drop Taxi" }, description: "Fixed fare one way drop taxi from ₹14/km. No return charge." },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Round Trip Taxi" }, description: "Round trip taxi from ₹13/km with per-day driver bata." },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Airport Transfer" }, description: "Airport pickup and drop with flight tracking." },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Outstation Cab" }, description: "Long distance outstation cab across South India." },
            ],
          },
          sameAs: site?.whatsappNumber ? [`https://wa.me/${site.whatsappNumber}`] : [],
        },
        {
          "@type": "FAQPage",
          mainEntity: (faq?.items || []).map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
      ],
    });
  } catch {
    // JSON-LD build failed — skip structured data, don't crash the page
  }

  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${sora.variable} h-full antialiased`}
      style={
        {
          "--brand-300": c[300],
          "--brand-400": c[400],
          "--brand-500": c[500],
          "--brand-600": c[600],
          "--brand-700": c[700],
          "--nav-text-light": nbL.text,
          "--nav-hover-light": nbL.hover,
          "--nav-active-light": nbL.active,
          "--nav-text-dark": nbD.text,
          "--nav-hover-dark": nbD.hover,
          "--nav-active-dark": nbD.active,
        } as React.CSSProperties
      }
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col">
        {ldJson !== "{}" && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson }} />
        )}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':${defaultDark};document.documentElement.classList.toggle('dark',d)}catch(e){document.documentElement.classList.toggle('dark',${defaultDark})}})();`,
          }}
        />
        <SiteProvider data={data}>{children}</SiteProvider>
      </body>
    </html>
  );
}
