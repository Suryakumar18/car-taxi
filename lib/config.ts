// ─────────────────────────────────────────────────────────────
// STATIC HELPERS — business data (name, phone, tariffs, routes,
// theme) now lives in MongoDB and is managed from /admin.
// This file keeps only the fare math and the known-city list.
// ─────────────────────────────────────────────────────────────

export const MIN_KM_ONE_WAY = 150;
export const MIN_KM_ROUND = 300;

// ── Known cities (used for the marquee + fare estimation from typed text) ──
export type Location = { name: string; lat: number; lng: number };

export const LOCATIONS: Location[] = [
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Salem", lat: 11.6643, lng: 78.146 },
  { name: "Trichy", lat: 10.7905, lng: 78.7047 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Pondicherry", lat: 11.9416, lng: 79.8083 },
  { name: "Ooty", lat: 11.4102, lng: 76.695 },
  { name: "Kodaikanal", lat: 10.2381, lng: 77.4892 },
  { name: "Erode", lat: 11.341, lng: 77.7172 },
  { name: "Vellore", lat: 12.9165, lng: 79.1325 },
  { name: "Thanjavur", lat: 10.787, lng: 79.1378 },
  { name: "Dindigul", lat: 10.3673, lng: 77.9803 },
  { name: "Karur", lat: 10.9601, lng: 78.0766 },
  { name: "Tiruppur", lat: 11.1085, lng: 77.3411 },
  { name: "Nagercoil", lat: 8.1774, lng: 77.4343 },
  { name: "Kanyakumari", lat: 8.0883, lng: 77.5385 },
  { name: "Rameswaram", lat: 9.2876, lng: 79.3129 },
  { name: "Velankanni", lat: 10.6822, lng: 79.8424 },
  { name: "Kumbakonam", lat: 10.9617, lng: 79.3881 },
  { name: "Chidambaram", lat: 11.3995, lng: 79.6915 },
  { name: "Hosur", lat: 12.7409, lng: 77.8253 },
  { name: "Tirupati", lat: 13.6288, lng: 79.4192 },
  { name: "Pollachi", lat: 10.6589, lng: 77.0085 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
];

export const CITIES = LOCATIONS.map((l) => l.name);

/** Find a known city inside free-typed text, e.g. "Anna Nagar, Chennai" → Chennai */
export function matchLocation(text: string): Location | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;
  return (
    LOCATIONS.find((l) => l.name.toLowerCase() === t) ??
    LOCATIONS.find((l) => t.includes(l.name.toLowerCase())) ??
    null
  );
}

// ── Fare estimation ──────────────────────────────────────────
const ROAD_FACTOR = 1.15;
const AVG_SPEED_KMPH = 55;

export function estimateRoadKm(a: Location, b: Location): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const straight = 2 * R * Math.asin(Math.sqrt(h));
  return Math.round((straight * ROAD_FACTOR) / 5) * 5;
}

export type FareVehicle = {
  oneWayRate: number;
  roundRate: number;
  nonAcOneWayRate?: number;
  nonAcRoundRate?: number;
  bataOneWay: number;
  bataRound: number;
};

export type FareEstimate = {
  km: number;
  billKm: number;
  rate: number;
  bata: number;
  days: number;
  total: number;
  duration: string;
};

export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round(((hours - h) * 60) / 15) * 15;
  return m >= 60 ? `${h + 1}h` : m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function estimateFare(
  vehicle: FareVehicle,
  tripType: "One Way" | "Round Trip",
  km: number,
  durationHrs?: number,
  acMode: "AC" | "Non-AC" = "AC",
): FareEstimate {
  const oneWay = tripType === "One Way";
  const ac = acMode === "AC";
  const rate = oneWay
    ? (ac ? vehicle.oneWayRate : (vehicle.nonAcOneWayRate ?? vehicle.oneWayRate))
    : (ac ? vehicle.roundRate : (vehicle.nonAcRoundRate ?? vehicle.roundRate));
  const tripKm = oneWay ? km : km * 2;
  const billKm = Math.max(tripKm, oneWay ? MIN_KM_ONE_WAY : MIN_KM_ROUND);
  const days = oneWay ? 1 : Math.max(1, Math.ceil(tripKm / 450));
  const bata = oneWay ? vehicle.bataOneWay : vehicle.bataRound * days;
  const total = billKm * rate + bata;
  const duration = formatDuration(durationHrs ?? km / AVG_SPEED_KMPH);

  return { km, billKm, rate, bata, days, total, duration };
}
