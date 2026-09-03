"use client";

import { useEffect, useState } from "react";

export type QualityTier = "high" | "medium" | "low";

export interface QualitySettings {
  tier: QualityTier;
  dpr: [number, number];
  segments: number;
  particleCount: number;
  shadows: boolean;
  isTouch: boolean;
}

const TIER_SETTINGS: Record<QualityTier, Omit<QualitySettings, "tier" | "isTouch">> = {
  high: { dpr: [1, 2], segments: 48, particleCount: 220, shadows: true },
  medium: { dpr: [1, 1.5], segments: 28, particleCount: 90, shadows: false },
  low: { dpr: [1, 1], segments: 16, particleCount: 0, shadows: false },
};

function detectTier(): { tier: QualityTier; isTouch: boolean } {
  if (typeof window === "undefined") {
    return { tier: "medium", isTouch: false };
  }

  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const isSmall = window.innerWidth < 860;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (isTouch || isSmall) {
    if (cores <= 4 || memory <= 4) return { tier: "low", isTouch };
    return { tier: "medium", isTouch };
  }

  if (cores >= 8 && memory >= 8) return { tier: "high", isTouch };
  return { tier: "medium", isTouch };
}

export function useQualityTier(): QualitySettings {
  const [tier, setTier] = useState<{ tier: QualityTier; isTouch: boolean }>({
    tier: "medium",
    isTouch: false,
  });

  useEffect(() => {
    setTier(detectTier());
  }, []);

  return { tier: tier.tier, isTouch: tier.isTouch, ...TIER_SETTINGS[tier.tier] };
}
