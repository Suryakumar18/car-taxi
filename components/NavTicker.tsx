"use client";

import { Phone } from "lucide-react";
import { useSite } from "./SiteProvider";

export default function NavTicker() {
  const { site, trustBadges } = useSite();

  // Build one set of items
  type Item =
    | { kind: "brand" }
    | { kind: "badge"; text: string }
    | { kind: "phone" }
    | { kind: "tagline" }
    | { kind: "sep" };

  const base: Item[] = [
    { kind: "brand" },
    { kind: "sep" },
    ...trustBadges.flatMap<Item>((b) => [{ kind: "badge", text: b }, { kind: "sep" }]),
    { kind: "phone" },
    { kind: "sep" },
    { kind: "tagline" },
    { kind: "sep" },
  ];

  // Double for seamless loop
  const items = [...base, ...base];

  function renderItem(item: Item, i: number) {
    switch (item.kind) {
      case "brand":
        return (
          <span key={i} className="flex shrink-0 items-center gap-2 font-bold text-white">
            {site.logoUrl && (
              <img src={site.logoUrl} alt={site.name} className="h-5 w-auto object-contain" />
            )}
            {site.name}
          </span>
        );
      case "badge":
        return (
          <span key={i} className="flex shrink-0 items-center gap-1.5 text-white/90">
            <span className="text-yellow-400 font-bold">✓</span>
            {item.text}
          </span>
        );
      case "phone":
        return (
          <span key={i} className="flex shrink-0 items-center gap-1.5 text-white/90">
            <Phone className="size-3.5 text-pink-400" />
            {site.phone}
          </span>
        );
      case "tagline":
        return (
          <span key={i} className="shrink-0 text-white/75 italic">
            {site.tagline}
          </span>
        );
      case "sep":
        return (
          <span key={i} className="shrink-0 text-green-600 select-none">◆</span>
        );
    }
  }

  return (
    <div className="fixed inset-x-0 top-16 z-40 flex h-9 items-center overflow-hidden bg-green-900">
      <div className="animate-marquee-ticker flex w-max items-center gap-8 whitespace-nowrap text-xs font-medium">
        {items.map((item, i) => renderItem(item, i))}
      </div>
    </div>
  );
}
