"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft,
  ArrowRight,
  ArrowUpDown,
  MapPin,
  Flag,
  CalendarDays,
  Clock,
  User,
  Phone,
  MessageCircle,
  PhoneCall,
  ChevronDown,
  IndianRupee,
  Loader2,
  Route as RouteIcon,
  Snowflake,
  Wind,
} from "lucide-react";
import { matchLocation, estimateRoadKm, estimateFare } from "@/lib/config";
import { useSite } from "./SiteProvider";

type TripType = "One Way" | "Round Trip";
type AcMode = "AC" | "Non-AC";
type RouteInfo = { km: number; durationHrs?: number; real: boolean };

const PICKUP_TIMES = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const period = i < 12 ? "AM" : "PM";
  return `${hour}:00 ${period}`;
});

export default function BookingForm() {
  const { site, vehicles, phoneHref, wa } = useSite();
  const [trip, setTrip] = useState<TripType>("One Way");
  const [acMode, setAcMode] = useState<AcMode>("AC");
  const [form, setForm] = useState({
    pickup: "",
    drop: "",
    name: "",
    phone: "",
    date: "",
    time: "",
    returnDate: "",
    vehicle: vehicles[1]?.name ?? vehicles[0]?.name ?? "",
  });
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [routing, setRouting] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const swap = () => setForm({ ...form, pickup: form.drop, drop: form.pickup });

  const vehicle = vehicles.find((v) => v.name === form.vehicle) ?? vehicles[0];
  const pickupLoc = useMemo(() => matchLocation(form.pickup), [form.pickup]);
  const dropLoc = useMemo(() => matchLocation(form.drop), [form.drop]);

  useEffect(() => {
    setRoute(null);
    if (!pickupLoc || !dropLoc || pickupLoc.name === dropLoc.name) {
      setRouting(false);
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setRouting(true);
    const timer = setTimeout(async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${pickupLoc.lng},${pickupLoc.lat};${dropLoc.lng},${dropLoc.lat}?overview=false`;
        const res = await fetch(url, { signal: ctrl.signal });
        const json = await res.json();
        const r = json?.routes?.[0];
        if (r?.distance) {
          setRoute({ km: Math.round(r.distance / 1000), durationHrs: r.duration / 3600, real: true });
        } else {
          setRoute({ km: estimateRoadKm(pickupLoc, dropLoc), real: false });
        }
      } catch {
        if (!ctrl.signal.aborted) setRoute({ km: estimateRoadKm(pickupLoc, dropLoc), real: false });
      } finally {
        if (!ctrl.signal.aborted) setRouting(false);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [pickupLoc, dropLoc]);

  const estimate = useMemo(
    () => (route && vehicle ? estimateFare(vehicle, trip, route.km, route.durationHrs, acMode) : null),
    [route, vehicle, trip, acMode],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.pickup || !form.drop || !form.date) {
      setError("Please fill name, phone, pickup, drop & date.");
      return;
    }
    setError("");
    const lines = [
      `🚖 *New Booking — ${site.name}*`,
      ``,
      `📍 Pickup: ${form.pickup}`,
      `🏁 Drop: ${form.drop}`,
      `👤 Name: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      `📅 Travel Date: ${form.date}`,
    ];
    if (form.time) lines.push(`⏰ Pickup Time: ${form.time}`);
    if (trip === "Round Trip" && form.returnDate) lines.push(`📅 Return Date: ${form.returnDate}`);
    lines.push(`🔁 Trip Type: ${trip}`, `🚗 Vehicle: ${form.vehicle} (${acMode})`);
    if (estimate) {
      lines.push(
        `📏 Distance: ~${estimate.km} km${trip === "Round Trip" ? " each way" : ""} (${estimate.duration} drive)`,
        `💰 Est. Fare: ₹${estimate.total.toLocaleString("en-IN")} (₹${estimate.rate}/km × ${estimate.billKm} km + bata ₹${estimate.bata.toLocaleString("en-IN")})`,
      );
    }
    lines.push(``, `Please confirm my booking. ✅`);
    window.open(wa(lines.join("\n")), "_blank");
  }

  // Input base — labels are shown separately so no pl-11 offset needed
  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 [color-scheme:light] dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-green-500/60 dark:[color-scheme:dark]";
  const labelCls = "mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";
  const optCls = "bg-white dark:bg-slate-900";

  return (
    <motion.div
      id="book"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="glass relative w-full max-w-xl scroll-mt-24 rounded-3xl p-4 shadow-2xl shadow-slate-900/10 sm:p-5 lg:max-w-2xl dark:shadow-black/40"
    >
      {/* Header */}
      <h3 className="font-display text-lg font-bold sm:text-xl">Quick Taxi Booking</h3>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        One Way • Outstation • Airport Drop
      </p>

      <form onSubmit={handleSubmit} className="mt-3 space-y-3">

        {/* ── Row 1: Pickup + Drop ── */}
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Pickup Address</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-green-600 dark:text-green-500" />
                <input
                  className={inputCls}
                  placeholder="Enter pickup location"
                  value={form.pickup}
                  onChange={set("pickup")}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Drop Address</label>
              <div className="relative">
                <Flag className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-green-600 dark:text-green-500" />
                <input
                  className={inputCls}
                  placeholder="Enter drop location"
                  value={form.drop}
                  onChange={set("drop")}
                />
              </div>
            </div>
          </div>
          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              onClick={swap}
              className="flex items-center gap-1 text-[11px] font-medium text-green-700 hover:text-green-600 dark:text-green-400"
            >
              <ArrowUpDown className="size-3" />
              Swap pickup &amp; drop
            </button>
          </div>
        </div>

        {/* ── Row 2: Full Name + Mobile Number ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Full Name</label>
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-green-600 dark:text-green-500" />
              <input className={inputCls} placeholder="Your name" value={form.name} onChange={set("name")} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-green-600 dark:text-green-500" />
              <input className={inputCls} placeholder="10-digit mobile" type="tel" value={form.phone} onChange={set("phone")} />
            </div>
          </div>
        </div>

        {/* ── Row 3: Pickup Date + Pickup Time ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Pickup Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-green-600 dark:text-green-500" />
              <input className={inputCls} type="date" value={form.date} onChange={set("date")} aria-label="Pickup date" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Pickup Time</label>
            <div className="relative">
              <Clock className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-green-600 dark:text-green-500" />
              <select
                className={`${inputCls} appearance-none pr-10`}
                value={form.time}
                onChange={set("time")}
                aria-label="Pickup time"
              >
                <option value="" className={optCls}>Select Time</option>
                {PICKUP_TIMES.map((t) => (
                  <option key={t} value={t} className={optCls}>{t}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Return date (Round Trip only) */}
        {trip === "Round Trip" && (
          <div>
            <label className={labelCls}>Return Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-green-600 dark:text-green-500" />
              <input
                className={inputCls}
                type="date"
                value={form.returnDate}
                onChange={set("returnDate")}
                aria-label="Return date"
              />
            </div>
          </div>
        )}

        {/* ── Trip Type cards ── */}
        <div>
          <label className={labelCls}>Trip Type</label>
          <div className="grid grid-cols-2 gap-3">
            {(["One Way", "Round Trip"] as TripType[]).map((t) => {
              const active = trip === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTrip(t)}
                  className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left transition ${
                    active
                      ? "border-green-500 bg-green-50 dark:border-green-500/70 dark:bg-green-900/20"
                      : "border-slate-200 bg-white hover:border-green-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-green-600/40"
                  }`}
                >
                  {t === "One Way"
                    ? <ArrowRight className="size-4 shrink-0 text-green-600" />
                    : <ArrowRightLeft className="size-4 shrink-0 text-green-600" />}
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 dark:text-white">{t}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{t === "One Way" ? "Min 150 KM" : "Min 300 KM/Day"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── AC / Non-AC toggle ── */}
        <div>
          <label className={labelCls}>AC / Non-AC</label>
          <div className="grid grid-cols-2 gap-3">
            {(["AC", "Non-AC"] as AcMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setAcMode(m)}
                className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2 text-[13px] font-semibold transition ${
                  acMode === m
                    ? "border-green-500 bg-green-50 text-green-700 dark:border-green-500/70 dark:bg-green-900/20 dark:text-green-400"
                    : "border-slate-200 bg-white text-slate-600 hover:border-green-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-green-600/40"
                }`}
              >
                {m === "AC" ? <Snowflake className="size-4" /> : <Wind className="size-4" />}
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* ── Vehicle card grid ── */}
        <div>
          <label className={labelCls}>Select Vehicle</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
            {vehicles.map((v) => {
              const rate = acMode === "AC"
                ? (trip === "One Way" ? v.oneWayRate : v.roundRate)
                : (trip === "One Way" ? (v.nonAcOneWayRate ?? v.oneWayRate) : (v.nonAcRoundRate ?? v.roundRate));
              const selected = form.vehicle === v.name;
              return (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setForm({ ...form, vehicle: v.name })}
                  className={`flex flex-col items-center gap-0.5 rounded-lg border-2 px-1 py-1.5 text-center transition ${
                    selected
                      ? "border-green-500 bg-green-50 dark:border-green-500/70 dark:bg-green-900/20"
                      : "border-slate-200 bg-white hover:border-green-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-green-600/30"
                  }`}
                >
                  {v.image ? (
                    <img
                      src={v.image}
                      alt={v.name}
                      width={80}
                      height={48}
                      className="h-11 w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-11 w-full items-center justify-center">
                      <span className="text-xl sm:text-2xl">🚗</span>
                    </div>
                  )}
                  <p className={`text-[11px] font-bold ${selected ? "text-green-600 dark:text-green-400" : "text-green-700 dark:text-green-500"}`}>
                    ₹{rate}<span className="text-[9px] font-normal">/km</span>
                  </p>
                  <p className="text-[9px] font-semibold uppercase leading-tight tracking-wide text-slate-700 dark:text-slate-300">
                    {v.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Live fare estimate ── */}
        <AnimatePresence>
          {(routing || estimate) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {routing && !estimate ? (
                <div className="flex items-center gap-2 rounded-xl border border-green-500/40 bg-green-50 p-3.5 text-xs font-semibold text-slate-600 dark:border-green-500/20 dark:bg-green-900/10 dark:text-slate-400">
                  <Loader2 className="size-4 animate-spin text-green-600 dark:text-green-400" />
                  Calculating road distance &amp; fare…
                </div>
              ) : estimate ? (
                <div className="rounded-xl border border-green-500/40 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-900/10">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <RouteIcon className="size-3.5 text-green-600 dark:text-green-400" />
                      {route?.real ? "" : "≈ "}
                      {estimate.km} km{trip === "Round Trip" ? " each way" : ""} • {estimate.duration} drive
                    </span>
                    <span className="uppercase tracking-wider text-green-700 dark:text-green-400">Estimated Fare</span>
                  </div>
                  <div className="mt-1.5 flex items-end justify-between gap-2">
                    <p className="text-[11px] leading-snug text-slate-600 dark:text-slate-400">
                      ₹{estimate.rate}/km × {estimate.billKm} km
                      <br />+ Driver bata ₹{estimate.bata.toLocaleString("en-IN")}
                      {trip === "Round Trip" && estimate.days > 1 ? ` (${estimate.days} days)` : ""}
                    </p>
                    <p className="flex items-center text-2xl font-extrabold text-green-600 dark:text-green-400">
                      <IndianRupee className="size-5" />
                      {estimate.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    *{route?.real ? "Live road distance." : "Approximate distance."} Toll/parking extra. Final fare confirmed on call.
                  </p>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="text-xs font-medium text-red-500 dark:text-red-400">{error}</p>}

        {/* ── Send Booking ── */}
        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-2.5 text-sm font-bold text-white transition hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98]"
        >
          <MessageCircle className="size-4 transition group-hover:scale-110" />
          {estimate ? `Send Booking — ₹${estimate.total.toLocaleString("en-IN")}` : "Send Booking via WhatsApp"}
        </button>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="h-px flex-1 bg-slate-900/10 dark:bg-white/10" />
          or call directly
          <span className="h-px flex-1 bg-slate-900/10 dark:bg-white/10" />
        </div>

        <a
          href={phoneHref}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-600/50 py-2 text-[13px] font-bold text-green-700 transition hover:bg-green-50 active:scale-[0.98] dark:border-green-500/40 dark:text-green-400 dark:hover:bg-green-900/20"
        >
          <PhoneCall className="size-4" />
          {site.phone}
        </a>
      </form>
    </motion.div>
  );
}
