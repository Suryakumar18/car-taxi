import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import GalleryPage from "@/components/GalleryPage";

export async function generateMetadata(): Promise<Metadata> {
  const { site, hero } = await getSiteData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://droptaxi.live";
  return {
    title: `Fleet Gallery — Taxi Cars & Trips`,
    description: `See our well-maintained taxi fleet — Sedan, SUV, Innova, Crysta & HyCross. Photos from real trips across Tamil Nadu, Kerala & Karnataka. ${site.name} — clean cars, verified drivers.`,
    keywords: ["taxi fleet photos", "outstation cab gallery", "taxi cars Tamil Nadu", "Innova taxi Tamil Nadu", "SUV taxi Tamil Nadu"],
    alternates: { canonical: `${siteUrl}/gallery` },
    openGraph: {
      title: `Fleet Gallery — ${site.name}`,
      description: `Clean, well-maintained taxis — Sedan, SUV, Innova, Crysta & HyCross for outstation travel across Tamil Nadu.`,
      url: `${siteUrl}/gallery`,
      images: [{ url: hero.heroImage || `${siteUrl}/og-default.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default function Gallery() {
  return (
    <main>
      <Navbar />
      <GalleryPage />
      <Footer />
      <FloatingButtons />
    </main>
  );
}
