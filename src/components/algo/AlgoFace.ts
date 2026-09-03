import * as THREE from "three";
import type { AlgoState } from "./AlgoStateMachine";

const CANVAS_W = 512;
const CANVAS_H = 320;
const VIOLET = "#5B5CFF";
const VIOLET_SOFT = "#9596FF";

export interface FaceRenderParams {
  time: number;
  /** 0 = closed, 1 = fully open */
  blink: number;
  /** subtle pupil-shift toward cursor, -1..1 */
  lookX: number;
  lookY: number;
}

function roundedBar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  color: string
) {
  const r = w / 2;
  ctx.beginPath();
  ctx.moveTo(cx - r, cy - h / 2 + r);
  ctx.arcTo(cx - r, cy - h / 2, cx + r, cy - h / 2, r);
  ctx.arcTo(cx + r, cy - h / 2, cx + r, cy + h / 2, r);
  ctx.arcTo(cx + r, cy + h / 2, cx - r, cy + h / 2, r);
  ctx.arcTo(cx - r, cy + h / 2, cx - r, cy - h / 2, r);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws one "eye" as a rounded bar whose height is modulated by the blink
 * value, so every expression shares one blink mechanism instead of each
 * shape re-implementing it.
 */
function eyeBar(ctx: CanvasRenderingContext2D, cx: number, cy: number, blink: number, baseH: number, w = 34) {
  const h = Math.max(6, baseH * blink);
  roundedBar(ctx, cx, cy, w, h, VIOLET);
}

function eyeArc(ctx: CanvasRenderingContext2D, cx: number, cy: number, blink: number, dir: 1 | -1) {
  ctx.save();
  ctx.strokeStyle = VIOLET;
  ctx.lineCap = "round";
  ctx.lineWidth = 16 * Math.max(0.15, blink);
  ctx.beginPath();
  ctx.arc(cx, cy + 14 * dir, 30, Math.PI * 1.15, Math.PI * 1.85, dir === -1);
  ctx.stroke();
  ctx.restore();
}

function eyeDash(ctx: CanvasRenderingContext2D, cx: number, cy: number, blink: number, phase: number) {
  const offset = Math.sin(phase) * 4;
  roundedBar(ctx, cx, cy + offset, 34, Math.max(6, 9 * blink), VIOLET);
}

function eyeCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, blink: number, r = 17) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, r, Math.max(3, r * blink), 0, 0, Math.PI * 2);
  ctx.fillStyle = VIOLET;
  ctx.fill();
}

function eyeRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, blink: number, phase: number) {
  ctx.save();
  ctx.strokeStyle = VIOLET;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 18, Math.max(4, 18 * blink), 0, 0, Math.PI * 2);
  ctx.stroke();
  const angle = phase * 2;
  ctx.beginPath();
  ctx.fillStyle = VIOLET_SOFT;
  ctx.arc(cx + Math.cos(angle) * 18, cy + Math.sin(angle) * 18 * blink, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function eyeArrow(ctx: CanvasRenderingContext2D, cx: number, cy: number, blink: number, dir: 1 | -1) {
  ctx.save();
  ctx.strokeStyle = VIOLET;
  ctx.lineWidth = 14 * Math.max(0.2, blink);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx + 12 * dir, cy - 22);
  ctx.lineTo(cx - 12 * dir, cy);
  ctx.lineTo(cx + 12 * dir, cy + 22);
  ctx.stroke();
  ctx.restore();
}

function eyeBracket(ctx: CanvasRenderingContext2D, cx: number, cy: number, blink: number, dir: 1 | -1) {
  ctx.save();
  ctx.strokeStyle = VIOLET;
  ctx.lineWidth = 10 * Math.max(0.2, blink);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + 14 * dir, cy - 20);
  ctx.lineTo(cx - 4 * dir, cy - 20);
  ctx.lineTo(cx - 4 * dir, cy + 20);
  ctx.lineTo(cx + 14 * dir, cy + 20);
  ctx.stroke();
  ctx.restore();
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  state: AlgoState,
  { time, blink, lookX, lookY }: FaceRenderParams
) {
  const cy = CANVAS_H / 2 + lookY * 6;
  const spread = 92;
  const leftX = CANVAS_W / 2 - spread + lookX * 8;
  const rightX = CANVAS_W / 2 + spread + lookX * 8;

  switch (state) {
    case "sleeping":
      roundedBar(ctx, leftX, cy, 30, 5, VIOLET_SOFT);
      roundedBar(ctx, rightX, cy, 30, 5, VIOLET_SOFT);
      return;
    case "happy":
    case "success":
      eyeArc(ctx, leftX, cy, blink, 1);
      eyeArc(ctx, rightX, cy, blink, 1);
      return;
    case "thinking":
      eyeDash(ctx, leftX, cy, blink, time * 1.4);
      eyeDash(ctx, rightX, cy, blink, time * 1.4 + Math.PI);
      return;
    case "focused":
      eyeCircle(ctx, leftX, cy, blink);
      eyeCircle(ctx, rightX, cy, blink);
      return;
    case "analyzing":
      eyeRing(ctx, leftX, cy, blink, time * 1.6);
      eyeRing(ctx, rightX, cy, blink, time * 1.6 + Math.PI);
      return;
    case "loading":
      eyeRing(ctx, leftX, cy, blink, time * 3.2);
      eyeRing(ctx, rightX, cy, blink, time * 3.2 + Math.PI / 2);
      return;
    case "building":
      eyeBracket(ctx, leftX, cy, blink, -1);
      eyeBracket(ctx, rightX, cy, blink, 1);
      return;
    case "curious":
      eyeBar(ctx, leftX, cy - 6, blink, 36);
      eyeBar(ctx, rightX, cy + 4, blink, 30);
      return;
    case "creative": {
      eyeBar(ctx, leftX, cy, blink, 34);
      eyeBar(ctx, rightX, cy, blink, 34);
      const angle = time * 1.8;
      ctx.beginPath();
      ctx.fillStyle = VIOLET_SOFT;
      ctx.arc(rightX + Math.cos(angle) * 26, cy + Math.sin(angle) * 26, 4, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    case "idle":
    default:
      eyeBar(ctx, leftX, cy, blink, 34);
      eyeBar(ctx, rightX, cy, blink, 34);
      return;
  }
}

/**
 * Owns ALGO's face as a lazily-updated CanvasTexture. The face reads as a
 * luminous white display because the underlying mesh material is white and
 * unlit; this texture only paints the transparent violet eye layer on top.
 */
export class AlgoFaceTexture {
  readonly canvas: HTMLCanvasElement;
  readonly texture: THREE.CanvasTexture;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("2D context unavailable for ALGO face texture");
    this.ctx = ctx;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.premultiplyAlpha = true;
  }

  render(state: AlgoState, params: FaceRenderParams) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    drawEyes(ctx, state, params);
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}
