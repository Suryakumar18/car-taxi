import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import GalleryPage from "@/components/GalleryPage";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteData();
  return {
    title: `Gallery — ${site.name}`,
    description: `Browse photos of our fleet, trips, and happy customers. ${site.name} — reliable taxi service across ${site.regions}.`,
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
