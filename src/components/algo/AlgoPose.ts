import type { AlgoState } from "./AlgoStateMachine";

export interface AlgoPose {
  headTilt: [number, number, number];
  lean: number;
  armRaiseL: number;
  armRaiseR: number;
  bounce: number;
  bobSpeed: number;
  energy: number;
}

const base: AlgoPose = {
  headTilt: [0, 0, 0],
  lean: 0,
  armRaiseL: 0,
  armRaiseR: 0,
  bounce: 0,
  bobSpeed: 1,
  energy: 0.5,
};

export const ALGO_POSES: Record<AlgoState, AlgoPose> = {
  idle: { ...base },
  curious: { ...base, headTilt: [0.05, 0, 0.16], lean: 0.03, bobSpeed: 1.1, energy: 0.6 },
  happy: { ...base, headTilt: [-0.04, 0, 0], bounce: 0.12, bobSpeed: 1.4, energy: 0.9 },
  thinking: { ...base, headTilt: [0.1, 0.12, -0.08], lean: -0.02, bobSpeed: 0.7, energy: 0.35 },
  focused: { ...base, headTilt: [0.02, 0, 0], lean: 0.05, bobSpeed: 0.5, energy: 0.4 },
  creative: { ...base, headTilt: [-0.02, -0.08, 0.05], armRaiseL: 0.35, bobSpeed: 1.2, energy: 0.75 },
  analyzing: { ...base, headTilt: [0.06, 0, 0], lean: 0.04, bobSpeed: 0.8, energy: 0.5 },
  building: { ...base, headTilt: [0.08, 0, 0], armRaiseL: 0.2, armRaiseR: 0.2, lean: 0.06, bobSpeed: 1, energy: 0.65 },
  loading: { ...base, headTilt: [0, 0, 0], bobSpeed: 1.6, energy: 0.55 },
  success: { ...base, headTilt: [-0.08, 0, 0], armRaiseL: 0.9, armRaiseR: 0.9, bounce: 0.22, bobSpeed: 2, energy: 1 },
  sleeping: { ...base, headTilt: [0.28, 0, 0.04], lean: 0, bobSpeed: 0.25, energy: 0.08 },
};
