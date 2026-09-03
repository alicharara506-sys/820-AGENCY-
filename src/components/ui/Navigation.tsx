"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAlgoStore } from "@/components/algo/AlgoStateMachine";

const LINKS = [
  { href: "#world", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    useAlgoStore.getState().setState(open ? "curious" : "idle");
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-white/85 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#hero" data-cursor="interactive" className="font-display text-xl font-semibold tracking-tight">
          820
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                data-cursor="interactive"
                className="label text-black/70 transition-colors hover:text-violet"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            data-cursor="interactive"
            className="label hidden rounded-full border border-black/15 px-5 py-2.5 transition-colors duration-300 hover:border-violet hover:text-violet md:inline-flex"
          >
            Start a Project
          </a>
          <button
            data-cursor="interactive"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }}
              className="h-[1.5px] w-6 bg-black"
            />
            <motion.span animate={{ opacity: open ? 0 : 1 }} className="h-[1.5px] w-6 bg-black" />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }}
              className="h-[1.5px] w-6 bg-black"
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-white md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-6">
              {[...LINKS, { href: "#contact", label: "Start a Project" }].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-2xl"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
