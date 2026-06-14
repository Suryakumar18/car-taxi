import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import RouteDetailClient from "@/components/RouteDetailClient";

export const dynamic = "force-dynamic";

function routeSlug(from: string, to: string) {
  return `${from}-to-${to}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSiteData();
  const route = data.routes.find((r) => routeSlug(r.from, r.to) === slug);
  if (!route) return {};
  const minRate = Math.min(...data.vehicles.map((v) => v.oneWayRate));
  return {
    title: `${route.from} to ${route.to} One Way Taxi | ₹${minRate}/km | ${data.site.name}`,
    description: `Book ${route.from} to ${route.to} one way drop taxi at ₹${minRate}/km. Fixed fare, no return charges. ${route.km} km, ${route.time} journey. Call or WhatsApp ${data.site.phone} for instant booking.`,
  };
}

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getSiteData();
  const route = data.routes.find((r) => routeSlug(r.from, r.to) === slug);
  if (!route) notFound();

  return (
    <main>
      <Navbar />
      <RouteDetailClient slug={slug} />
      <Footer />
      <FloatingButtons />
    </main>
  );
}
