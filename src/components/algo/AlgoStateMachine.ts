"use client";

import { create } from "zustand";

/**
 * The full vocabulary of ALGO's expressive states. Sections and UI trigger
 * these declaratively (setState) rather than reaching into animation
 * internals directly — this is the single source of truth for "how does
 * ALGO feel right now".
 */
export type AlgoState =
  | "idle"
  | "curious"
  | "happy"
  | "thinking"
  | "focused"
  | "creative"
  | "analyzing"
  | "building"
  | "loading"
  | "success"
  | "sleeping";

interface AlgoStore {
  state: AlgoState;
  previousState: AlgoState;
  pointer: { x: number; y: number };
  pointerActive: boolean;
  lastInteraction: number;
  awake: boolean;
  setState: (state: AlgoState) => void;
  lookAt: (x: number, y: number) => void;
  setPointerActive: (active: boolean) => void;
  ping: () => void;
  setAwake: (awake: boolean) => void;
}

export const useAlgoStore = create<AlgoStore>((set, get) => ({
  state: "idle",
  previousState: "idle",
  pointer: { x: 0, y: 0 },
  pointerActive: false,
  lastInteraction: typeof performance !== "undefined" ? performance.now() : 0,
  awake: false,
  setState: (state) =>
    set((prev) => {
      if (prev.state === state) return {};
      return { state, previousState: prev.state, lastInteraction: performance.now() };
    }),
  lookAt: (x, y) => set({ pointer: { x, y }, lastInteraction: performance.now() }),
  setPointerActive: (active) => set({ pointerActive: active }),
  ping: () => set({ lastInteraction: performance.now() }),
  setAwake: (awake) => set({ awake }),
}));

/** Non-reactive accessor for use inside useFrame loops (avoids re-render churn). */
export function getAlgoState() {
  return useAlgoStore.getState();
}
