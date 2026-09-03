"use client";

import Reveal from "@/components/motion/Reveal";
import { useSectionAlgo } from "@/components/algo/useSectionAlgo";
import { ALGO_DOCKS, ALGO_DOCKS_MOBILE } from "@/lib/algoDocks";

export default function About() {
  const ref = useSectionAlgo({ dock: ALGO_DOCKS.about, mobileDock: ALGO_DOCKS_MOBILE.about, state: "curious" });

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative overflow-hidden bg-white px-6 py-30 md:px-10"
    >
      <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <p className="label text-violet">About 820</p>
          </Reveal>
        </div>
        <div className="md:col-span-8">
          <Reveal>
            <p className="font-display text-display-md font-medium tracking-tight text-balance max-w-3xl">
              820 combines creativity, technology, artificial intelligence and data to build
              modern brands, digital experiences and intelligent business systems.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-2xl text-lg text-muted">
              The name traces back to the origins of the algorithm itself — the idea that a clear,
              repeatable system beats guesswork, every time. We build that discipline into brand,
              product and growth work, so creative decisions and data-driven ones pull in the
              same direction.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-14 grid grid-cols-2 gap-8 max-w-xl sm:grid-cols-4">
              {["Modern", "Intelligent", "Experimental", "Human"].map((word) => (
                <div key={word} className="label text-black/60">
                  {word}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
