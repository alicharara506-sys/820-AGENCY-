"use client";

import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useAlgoStore } from "./AlgoStateMachine";
import { AlgoFaceTexture } from "./AlgoFace";
import { ALGO_POSES } from "./AlgoPose";
import { clamp, damp, mapRange } from "@/lib/utils";

const VIOLET = "#5B5CFF";

interface AlgoProps {
  quality: "high" | "medium" | "low";
  interactive?: boolean;
}

export default function Algo({ quality, interactive = true }: AlgoProps) {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const faceMesh = useRef<THREE.Mesh>(null);

  const segments = quality === "high" ? 32 : quality === "medium" ? 20 : 12;

  const faceTexture = useMemo(() => new AlgoFaceTexture(), []);

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#101014",
        roughness: 0.28,
        metalness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      }),
    []
  );

  const faceMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.4,
        metalness: 0,
        clearcoat: 0.5,
      }),
    []
  );

  const eyeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: faceTexture.texture,
        transparent: true,
        toneMapped: false,
        depthWrite: false,
      }),
    [faceTexture]
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: VIOLET,
        emissive: VIOLET,
        emissiveIntensity: 1.6,
        roughness: 0.3,
        toneMapped: false,
      }),
    []
  );

  const blinkState = useRef({ next: 2 + Math.random() * 3, phase: 0, value: 1 });
  const clock = useRef(0);
  const currentPose = useRef({ ...ALGO_POSES.idle });
  const currentLook = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    clock.current += dt;
    const t = clock.current;

    const { state, pointer, pointerActive, awake } = useAlgoStore.getState();
    const target = ALGO_POSES[state];
    const lambda = 4.5;

    currentPose.current.headTilt[0] = damp(currentPose.current.headTilt[0], target.headTilt[0], lambda, dt);
    currentPose.current.headTilt[1] = damp(currentPose.current.headTilt[1], target.headTilt[1], lambda, dt);
    currentPose.current.headTilt[2] = damp(currentPose.current.headTilt[2], target.headTilt[2], lambda, dt);
    currentPose.current.lean = damp(currentPose.current.lean, target.lean, lambda, dt);
    currentPose.current.armRaiseL = damp(currentPose.current.armRaiseL, target.armRaiseL, 3.5, dt);
    currentPose.current.armRaiseR = damp(currentPose.current.armRaiseR, target.armRaiseR, 3.5, dt);
    currentPose.current.bounce = damp(currentPose.current.bounce, target.bounce, 5, dt);
    currentPose.current.bobSpeed = damp(currentPose.current.bobSpeed, target.bobSpeed, 2, dt);
    currentPose.current.energy = damp(currentPose.current.energy, target.energy, 3, dt);

    const wake = awake ? 1 : 0.4;
    const bob = Math.sin(t * 0.9 * currentPose.current.bobSpeed) * 0.045 * wake;
    const sway = Math.sin(t * 0.55) * 0.035 * wake;

    const lookX = interactive && pointerActive ? clamp(pointer.x, -1, 1) : Math.sin(t * 0.18) * 0.25;
    const lookY = interactive && pointerActive ? clamp(pointer.y, -1, 1) : Math.cos(t * 0.14) * 0.12;
    currentLook.current.x = damp(currentLook.current.x, lookX, 6, dt);
    currentLook.current.y = damp(currentLook.current.y, lookY, 6, dt);

    if (group.current) {
      group.current.position.y = bob + currentPose.current.bounce;
      group.current.rotation.z = sway * 0.3 + currentPose.current.lean * 0.4;
    }

    if (head.current) {
      const yaw = mapRange(currentLook.current.x, -1, 1, -0.42, 0.42) + currentPose.current.headTilt[1];
      const pitch = mapRange(currentLook.current.y, -1, 1, 0.22, -0.28) + currentPose.current.headTilt[0];
      head.current.rotation.y = damp(head.current.rotation.y, yaw, 8, dt);
      head.current.rotation.x = damp(head.current.rotation.x, pitch, 8, dt);
      head.current.rotation.z = damp(head.current.rotation.z, currentPose.current.headTilt[2], 8, dt);
    }

    if (torso.current) {
      torso.current.rotation.y = damp(torso.current.rotation.y, currentPose.current.headTilt[1] * 0.3, 6, dt);
      const breathe = 1 + Math.sin(t * 1.1) * 0.012 * wake;
      torso.current.scale.set(1, breathe, 1);
    }

    if (armL.current) {
      const idleSwing = Math.sin(t * 1.2) * 0.06 * wake;
      armL.current.rotation.z = damp(
        armL.current.rotation.z,
        0.18 + idleSwing + currentPose.current.armRaiseL * 1.4,
        4,
        dt
      );
    }
    if (armR.current) {
      const idleSwing = Math.sin(t * 1.2 + Math.PI) * 0.06 * wake;
      armR.current.rotation.z = damp(
        armR.current.rotation.z,
        -0.18 - idleSwing - currentPose.current.armRaiseR * 1.4,
        4,
        dt
      );
    }

    // blink cycle
    const blink = blinkState.current;
    if (state !== "sleeping") {
      blink.phase -= dt;
      if (blink.phase <= 0 && blink.value >= 0.98) {
        blink.phase = 0.14;
        blink.value = 0;
      }
      if (blink.value < 1) {
        blink.value = Math.min(1, blink.value + dt * 9);
        if (blink.value >= 1) blink.next = 2 + Math.random() * 3.5;
      }
      if (blink.value >= 1) {
        blink.next -= dt;
        if (blink.next <= 0) blink.value = 0.02;
      }
    } else {
      blink.value = 1;
    }

    faceTexture.render(state, {
      time: t,
      blink: state === "sleeping" ? 1 : blink.value,
      lookX: currentLook.current.x,
      lookY: currentLook.current.y,
    });

    accentMaterial.emissiveIntensity = damp(
      accentMaterial.emissiveIntensity,
      0.6 + currentPose.current.energy * 1.6,
      3,
      dt
    );
  });

  return (
    <group ref={group} dispose={null}>
      {/* torso */}
      <group ref={torso} position={[0, -0.05, 0]}>
        <RoundedBox args={[0.58, 0.86, 0.48]} radius={0.24} smoothness={segments / 4} material={bodyMaterial} position={[0, -0.68, 0]} />
        <mesh position={[0, -0.46, 0.245]} material={accentMaterial}>
          <circleGeometry args={[0.026, 20]} />
        </mesh>

        {/* left arm */}
        <group ref={armL} position={[-0.34, -0.4, 0]}>
          <mesh position={[0, -0.19, 0]} material={bodyMaterial} castShadow>
            <capsuleGeometry args={[0.095, 0.28, 4, segments]} />
          </mesh>
          <mesh position={[0, -0.44, 0]} material={bodyMaterial}>
            <sphereGeometry args={[0.085, segments, segments / 2]} />
          </mesh>
        </group>

        {/* right arm */}
        <group ref={armR} position={[0.34, -0.4, 0]}>
          <mesh position={[0, -0.19, 0]} material={bodyMaterial}>
            <capsuleGeometry args={[0.095, 0.28, 4, segments]} />
          </mesh>
          <mesh position={[0, -0.44, 0]} material={bodyMaterial}>
            <sphereGeometry args={[0.085, segments, segments / 2]} />
          </mesh>
        </group>

        {/* legs */}
        {[-0.15, 0.15].map((x) => (
          <group key={x} position={[x, -1.1, 0]}>
            <mesh position={[0, -0.16, 0]} material={bodyMaterial}>
              <capsuleGeometry args={[0.11, 0.26, 4, segments]} />
            </mesh>
            <RoundedBox args={[0.22, 0.12, 0.3]} radius={0.05} smoothness={4} material={bodyMaterial} position={[0, -0.36, 0.04]} />
            <mesh position={[0, -0.42, 0.14]} material={accentMaterial}>
              <boxGeometry args={[0.16, 0.018, 0.04]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* neck */}
      <mesh position={[0, -0.19, 0]} material={accentMaterial}>
        <cylinderGeometry args={[0.14, 0.17, 0.07, segments]} />
      </mesh>

      {/* head */}
      <group ref={head} position={[0, 0.28, 0]}>
        <RoundedBox args={[0.72, 0.62, 0.66]} radius={0.3} smoothness={segments / 4} material={bodyMaterial} />

        {/* ear / side module */}
        <mesh position={[0.36, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={bodyMaterial}>
          <cylinderGeometry args={[0.14, 0.14, 0.06, segments]} />
        </mesh>
        <mesh position={[0.395, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={accentMaterial}>
          <torusGeometry args={[0.1, 0.014, 8, segments]} />
        </mesh>

        {/* face plate */}
        <RoundedBox args={[0.5, 0.36, 0.04]} radius={0.14} smoothness={6} material={faceMaterial} position={[0, 0.01, 0.325]} />
        <mesh ref={faceMesh} position={[0, 0.01, 0.348]} material={eyeMaterial}>
          <planeGeometry args={[0.46, 0.29]} />
        </mesh>
      </group>
    </group>
  );
}
