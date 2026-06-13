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
  Car,
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

export default function BookingForm() {
  const { site, vehicles, phoneHref, wa } = useSite();
  const [trip, setTrip] = useState<TripType>("One Way");
  const [acMode, setAcMode] = useState<AcMode>("AC");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    drop: "",
    date: "",
    returnDate: "",
    time: "",
    vehicle: vehicles[1]?.name ?? vehicles[0]?.name ?? "",
  });
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [routing, setRouting] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const swap = () => setForm({ ...form, pickup: form.drop, drop: form.pickup });

  const vehicle = vehicles.find((v) => v.name === form.vehicle) ?? vehicles[0];

  // estimate distance when the typed addresses contain known cities
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
        // free OpenStreetMap routing — real driving distance & time
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
      `👤 Name: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      `🔁 Trip Type: ${trip}`,
      `🚗 Vehicle: ${form.vehicle} (${acMode})`,
      `📍 Pickup: ${form.pickup}`,
      `🏁 Drop: ${form.drop}`,
      `📅 Travel Date: ${form.date}`,
    ];
    if (trip === "Round Trip" && form.returnDate) lines.push(`📅 Return Date: ${form.returnDate}`);
    if (form.time) lines.push(`⏰ Pickup Time: ${form.time}`);
    if (estimate) {
      lines.push(
        `📏 Distance: ~${estimate.km} km${trip === "Round Trip" ? " each way" : ""} (${estimate.duration} drive)`,
        `💰 Est. Fare: ₹${estimate.total.toLocaleString("en-IN")} (₹${estimate.rate}/km × ${estimate.billKm} km + bata ₹${estimate.bata.toLocaleString("en-IN")})`,
      );
    }
    lines.push(``, `Please confirm my booking. ✅`);

    window.open(wa(lines.join("\n")), "_blank");
  }

  const inputCls =
    "w-full rounded-xl border border-slate-900/15 bg-white/80 px-4 py-3 pl-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-500/70 focus:bg-white [color-scheme:light] dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-300 dark:focus:border-brand-400/70 dark:focus:bg-white/10 dark:[color-scheme:dark]";
  const optionCls = "bg-white dark:bg-slate-900";

  return (
    <motion.div
      id="book"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="glass relative w-full max-w-md scroll-mt-24 rounded-3xl p-5 shadow-2xl shadow-slate-900/10 sm:p-7 dark:shadow-black/40"
    >
      <div className="absolute -top-3 right-6 rounded-full bg-brand-400 px-3 py-1 text-xs font-bold text-slate-950">
        Instant WhatsApp Booking
      </div>

      <h3 className="font-display text-xl font-bold">Book Your Ride</h3>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Type your pickup & drop address. Booking opens WhatsApp — we confirm by call. No online payment.
      </p>

      {/* trip type toggle */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-900/5 p-1 sm:mt-5 dark:bg-white/5">
        {(["One Way", "Round Trip"] as TripType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTrip(t)}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
              trip === t
                ? "bg-brand-400 text-slate-950 shadow"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            {t === "One Way" ? <ArrowRight className="size-4" /> : <ArrowRightLeft className="size-4" />}
            {t}
          </button>
        ))}
      </div>

      {/* AC / Non-AC toggle */}
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-slate-900/5 p-1 dark:bg-white/5">
        {(["AC", "Non-AC"] as AcMode[]).map((m) => {
          const v = vehicles.find((vv) => vv.name === form.vehicle) ?? vehicles[0];
          const rate = m === "AC"
            ? (trip === "One Way" ? v?.oneWayRate : v?.roundRate)
            : (trip === "One Way" ? (v?.nonAcOneWayRate ?? v?.oneWayRate) : (v?.nonAcRoundRate ?? v?.roundRate));
          return (
            <button
              key={m}
              type="button"
              onClick={() => setAcMode(m)}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                acMode === m
                  ? "bg-brand-400 text-slate-950 shadow"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {m === "AC" ? <Snowflake className="size-3.5" /> : <Wind className="size-3.5" />}
              {m} <span className="opacity-70">· ₹{rate}/km</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {/* pickup / drop address boxes with swap */}
        <div className="relative space-y-3">
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400/80" />
            <input
              className={`${inputCls} pr-12`}
              placeholder="Pickup Address (e.g. Anna Nagar, Chennai)"
              value={form.pickup}
              onChange={set("pickup")}
            />
          </div>

          <div className="relative">
            <Flag className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400/80" />
            <input
              className={`${inputCls} pr-12`}
              placeholder="Drop Address (e.g. Madurai)"
              value={form.drop}
              onChange={set("drop")}
            />
          </div>

          {/* swap button */}
          <button
            type="button"
            onClick={swap}
            aria-label="Swap pickup and drop"
            className="absolute right-3 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-brand-500/40 bg-white text-brand-600 shadow transition hover:rotate-180 active:scale-90 dark:border-brand-400/40 dark:bg-slate-900 dark:text-brand-400"
          >
            <ArrowUpDown className="size-4" />
          </button>
        </div>

        <div className="relative">
          <Car className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400/80" />
          <select className={`${inputCls} appearance-none pr-10`} value={form.vehicle} onChange={set("vehicle")} aria-label="Vehicle">
            {vehicles.map((v) => (
              <option key={v.name} value={v.name} className={optionCls}>
                {v.name} — ₹{trip === "One Way" ? v.oneWayRate : v.roundRate}/km ({v.seats} seater)
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        </div>

        {/* live fare estimate */}
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
                <div className="flex items-center gap-2 rounded-xl border border-brand-500/40 bg-brand-400/10 p-3.5 text-xs font-semibold text-slate-600 dark:border-brand-400/30 dark:text-slate-400">
                  <Loader2 className="size-4 animate-spin text-brand-600 dark:text-brand-400" />
                  Calculating road distance & fare…
                </div>
              ) : estimate ? (
                <div className="rounded-xl border border-brand-500/40 bg-brand-400/10 p-3.5 dark:border-brand-400/30">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <RouteIcon className="size-3.5 text-brand-600 dark:text-brand-400" />
                      {route?.real ? "" : "≈ "}
                      {estimate.km} km{trip === "Round Trip" ? " each way" : ""} • {estimate.duration} drive
                    </span>
                    <span className="uppercase tracking-wider text-brand-700 dark:text-brand-300">Estimated Fare</span>
                  </div>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <p className="text-[11px] leading-snug text-slate-600 dark:text-slate-400">
                      ₹{estimate.rate}/km × {estimate.billKm} km
                      <br />+ Driver bata ₹{estimate.bata.toLocaleString("en-IN")}
                      {trip === "Round Trip" && estimate.days > 1 ? ` (${estimate.days} days)` : ""}
                    </p>
                    <p className="font-display flex items-center text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                      <IndianRupee className="size-5" />
                      {estimate.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-500">
                    *{route?.real ? "Live road distance." : "Approximate distance."} Toll/parking extra. Final fare confirmed on call.
                  </p>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400/80" />
            <input className={inputCls} placeholder="Your Name" value={form.name} onChange={set("name")} />
          </div>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400/80" />
            <input className={inputCls} placeholder="Mobile Number" type="tel" value={form.phone} onChange={set("phone")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <CalendarDays className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400/80" />
            <input className={inputCls} type="date" value={form.date} onChange={set("date")} aria-label="Travel date" />
          </div>
          {trip === "Round Trip" ? (
            <div className="relative">
              <CalendarDays className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400/80" />
              <input
                className={inputCls}
                type="date"
                value={form.returnDate}
                onChange={set("returnDate")}
                aria-label="Return date"
              />
            </div>
          ) : (
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-500 dark:text-brand-400/80" />
              <input className={inputCls} type="time" value={form.time} onChange={set("time")} aria-label="Pickup time" />
            </div>
          )}
        </div>

        {error && <p className="text-xs font-medium text-red-500 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 text-sm font-bold text-white transition hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98]"
        >
          <MessageCircle className="size-5 transition group-hover:scale-110" />
          {estimate ? `Book Now — ₹${estimate.total.toLocaleString("en-IN")}` : "Book on WhatsApp"}
        </button>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="h-px flex-1 bg-slate-900/10 dark:bg-white/10" /> or <span className="h-px flex-1 bg-slate-900/10 dark:bg-white/10" />
        </div>

        <a
          href={phoneHref}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500/60 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-400/10 active:scale-[0.98] dark:border-brand-400/50 dark:text-brand-300"
        >
          <PhoneCall className="size-4" />
          Call to Book — {site.phone}
        </a>
      </form>
    </motion.div>
  );
}
