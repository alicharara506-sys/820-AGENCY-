"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Navigation from "@/components/ui/Navigation";
import Opening from "@/components/sections/Opening";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import World from "@/components/sections/World";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

const AlgoStage = dynamic(() => import("@/components/algo/AlgoStage"), { ssr: false });

export default function Experience() {
  return (
    <SmoothScroll>
      <AlgoStage />
      <Cursor />
      <Opening />
      <Navigation />
      <main>
        <Hero />
        <About />
        <World />
        <Work />
        <Process />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
