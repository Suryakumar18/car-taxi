import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ToursPage from "@/components/ToursPage";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteData();
  return {
    title: `Tour Packages — ${site.name}`,
    description: `Explore our curated travel packages with fixed pricing and comfortable rides. ${site.name} — reliable taxi service across ${site.regions}.`,
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
