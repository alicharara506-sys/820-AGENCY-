import type { AlgoDock } from "@/components/algo/AlgoDockStore";

export type AlgoDockKey = "opening" | "hero" | "about" | "world" | "work" | "process" | "contact";

/**
 * Fractional viewport docking points for the single persistent ALGO.
 * xVW/yVH are fractions of the viewport (0..1); scale/rotY are world-space.
 */
export const ALGO_DOCKS: Record<AlgoDockKey, AlgoDock> = {
  opening: { xVW: 0.5, yVH: 0.46, scale: 1.05, rotY: 0 },
  hero: { xVW: 0.8, yVH: 0.48, scale: 0.85, rotY: -0.22 },
  about: { xVW: 0.12, yVH: 0.55, scale: 0.4, rotY: 0.35 },
  world: { xVW: 0.94, yVH: 0.88, scale: 0.32, rotY: -0.3 },
  work: { xVW: 0.5, yVH: 0.15, scale: 0.34, rotY: 0 },
  process: { xVW: 0.5, yVH: 0.12, scale: 0.42, rotY: 0 },
  contact: { xVW: 0.84, yVH: 0.6, scale: 0.65, rotY: 0.18 },
};

/**
 * Narrow-viewport docks. Mobile layouts stack content full-width, so ALGO
 * moves to small, low-conflict corners instead of reusing desktop
 * coordinates that were tuned against a two-column layout.
 */
export const ALGO_DOCKS_MOBILE: Record<AlgoDockKey, AlgoDock> = {
  opening: { xVW: 0.5, yVH: 0.4, scale: 0.6, rotY: 0 },
  hero: { xVW: 0.84, yVH: 0.09, scale: 0.3, rotY: -0.2 },
  about: { xVW: 0.84, yVH: 0.1, scale: 0.26, rotY: 0.3 },
  world: { xVW: 0.92, yVH: 0.97, scale: 0.18, rotY: -0.3 },
  work: { xVW: 0.5, yVH: 0.09, scale: 0.24, rotY: 0 },
  process: { xVW: 0.82, yVH: 0.1, scale: 0.28, rotY: 0 },
  contact: { xVW: 0.86, yVH: 0.09, scale: 0.3, rotY: 0.15 },
};
