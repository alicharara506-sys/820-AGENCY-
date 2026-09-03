"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAlgoDockStore } from "@/components/algo/AlgoDockStore";
import { useAlgoStore } from "@/components/algo/AlgoStateMachine";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { ALGO_DOCKS, ALGO_DOCKS_MOBILE } from "@/lib/algoDocks";

const SEEN_KEY = "820-intro-seen";

export default function Opening() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const docks = isMobile ? ALGO_DOCKS_MOBILE : ALGO_DOCKS;
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SEEN_KEY)) {
      setSkip(true);
    }
  }, []);

  useEffect(() => {
    const dockStore = useAlgoDockStore.getState();
    const algoStore = useAlgoStore.getState();

    if (skip) {
      dockStore.setDock(docks.hero);
      dockStore.setRevealed(true);
      algoStore.setState("idle");
      algoStore.setAwake(true);
      if (overlayRef.current) overlayRef.current.style.display = "none";
      return;
    }

    sessionStorage.setItem(SEEN_KEY, "1");
    dockStore.setDock(docks.opening);
    algoStore.setState("sleeping");

    const overlay = overlayRef.current;
    if (!overlay) return;

    if (reducedMotion) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (overlay) overlay.style.display = "none";
        },
      });
      tl.set([wordmarkRef.current, taglineRef.current, headlineRef.current], { opacity: 1, y: 0 });
      tl.call(() => {
        dockStore.setRevealed(true);
        dockStore.setDock(docks.hero);
        algoStore.setState("idle");
        algoStore.setAwake(true);
      });
      tl.to(overlay, { opacity: 0, duration: 0.5, delay: 0.4 });
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        document.body.style.overflow = "";
        if (overlay) overlay.style.display = "none";
      },
    });

    tl.set(dotRef.current, { opacity: 0, scale: 0 });
    tl.set(eyesRef.current, { opacity: 0 });
    tl.set([wordmarkRef.current, taglineRef.current, headlineRef.current], { opacity: 0, y: 22 });
    tl.set(statusRef.current, { opacity: 0 });

    tl.to(dotRef.current, { opacity: 1, scale: 1, duration: 0.6 })
      .to(dotRef.current, { scale: 1.35, duration: 0.55, repeat: 1, yoyo: true, ease: "sine.inOut" })
      .to(dotRef.current, { opacity: 0, scale: 0.6, duration: 0.35 }, "+=0.1")
      .to(eyesRef.current, { opacity: 1, duration: 0.4 }, "<")
      .call(() => {
        algoStore.setState("idle");
        algoStore.setAwake(true);
        dockStore.setRevealed(true);
      })
      .to(eyesRef.current, { opacity: 0, duration: 0.5 }, "+=0.35")
      .to(statusRef.current, { opacity: 1, duration: 0.35 }, "<")
      .to(statusRef.current, { opacity: 0, duration: 0.3 }, "+=0.5")
      .to(wordmarkRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.1")
      .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.45")
      .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.9 }, "-=0.4")
      .call(() => {
        dockStore.setDock(docks.hero);
      }, undefined, "+=0.5")
      .to(overlay, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, "+=0.35");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, reducedMotion, isMobile]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white px-6 text-center"
    >
      <div ref={dotRef} className="absolute h-3 w-3 rounded-full bg-violet" />
      <div ref={eyesRef} className="absolute flex items-center gap-4">
        <span className="h-9 w-2 rounded-full bg-violet" />
        <span className="h-9 w-2 rounded-full bg-violet" />
      </div>
      <div ref={statusRef} className="absolute label text-violet">
        SYSTEM ONLINE
      </div>

      <div className="flex flex-col items-center gap-6">
        <div ref={wordmarkRef} className="label text-black/50">
          820 AGENCY
        </div>
        <div ref={taglineRef} className="label text-black/40">
          BRAND × DIGITAL × TECHNOLOGY × AI × ANALYTICS
        </div>
        <div ref={headlineRef} className="font-display text-display-lg font-medium tracking-tight text-balance">
          WE BUILD THE
          <br />
          <span className="text-violet">ALGORITHM</span>
          <br />
          BEHIND GROWTH.
        </div>
      </div>
    </div>
  );
}
