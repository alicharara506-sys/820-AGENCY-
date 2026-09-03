"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Algo from "./Algo";
import Lighting from "@/components/three/Lighting";
import CameraRig from "@/components/three/CameraRig";
import { useAlgoDockStore } from "./AlgoDockStore";
import { useAlgoStore } from "./AlgoStateMachine";
import { useQualityTier } from "@/lib/hooks/useQualityTier";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { damp } from "@/lib/utils";

const SLEEP_AFTER_MS = 26000;

function DockedAlgo({
  quality,
  interactive,
  reducedMotion,
}: {
  quality: "high" | "medium" | "low";
  interactive: boolean;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const current = useRef({ x: 0, y: 0, scale: 1, rotY: 0 });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const { dock } = useAlgoDockStore.getState();
    const cam = camera as THREE.PerspectiveCamera;
    const distance = cam.position.z;
    const vFov = (cam.fov * Math.PI) / 180;
    const halfH = Math.tan(vFov / 2) * distance;
    const halfW = halfH * (size.width / size.height);

    const targetX = (dock.xVW * 2 - 1) * halfW;
    const targetY = -(dock.yVH * 2 - 1) * halfH;

    const lambda = reducedMotion ? 8 : 3.4;
    current.current.x = damp(current.current.x, targetX, lambda, dt);
    current.current.y = damp(current.current.y, targetY, lambda, dt);
    current.current.scale = damp(current.current.scale, dock.scale, lambda, dt);
    current.current.rotY = damp(current.current.rotY, dock.rotY, lambda, dt);

    if (group.current) {
      group.current.position.x = current.current.x;
      group.current.position.y = current.current.y;
      group.current.scale.setScalar(current.current.scale);
      group.current.rotation.y = current.current.rotY;
    }
  });

  return (
    <group ref={group}>
      <Algo quality={quality} interactive={interactive} />
    </group>
  );
}

function PointerAndAutopilot({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    function updatePointer(x: number, y: number) {
      const nx = (x / window.innerWidth) * 2 - 1;
      const ny = -((y / window.innerHeight) * 2 - 1);
      const store = useAlgoStore.getState();
      store.lookAt(nx, ny);
      store.setPointerActive(true);
      if (!store.awake) store.setAwake(true);
    }

    function onMouseMove(e: MouseEvent) {
      updatePointer(e.clientX, e.clientY);
    }
    function onTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    }
    function onScrollOrKey() {
      useAlgoStore.getState().ping();
      if (!useAlgoStore.getState().awake) useAlgoStore.getState().setAwake(true);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScrollOrKey, { passive: true });
    window.addEventListener("keydown", onScrollOrKey);

    const interval = window.setInterval(() => {
      const { state, lastInteraction, setState } = useAlgoStore.getState();
      const idleFor = performance.now() - lastInteraction;
      if (state === "idle" && idleFor > SLEEP_AFTER_MS) {
        setState("sleeping");
        useAlgoStore.getState().setAwake(false);
      }
      if (state === "sleeping" && idleFor < SLEEP_AFTER_MS) {
        setState("idle");
      }
    }, 1500);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScrollOrKey);
      window.removeEventListener("keydown", onScrollOrKey);
      window.clearInterval(interval);
    };
  }, [enabled]);

  return null;
}

export default function AlgoStage() {
  const { tier, dpr } = useQualityTier();
  const reducedMotion = useReducedMotion();
  const revealed = useAlgoDockStore((s) => s.revealed);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    function onVisibility() {
      setTabVisible(document.visibilityState === "visible");
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-30 pointer-events-none transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ opacity: revealed ? 1 : 0 }}
    >
      <Canvas
        dpr={dpr}
        gl={{ antialias: tier !== "low", alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 36, position: [0, 0, 6.8], near: 1, far: 14 }}
        frameloop={tabVisible ? "always" : "never"}
      >
        <Lighting dim={tier === "low"} />
        <DockedAlgo quality={tier} interactive={!reducedMotion} reducedMotion={reducedMotion} />
        {!reducedMotion && <CameraRig />}
      </Canvas>
      <PointerAndAutopilot enabled={revealed} />
    </div>
  );
}
