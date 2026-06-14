import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import Navbar from "@/components/Navbar";
import NavTicker from "@/components/NavTicker";
import Hero from "@/components/Hero";
import CityMarquee from "@/components/CityMarquee";
import Stats from "@/components/Stats";
import OneWayDestinations from "@/components/OneWayDestinations";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import WhyUs from "@/components/WhyUs";
import TrustBadges from "@/components/TrustBadges";
import CityServices from "@/components/CityServices";
import InfoStrip from "@/components/InfoStrip";
import ImportantInfo from "@/components/ImportantInfo";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import OfferPopup from "@/components/OfferPopup";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://droptaxi.live";

export async function generateMetadata(): Promise<Metadata> {
  const { site, hero } = await getSiteData();
  const ogImage = hero.heroImage || `${SITE_URL}/og-default.jpg`;
  return {
    title: `${site.name} — One Way Taxi Tamil Nadu | ₹14/km Fixed Fare | 24/7 Booking`,
    description: `Book one way drop taxi Tamil Nadu at just ₹14/km. No return charge, no hidden fees. Serving 55+ cities — Chennai, Coimbatore, Madurai, Salem, Trichy, Bangalore, Ooty & more. WhatsApp booking, pay after trip. Call ${site.phone}.`,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: `${site.name} — One Way Taxi Tamil Nadu | ₹14/km`,
      description: `One way drop taxi from ₹14/km across Tamil Nadu, Kerala & Karnataka. No return charge. Book instantly via WhatsApp — 24/7 service.`,
      url: SITE_URL,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${site.name} — One Way Taxi Tamil Nadu` }],
    },
  };
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <NavTicker />
      <Hero />
      <CityMarquee />
      <InfoStrip />
      <ImportantInfo />
      <Stats />
      <OneWayDestinations />
      <Services />
      <HowItWorks />
      <WhyUs />
      <TrustBadges />
      <CityServices />
      <Testimonials />
      <Faq />
      <CtaBanner />
      <Footer />
      <FloatingButtons />
      <OfferPopup />
    </main>
  );
}
