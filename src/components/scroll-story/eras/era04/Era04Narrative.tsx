"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

interface Era04NarrativeProps {
  scrollYProgress: MotionValue<number>;
}

/** Narrative only. Does not modify the Three.js scene or Era 04 section opacity. */
export default function Era04Narrative({
  scrollYProgress,
}: Era04NarrativeProps) {
  const introductionOpacity = useTransform(
    scrollYProgress,
    [0.785, 0.8, 0.835, 0.855],
    [0, 1, 1, 0],
  );
  const introductionY = useTransform(scrollYProgress, [0.785, 0.8], [22, 0]);

  const thresholdOpacity = useTransform(
    scrollYProgress,
    [0.855, 0.87, 0.905, 0.93],
    [0, 1, 1, 0],
  );
  const thresholdY = useTransform(scrollYProgress, [0.855, 0.87], [22, 0]);

  const finaleOpacity = useTransform(scrollYProgress, [0.94, 0.97], [0, 1]);
  const finaleY = useTransform(scrollYProgress, [0.94, 0.97], [24, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 text-[#f4f7ff]">
      <motion.div
        style={{ opacity: introductionOpacity, y: introductionY }}
        className="absolute inset-x-6 top-[3%] mx-auto max-w-3xl text-center sm:top-[5%]"
      >
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#5de5e7] sm:text-xs">
          2026 / 04 — The Immersive Era
        </p>
        <h2 className="text-3xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Beyond{" "}
          <span className="font-semibold text-[#5de5e7]">the Screen.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#f4f7ff]/75 sm:text-base">
          What once lived behind glass now surrounds us.
        </p>
      </motion.div>

      <motion.div
        style={{ opacity: thresholdOpacity, y: thresholdY }}
        className="absolute inset-x-6 bottom-[13%] mx-auto max-w-3xl text-center sm:bottom-[16%]"
      >
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#9b7ae8] sm:text-xs">
          Crossing the Threshold
        </p>
        <h2 className="text-2xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          A World Without{" "}
          <span className="font-semibold text-[#9b7ae8]">Boundaries.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#f4f7ff]/75 sm:text-base">
          New dimensions of play emerge as the boundary between player and world
          dissolves.
        </p>
      </motion.div>

      <motion.div
        style={{ opacity: finaleOpacity, y: finaleY }}
        className="absolute inset-x-6 bottom-[5%] mx-auto max-w-4xl rounded-2xl bg-[#050816]/75 px-4 py-4 text-center backdrop-blur-sm sm:bottom-[7%] sm:px-8"
      >
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#5de5e7] sm:text-xs">
          Beyond the Screen
        </p>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          From Pixels to{" "}
          <span className="text-[#5de5e7]">Infinite Possibilities.</span>
        </h2>
      </motion.div>
    </div>
  );
}
