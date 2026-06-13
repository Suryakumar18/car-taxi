"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteData } from "@/lib/site-types";

type SiteContextValue = SiteData & {
  phoneHref: string;
  wa: (message: string) => string;
  quickMessage: string;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ data, children }: { data: SiteData; children: ReactNode }) {
  const value: SiteContextValue = {
    ...data,
    phoneHref: `tel:+${data.site.whatsappNumber}`,
    wa: (message: string) => `https://wa.me/${data.site.whatsappNumber}?text=${encodeURIComponent(message)}`,
    quickMessage: `Hi ${data.site.name}! 🚖 I want to book a cab. Please share the details.`,
  };
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
