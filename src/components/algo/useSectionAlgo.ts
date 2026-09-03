"use client";

import { useEffect, useRef } from "react";
import { useAlgoDockStore, type AlgoDock } from "./AlgoDockStore";
import { useAlgoStore, type AlgoState } from "./AlgoStateMachine";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface SectionAlgoOptions {
  dock: AlgoDock;
  /** Optional narrow-viewport override — mobile layouts stack full-width, so
   * the same fractional coordinates that clear desktop copy often don't. */
  mobileDock?: AlgoDock;
  state?: AlgoState;
  threshold?: number;
}

/**
 * Attach the returned ref to a section's root element. While that section
 * dominates the viewport, ALGO docks to the given point and adopts the
 * given expressive state — this is how "scroll drives the story" without a
 * hand-authored scrub timeline for every section.
 */
export function useSectionAlgo({ dock, mobileDock, state = "idle", threshold = 0.5 }: SectionAlgoOptions) {
  const ref = useRef<HTMLElement | null>(null);
  const isMobile = useIsMobile();
  const activeDock = isMobile && mobileDock ? mobileDock : dock;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Guard against IntersectionObserver's initial/edge callbacks, which
        // can report isIntersecting=true at ratio 0 (or at any nonzero
        // sliver as a section's edge first enters view). Only dock once the
        // section genuinely dominates the viewport.
        if (entry && entry.isIntersecting && entry.intersectionRatio >= threshold) {
          useAlgoDockStore.getState().setDock(activeDock);
          useAlgoStore.getState().setState(state);
        }
      },
      { threshold: [0, threshold, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDock.xVW, activeDock.yVH, activeDock.scale, activeDock.rotY, state, threshold]);

  return ref;
}
