"use client";

import { create } from "zustand";

/**
 * ALGO lives in a single persistent canvas overlaying the whole page.
 * Sections don't mount their own robot — they "dock" the shared ALGO to a
 * point in viewport space (fractional, 0..1) as they scroll into view.
 * AlgoStage smoothly damps toward whichever dock is currently active.
 */
export interface AlgoDock {
  /** fraction of viewport width, 0 = left edge, 1 = right edge */
  xVW: number;
  /** fraction of viewport height, 0 = top, 1 = bottom */
  yVH: number;
  scale: number;
  rotY: number;
}

export const DEFAULT_DOCK: AlgoDock = { xVW: 0.5, yVH: 0.5, scale: 1, rotY: 0 };

interface AlgoDockState {
  dock: AlgoDock;
  revealed: boolean;
  setDock: (dock: AlgoDock) => void;
  setRevealed: (revealed: boolean) => void;
}

export const useAlgoDockStore = create<AlgoDockState>((set) => ({
  dock: DEFAULT_DOCK,
  revealed: false,
  setDock: (dock) => set({ dock }),
  setRevealed: (revealed) => set({ revealed }),
}));
