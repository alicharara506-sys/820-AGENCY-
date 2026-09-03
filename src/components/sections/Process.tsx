"use client";

import Reveal from "@/components/motion/Reveal";
import { useSectionAlgo } from "@/components/algo/useSectionAlgo";
import type { AlgoState } from "@/components/algo/AlgoStateMachine";
import { PROCESS_STEPS } from "@/lib/content";
import { ALGO_DOCKS_MOBILE } from "@/lib/algoDocks";

const STEP_STATES: AlgoState[] = [
  "curious",
  "thinking",
  "creative",
  "building",
  "loading",
  "analyzing",
  "happy",
];

function ProcessStepRow({ index }: { index: number }) {
  const step = PROCESS_STEPS[index]!;
  const zigzag = index % 2 === 0 ? 0.22 : 0.78;
  const ref = useSectionAlgo({
    dock: { xVW: zigzag, yVH: 0.42, scale: 0.7, rotY: index % 2 === 0 ? 0.3 : -0.3 },
    mobileDock: { ...ALGO_DOCKS_MOBILE.process, rotY: index % 2 === 0 ? 0.25 : -0.25 },
    state: STEP_STATES[index % STEP_STATES.length]!,
    threshold: 0.55,
  });

  return (
    <li ref={ref as React.RefObject<HTMLLIElement>} className="border-b border-white/10 py-10 md:py-14">
      <Reveal className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
        <span className="label text-violet-soft">{step.index}</span>
        <span className="font-display text-3xl font-medium tracking-tight text-white md:w-64 md:text-4xl">
          {step.name}
        </span>
        <div className="max-w-lg">
          <p className="label text-violet-soft/80">{step.algoAction}</p>
          <p className="mt-2 text-white/60">{step.description}</p>
        </div>
      </Reveal>
    </li>
  );
}

export default function Process() {
  return (
    <section id="process" className="relative bg-black px-6 py-30 md:px-10">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <p className="label text-violet-soft">How 820 Works</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-display text-display-md font-medium tracking-tight text-white text-balance">
            Discover to grow — guided, not templated.
          </h2>
        </Reveal>

        <ul className="mt-16 border-t border-white/10">
          {PROCESS_STEPS.map((step, index) => (
            <ProcessStepRow key={step.id} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
