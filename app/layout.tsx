import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
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

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteData();
  return {
    title: `${site.name} — One Way Drop Taxi | Fixed Fare | 24/7 Booking`,
    description: `Book one way & round trip outstation cabs across ${site.regions}. Fixed fares, no hidden charges, clean cars & verified drivers. Book instantly on WhatsApp or call ${site.phone}.`,
    keywords: [
      "drop taxi",
      "one way taxi",
      "outstation cab",
      "chennai drop taxi",
      "coimbatore drop taxi",
      "round trip taxi",
      "tamil nadu taxi",
    ],
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':${defaultDark};document.documentElement.classList.toggle('dark',d)}catch(e){document.documentElement.classList.toggle('dark',${defaultDark})}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteProvider data={data}>{children}</SiteProvider>
      </body>
    </html>
  );
}
