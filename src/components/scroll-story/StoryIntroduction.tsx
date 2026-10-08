"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";

export default function StoryIntroduction() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    [1, 1, 0],
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 0.96],
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction to the evolution of gaming"
      className="relative h-svh bg-[#0a0a0a]"
    >
      <motion.div
        style={{ opacity, scale }}
        className="relative flex h-full flex-col justify-between overflow-hidden px-6 py-8 text-white sm:px-12 sm:py-10 lg:px-[7vw]"
      >
        {/* Neutral background grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff15 1px, transparent 1px), linear-gradient(90deg, #ffffff15 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 75%)",
          }}
        />

        {/* Ambient lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[65vw] max-h-[650px] w-[65vw] max-w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[100px]"
        />

        <header className="relative z-10 flex items-center justify-between gap-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-300 sm:tracking-[0.3em]">
            An Interactive History
          </span>

          <span className="text-[10px] tracking-[0.15em] text-neutral-500">
            1985 — TODAY
          </span>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 sm:text-xs"
          >
            Four eras. One evolution.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="text-[clamp(2.8rem,8vw,8rem)] font-bold uppercase leading-[0.98] tracking-[-0.065em]"
          >
            From Pixels
            <span className="block text-neutral-400">
              To Worlds.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 max-w-lg text-sm leading-7 text-neutral-400 sm:text-base"
          >
            A journey through the evolution of gaming,
            from simple pixels to immersive digital universes.
          </motion.p>
        </div>

        <footer className="relative z-10 flex items-end justify-between gap-4">
          {/* <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500">
            00 / 04 — The Story Begins
          </span> */}
          <div />

          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center gap-3 text-neutral-300"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              Scroll to Explore
            </span>

            <span aria-hidden="true" className="text-2xl">
              ↓
            </span>
          </motion.div>
        </footer>
      </motion.div>
    </section>
  );
}