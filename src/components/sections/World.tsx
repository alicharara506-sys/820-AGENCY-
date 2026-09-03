"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { useSectionAlgo } from "@/components/algo/useSectionAlgo";
import { useAlgoStore } from "@/components/algo/AlgoStateMachine";
import { useAlgoDockStore } from "@/components/algo/AlgoDockStore";
import { ALGO_DOCKS, ALGO_DOCKS_MOBILE } from "@/lib/algoDocks";
import { DISCIPLINES } from "@/lib/content";

export default function World() {
  const [activeId, setActiveId] = useState(DISCIPLINES[0]!.id);
  const ref = useSectionAlgo({ dock: ALGO_DOCKS.world, mobileDock: ALGO_DOCKS_MOBILE.world, state: "idle" });
  const active = DISCIPLINES.find((d) => d.id === activeId)!;

  function activate(id: string) {
    setActiveId(id);
    const discipline = DISCIPLINES.find((d) => d.id === id)!;
    useAlgoStore.getState().setState(discipline.algoState);
    useAlgoDockStore.getState().setDock(ALGO_DOCKS.world);
  }

  return (
    <section
      id="world"
      ref={ref as React.RefObject<HTMLElement>}
      onMouseLeave={() => useAlgoStore.getState().setState("idle")}
      className="relative bg-surface px-6 py-30 md:px-10"
    >
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <p className="label text-violet">The 820 World</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-display text-display-md font-medium tracking-tight max-w-2xl text-balance">
            Five disciplines. One system.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <ul className="border-t border-border">
              {DISCIPLINES.map((discipline) => (
                <li key={discipline.id} className="border-b border-border">
                  <button
                    data-cursor="interactive"
                    onMouseEnter={() => activate(discipline.id)}
                    onFocus={() => activate(discipline.id)}
                    onClick={() => activate(discipline.id)}
                    className={`flex w-full items-baseline justify-between gap-4 py-6 text-left transition-colors duration-300 ${
                      activeId === discipline.id ? "text-violet" : "text-black hover:text-violet/70"
                    }`}
                  >
                    <span className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                      {discipline.name}
                    </span>
                    <span className="label text-black/30">{discipline.index}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-7 md:pl-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="max-w-lg text-lg text-muted">{active.summary}</p>
                <ul className="mt-8 flex flex-wrap gap-3">
                  {active.services.map((service) => (
                    <li
                      key={service}
                      className="label rounded-full border border-border bg-white px-4 py-2.5 text-black/70"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
