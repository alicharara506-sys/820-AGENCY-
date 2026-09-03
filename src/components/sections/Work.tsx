"use client";

import Reveal from "@/components/motion/Reveal";
import { useSectionAlgo } from "@/components/algo/useSectionAlgo";
import { useAlgoStore } from "@/components/algo/AlgoStateMachine";
import { useAlgoDockStore } from "@/components/algo/AlgoDockStore";
import { ALGO_DOCKS, ALGO_DOCKS_MOBILE } from "@/lib/algoDocks";
import { PROJECTS } from "@/lib/content";

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #101014 0%, #1c1c26 55%, #5B5CFF 150%)",
  "linear-gradient(135deg, #f0f0f4 0%, #ffffff 60%, #d9d9ff 130%)",
  "linear-gradient(135deg, #101014 0%, #2e2fcc 80%)",
  "linear-gradient(135deg, #ffffff 0%, #f0f0f4 70%, #8c8dff 150%)",
];

export default function Work() {
  const ref = useSectionAlgo({
    dock: ALGO_DOCKS.work,
    mobileDock: ALGO_DOCKS_MOBILE.work,
    state: "idle",
    threshold: 0.25,
  });

  function focusCard(index: number) {
    useAlgoStore.getState().setState("focused");
    useAlgoDockStore.getState().setDock({
      xVW: index % 2 === 0 ? 0.46 : 0.54,
      yVH: 0.08,
      scale: 0.4,
      rotY: index % 2 === 0 ? 0.35 : -0.35,
    });
  }

  return (
    <section
      id="work"
      ref={ref as React.RefObject<HTMLElement>}
      onMouseLeave={() => useAlgoStore.getState().setState("idle")}
      className="relative bg-white px-6 py-30 md:px-10"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="label text-violet">Selected Work</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-display-md font-medium tracking-tight text-balance">
                Systems we&apos;ve built.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {PROJECTS.map((project, index) => {
            const dark = index % 2 === 0;
            return (
              <Reveal key={project.id} delay={index * 0.05} y={48}>
                <article
                  onMouseEnter={() => focusCard(index)}
                  className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl p-8 md:p-10"
                  style={{ background: CARD_GRADIENTS[index % CARD_GRADIENTS.length] }}
                >
                  <div
                    className={`label mb-4 ${dark ? "text-white/50" : "text-black/40"}`}
                  >
                    {project.discipline} · {project.year}
                  </div>
                  <h3
                    className={`font-display text-3xl font-medium tracking-tight transition-transform duration-500 group-hover:-translate-y-1 md:text-4xl ${
                      dark ? "text-white" : "text-black"
                    }`}
                  >
                    {project.name}
                  </h3>
                  <p className={`mt-2 text-sm ${dark ? "text-white/60" : "text-black/50"}`}>
                    {project.client}
                  </p>
                  <p
                    className={`mt-4 max-w-sm text-sm leading-relaxed ${
                      dark ? "text-white/70" : "text-black/60"
                    }`}
                  >
                    {project.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
