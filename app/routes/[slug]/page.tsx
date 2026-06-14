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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://droptaxi.live";
  const minRate = Math.min(...data.vehicles.map((v) => v.oneWayRate));
  const maxRate = Math.max(...data.vehicles.map((v) => v.oneWayRate));
  const pageUrl = `${siteUrl}/routes/${slug}`;
  const title = `${route.from} to ${route.to} Taxi | ₹${minRate}/km Fixed Fare | One Way Drop`;
  const desc = `Book ${route.from} to ${route.to} one way drop taxi. Fixed fare ₹${minRate}–₹${maxRate}/km, no return charge, no hidden costs. ${route.km} km journey (~${route.time}). Call or WhatsApp ${data.site.phone} — 24/7 booking.`;
  return {
    title,
    description: desc,
    keywords: [
      `${route.from} to ${route.to} taxi`,
      `${route.from} to ${route.to} cab`,
      `${route.from} to ${route.to} one way taxi`,
      `${route.from} to ${route.to} drop taxi`,
      `${route.from} to ${route.to} taxi fare`,
      `${route.from} ${route.to} outstation cab`,
      `${route.from} one way taxi`,
      `${route.to} one way taxi`,
      "one way drop taxi Tamil Nadu",
      "fixed fare taxi",
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description: desc,
      url: pageUrl,
      images: [{ url: data.hero.heroImage || `${siteUrl}/og-default.jpg`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: desc },
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
