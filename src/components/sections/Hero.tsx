"use client";

import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { useSectionAlgo } from "@/components/algo/useSectionAlgo";
import { ALGO_DOCKS, ALGO_DOCKS_MOBILE } from "@/lib/algoDocks";

export default function Hero() {
  const ref = useSectionAlgo({ dock: ALGO_DOCKS.hero, mobileDock: ALGO_DOCKS_MOBILE.hero, state: "idle" });

  return (
    <section
      id="hero"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 md:px-10"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <Reveal>
          <p className="label mb-8 text-muted">BRAND × DIGITAL × TECHNOLOGY × AI × ANALYTICS</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="font-display text-display-xl font-medium tracking-tight text-balance max-w-4xl">
            We build the
            <br />
            <span className="text-violet">algorithm</span>
            <br />
            behind growth.
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-10 max-w-md text-lg text-muted">
            820 is a creative technology agency building brands, digital experiences and
            intelligent business systems — where creativity, data and AI compound.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a href="#contact">
              <Button variant="primary">Start a Project</Button>
            </a>
            <a href="#world">
              <Button variant="ghost">Explore 820</Button>
            </a>
          </div>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto hidden w-full max-w-[1440px] items-center justify-between px-6 md:flex md:px-10">
        <span className="label text-muted">Creative Technology Agency</span>
        <span className="label text-muted">Beirut — Lebanon</span>
      </div>
    </section>
  );
}
