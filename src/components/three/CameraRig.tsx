"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { damp } from "@/lib/utils";
import { useAlgoStore } from "@/components/algo/AlgoStateMachine";

export default function CameraRig() {
  const { camera } = useThree();
  const base = useRef({ x: camera.position.x, y: camera.position.y });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const { pointer, pointerActive } = useAlgoStore.getState();
    const targetX = base.current.x + (pointerActive ? pointer.x * 0.18 : 0);
    const targetY = base.current.y + (pointerActive ? pointer.y * -0.1 : 0);
    camera.position.x = damp(camera.position.x, targetX, 4, dt);
    camera.position.y = damp(camera.position.y, targetY, 4, dt);
    camera.lookAt(0, -0.1, 0);
  });

  return null;
}
