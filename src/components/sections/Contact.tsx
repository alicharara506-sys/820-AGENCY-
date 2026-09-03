"use client";

import { useSectionAlgo } from "@/components/algo/useSectionAlgo";
import { useAlgoStore } from "@/components/algo/AlgoStateMachine";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { ALGO_DOCKS, ALGO_DOCKS_MOBILE } from "@/lib/algoDocks";

export default function Contact() {
  const ref = useSectionAlgo({ dock: ALGO_DOCKS.contact, mobileDock: ALGO_DOCKS_MOBILE.contact, state: "idle" });

  function onClick() {
    useAlgoStore.getState().setState("success");
    window.setTimeout(() => useAlgoStore.getState().setState("idle"), 2200);
  }

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      onMouseEnter={() => useAlgoStore.getState().setState("curious")}
      onMouseLeave={() => useAlgoStore.getState().setState("idle")}
      className="relative bg-white px-6 py-30 md:px-10"
    >
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <p className="label text-violet">Start a Project</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-3xl font-display text-display-lg font-medium tracking-tight text-balance">
            Got a problem worth solving?
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <h3 className="mt-2 max-w-3xl font-display text-display-lg font-medium tracking-tight text-balance text-violet">
            Let&apos;s build the algorithm.
          </h3>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <a href="mailto:hello@820agency.com?subject=Project%20Inquiry" onClick={onClick}>
              <Button variant="primary">Start a Project</Button>
            </a>
            <a
              href="mailto:hello@820agency.com"
              data-cursor="interactive"
              className="label text-black/60 transition-colors hover:text-violet"
            >
              hello@820agency.com
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
