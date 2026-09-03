"use client";

import { useEffect, useRef, useState } from "react";
import { useAlgoDockStore } from "@/components/algo/AlgoDockStore";
import { damp } from "@/lib/utils";

const NEAR_ALGO_RADIUS = 170;

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [nearAlgo, setNearAlgo] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let raf = 0;

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const { dock, revealed } = useAlgoDockStore.getState();
      if (revealed) {
        const algoX = dock.xVW * window.innerWidth;
        const algoY = dock.yVH * window.innerHeight;
        const dist = Math.hypot(mouse.x - algoX, mouse.y - algoY);
        setNearAlgo(dist < NEAR_ALGO_RADIUS);
      }
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest("[data-cursor='interactive']")));
    }

    function tick() {
      ring.x = damp(ring.x, mouse.x, 22, 1 / 60);
      ring.y = damp(ring.y, mouse.y, 22, 1 / 60);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  if (isTouch) return null;

  const active = hovering || nearAlgo;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full transition-colors duration-200"
        style={{ background: nearAlgo ? "#5B5CFF" : "#0A0A0C" }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full border transition-[width,height,border-color,background-color] duration-300 ease-out"
        style={{
          width: active ? 52 : 30,
          height: active ? 52 : 30,
          borderColor: nearAlgo ? "#5B5CFF" : "rgba(10,10,12,0.35)",
          backgroundColor: nearAlgo ? "rgba(91,92,255,0.08)" : "transparent",
        }}
      />
    </div>
  );
}
