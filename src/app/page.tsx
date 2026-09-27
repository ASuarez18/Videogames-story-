"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import ScrollStoryContainer from "@/components/scroll-story/ScrollStoryContainer";
import { ERAS, ERA_RANGES, type EraKey } from "@/lib/scroll-config";

const PLACEHOLDER_STYLES: Record<EraKey, string> = {
  era01: "bg-era1-bg text-era1-primary",
  era02: "bg-era2-bg text-era2-primary",
  era03: "bg-era3-bg text-era3-primary",
  era04: "bg-era4-bg text-era4-primary",
};

interface EraPlaceholderProps {
  index: number;
  scrollYProgress: MotionValue<number>;
}

function EraPlaceholder({ index, scrollYProgress }: EraPlaceholderProps) {
  const era = ERAS[index];
  const [start, end] = ERA_RANGES[era.key];

  const span = end - start;
  const fade = span * 0.15;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ opacity }}
      className={`absolute inset-0 flex flex-col items-center justify-center ${PLACEHOLDER_STYLES[era.key]}`}
    >
      <span className="font-pixel text-sm opacity-60">ERA 0{index + 1}</span>
      <h2 className="mt-4 font-modern text-4xl font-bold">{era.year}</h2>
      <p className="mt-2 font-modern text-lg">{era.title}</p>
      <p className="mt-8 text-xs opacity-40">
        (placeholder content for {era.title})
      </p>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main>
      <section className="flex h-screen items-center justify-center bg-neutral-950 text-white">
        <h1 className="font-modern text-3xl">
          Scroll to start ↓
        </h1>
      </section>

      <ScrollStoryContainer debug>
        {(scrollYProgress) =>
          ERAS.map((_, index) => (
            <EraPlaceholder
              key={index}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))
        }
      </ScrollStoryContainer>

      <section className="flex h-screen items-center justify-center bg-neutral-950 text-white">
        <h1 className="font-modern text-3xl">Fin de la historia ✓</h1>
      </section>
    </main>
  );
}