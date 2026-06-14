"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Clock3, IndianRupee, Phone, MessageCircle,
  Snowflake, Wind, ChevronDown, Check, MoveRight, Shield, Star, Headphones,
} from "lucide-react";
import { useSite } from "./SiteProvider";
import { estimateFare } from "@/lib/config";

function routeSlug(from: string, to: string) {
  return `${from}-to-${to}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        <span>{q}</span>
        <ChevronDown className={`size-4 shrink-0 text-brand-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="pb-4 text-sm text-slate-600 dark:text-slate-400">{a}</p>
      )}
    </div>
  );
}

export default function RouteDetailClient({ slug }: { slug: string }) {
  const { site, routes, vehicles, phoneHref, wa } = useSite();

  const route = routes.find((r) => routeSlug(r.from, r.to) === slug);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[1]?.name ?? vehicles[0]?.name ?? "");
  const [acMode, setAcMode] = useState<"AC" | "Non-AC">("AC");

  if (!route) return null;

  const vehicle = vehicles.find((v) => v.name === selectedVehicle) ?? vehicles[0];
  const estimate = vehicle ? estimateFare(vehicle, "One Way", route.km, undefined, acMode) : null;
  const minRate = Math.min(...vehicles.map((v) => v.oneWayRate));
  const bataMin = Math.min(...vehicles.map((v) => v.bataOneWay));

  const bookMsg = `Hi ${site.name}! 🚖 I want to book a one way drop taxi\n*${route.from} → ${route.to}*\nVehicle: ${vehicle?.name ?? "vehicle"} (${acMode})\nDistance: ${route.km} km\nEst. Fare: ₹${estimate?.total.toLocaleString("en-IN") ?? route.fare.toLocaleString("en-IN")}\n\nPlease confirm my booking. ✅`;

  const otherRoutes = routes.filter((r) => r.from === route.from && r.to !== route.to).slice(0, 6);

  const faqs = [
    {
      q: `What is the taxi fare from ${route.from} to ${route.to}?`,
      a: `The estimated one way taxi fare from ${route.from} to ${route.to} starts from ₹${estimate?.total.toLocaleString("en-IN") ?? route.fare.toLocaleString("en-IN")} for a ${vehicle?.name ?? "vehicle"} (${acMode}), including driver allowance. Fares vary by vehicle type. Call us for exact pricing.`,
    },
    {
      q: "Is driver allowance included in the fare?",
      a: `Yes, driver allowance (bata) is included in the displayed fare. It starts from ₹${bataMin} for Mini and varies by vehicle type.`,
    },
    {
      q: "Are toll and parking charges included?",
      a: "Toll charges and parking fees are not included and will be charged as per actuals during the trip.",
    },
    {
      q: `Is the ${route.from} to ${route.to} taxi one way or round trip?`,
      a: "This is a one way drop taxi. You only pay for one way travel — no return fare is charged. The driver will return on their own.",
    },
    {
      q: "What is the minimum billable distance?",
      a: "A minimum of 150 km is billed for one way trips. For routes shorter than 150 km, the 150 km minimum applies.",
    },
    {
      q: "How do I book a taxi?",
      a: "You can book instantly by calling or sending a WhatsApp message. We are available 24/7 for bookings and support.",
    },
  ];

  return (
    <>
      {/* ── Page header ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 pb-8 pt-24 text-white sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.12),transparent_60%)]" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/#routes" className="hover:text-white">Routes</Link>
            <span>/</span>
            <span className="text-slate-300">{route.from} → {route.to}</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-300">
            One Way Drop Taxi • Fixed Fare • No Return Charge
          </span>

          <h1 className="font-display mt-3 text-2xl font-extrabold leading-tight sm:text-4xl">
            {route.from} <span className="text-brand-400">→</span> {route.to} Drop Taxi
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
            Looking for {route.from} to {route.to} taxi? Get affordable one way cab from ₹{minRate}/km with fixed fare, no return charges, and experienced drivers. Book now for a smooth {route.km} km journey with 24/7 support.
          </p>

          {/* Stats row */}
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 font-semibold"><MapPin className="size-4 text-brand-400" /> {route.km} km</span>
            <span className="flex items-center gap-1.5 font-semibold"><Clock3 className="size-4 text-brand-400" /> {route.time}</span>
            <span className="flex items-center gap-1.5 font-semibold"><IndianRupee className="size-4 text-brand-400" /> From ₹{minRate} / KM</span>
          </div>

          {/* Notes */}
          <ul className="mt-3 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:gap-4">
            <li>Driver allowance from ₹{bataMin} (Mini; varies by vehicle)</li>
            <li>• Toll &amp; parking extra</li>
            <li>• Minimum 150 KM billing applies</li>
          </ul>
        </div>
      </section>

      {/* ── Main content: sidebar layout ── */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 flex flex-col lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">

        {/* ── Left: SEO content ── */}
        <div className="order-2 lg:order-1">
          {/* Description */}
          <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300">
            <p>
              {route.from} to {route.to} one way taxi is one of the most preferred routes for outstation travel.{" "}
              {site.name} offers affordable drop taxi service with fixed pricing, no hidden charges and professional drivers.
              Our service is ideal for family trips, business travel and airport transfers.
              Book your one way cab now and enjoy a safe, comfortable and hassle-free journey.
            </p>
          </div>

          {/* Why Choose */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-extrabold sm:text-xl">Why Choose {site.name}?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { icon: IndianRupee, title: "One Way Pricing", desc: "Pay only for the distance you travel. No return fare charged." },
                { icon: Shield, title: "Verified Drivers", desc: "Experienced and professional drivers for safe travel." },
                { icon: Headphones, title: "24/7 Booking", desc: "Call or WhatsApp anytime for instant booking and support." },
              ].map((item) => (
                <div key={item.title} className="glass rounded-2xl p-4">
                  <div className="mb-2 grid size-9 place-items-center rounded-xl bg-brand-400/15 text-brand-600 dark:text-brand-400">
                    <item.icon className="size-5" />
                  </div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-extrabold sm:text-xl">{route.from} to {route.to} Taxi FAQs</h2>
            <div className="mt-3">
              {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>

          {/* Popular routes from same origin */}
          {otherRoutes.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-extrabold sm:text-xl">Popular Routes from {route.from}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {otherRoutes.map((r) => (
                  <Link
                    key={r.to}
                    href={`/routes/${routeSlug(r.from, r.to)}`}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                  >
                    {r.from} <MoveRight className="size-3" /> {r.to}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Booking panel (sticky on desktop) ── */}
        <div className="order-1 mb-8 lg:order-2 lg:mb-0">
          <div className="glass sticky top-24 rounded-3xl p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Estimated one way fare
            </p>

            {/* Fare display */}
            <div className="mt-1 flex items-end gap-1">
              <span className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
                ₹{estimate ? estimate.total.toLocaleString("en-IN") : route.fare.toLocaleString("en-IN")}
              </span>
            </div>
            {estimate && (
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                ₹{estimate.rate}/km × {estimate.billKm} km + bata ₹{estimate.bata.toLocaleString("en-IN")}
              </p>
            )}

            {/* Vehicle selector */}
            <p className="mt-4 mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Select Vehicle</p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
              {vehicles.map((v) => {
                const selected = selectedVehicle === v.name;
                const vRate = acMode === "AC" ? v.oneWayRate : (v.nonAcOneWayRate ?? v.oneWayRate);
                return (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVehicle(v.name)}
                    className={`relative flex flex-col items-center gap-1 rounded-xl border-2 p-1.5 text-center transition ${
                      selected
                        ? "border-brand-500 bg-brand-400/10"
                        : "border-slate-200 hover:border-brand-400/50 dark:border-white/10"
                    }`}
                  >
                    {selected && (
                      <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-brand-500 text-white">
                        <Check className="size-2.5" />
                      </span>
                    )}
                    {v.image ? (
                      <Image src={v.image} alt={v.name} width={56} height={32} className="h-8 w-full object-contain" unoptimized />
                    ) : (
                      <div className="flex h-8 w-full items-center justify-center text-base">🚗</div>
                    )}
                    <p className={`text-[9px] font-bold uppercase leading-tight ${selected ? "text-brand-600 dark:text-brand-400" : "text-slate-700 dark:text-slate-300"}`}>
                      {v.name}
                    </p>
                    <p className={`text-[9px] font-semibold ${selected ? "text-brand-500" : "text-slate-500"}`}>
                      ₹{vRate}/km
                    </p>
                  </button>
                );
              })}
            </div>

            {/* AC / Non-AC */}
            <div className="mt-3 flex gap-2">
              {(["AC", "Non-AC"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setAcMode(m)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 py-2 text-xs font-bold transition ${
                    acMode === m
                      ? "border-brand-500 bg-brand-400/10 text-brand-600 dark:text-brand-400"
                      : "border-slate-200 text-slate-600 hover:border-brand-400/40 dark:border-white/10 dark:text-slate-300"
                  }`}
                >
                  {m === "AC" ? <Snowflake className="size-3.5" /> : <Wind className="size-3.5" />}
                  {m}
                </button>
              ))}
            </div>

            {/* Booking buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={wa(bookMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white transition hover:bg-green-400"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              <a
                href={phoneHref}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-900/15 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              >
                <Phone className="size-4" /> Call Now
              </a>
            </div>

            <p className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-500">
              Instant confirmation • Transparent pricing • 24/7 support
            </p>

            {/* Route mini card */}
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
              <div className="flex-1 text-center">
                <p className="text-xs font-bold">{route.from}</p>
                <p className="text-[10px] text-slate-400">Pickup</p>
              </div>
              <MoveRight className="size-4 text-brand-500" />
              <div className="flex-1 text-center">
                <p className="text-xs font-bold">{route.to}</p>
                <p className="text-[10px] text-slate-400">Drop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
