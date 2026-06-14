import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ToursPage from "@/components/ToursPage";

export async function generateMetadata(): Promise<Metadata> {
  const { site, hero } = await getSiteData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://droptaxi.live";
  const ogImage = hero.heroImage || `${siteUrl}/og-default.jpg`;
  return {
    title: `Tour Packages — Hill Station & Temple Tours Tamil Nadu`,
    description: `Book curated tour packages from Tamil Nadu — Ooty, Kodaikanal, Munnar, Rameswaram, Kanyakumari & more. Fixed price, AC vehicles, 24/7 support. ${site.name} — your trusted outstation taxi for Tamil Nadu tours.`,
    keywords: [
      "tour packages Tamil Nadu", "Ooty tour package", "Kodaikanal tour package",
      "Munnar tour package", "Rameswaram tour", "Kanyakumari tour", "hill station tour",
      "temple tour Tamil Nadu", "pilgrimage tour Tamil Nadu", "outstation tour Tamil Nadu",
      "taxi tour packages", "cab tour Tamil Nadu", "weekend tour Tamil Nadu",
    ],
    alternates: { canonical: `${siteUrl}/tours` },
    openGraph: {
      title: `Tour Packages — ${site.name}`,
      description: `Ooty, Kodaikanal, Munnar, Rameswaram & more. Fixed fare, AC cabs, 24/7 booking.`,
      url: `${siteUrl}/tours`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
  };
}

export default function Tours() {
  return (
    <main>
      <Navbar />
      <ToursPage />
      <Footer />
      <FloatingButtons />
    </main>
  );
}
