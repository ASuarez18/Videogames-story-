"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Era03World from "@/components/scroll-story/eras/era03/Era03World";
import { ERA_RANGES } from "@/lib/scroll-config";

interface Era03PolygonsProps {
  scrollYProgress: MotionValue<number>;
}

export default function Era03Polygons({ scrollYProgress }: Era03PolygonsProps) {
  const [start, end] = ERA_RANGES.era03;
  const span = end - start;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + span * 0.15, end - span * 0.15, end],
    [0, 1, 1, 0],
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [0.525, 0.545, 0.605, 0.635],
    [0, 1, 1, 0],
  );
  const titleX = useTransform(scrollYProgress, [0.525, 0.555], [-22, 0]);

  const detailOpacity = useTransform(
    scrollYProgress,
    [0.625, 0.645, 0.695, 0.725],
    [0, 1, 1, 0],
  );
  const detailX = useTransform(scrollYProgress, [0.625, 0.655], [-18, 0]);

  return (
    <motion.section
      className="absolute inset-0 isolate overflow-hidden bg-era3-bg"
      style={{ opacity, pointerEvents: "none" }}
      aria-label="2001: The 3D Revolution"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Era03World scrollYProgress={scrollYProgress} />
      </div>

      {/* Editorial racing UI */}
      <div className="absolute inset-0 z-10 flex items-end pb-[15vh] pl-6 pr-6 sm:pb-[18vh] sm:pl-12 lg:items-center lg:pb-0 lg:pl-[6vw]">
        <div className="relative w-full -translate-y-[60vh] lg:-translate-y-[22vh] max-w-[21rem] sm:max-w-[25rem] lg:max-w-[27rem]">
          <div className="pointer-events-none absolute -inset-x-5 -inset-y-7 -z-10 bg-gradient-to-r from-[#151324]/85 via-[#151324]/60 to-transparent blur-xl" />

          <motion.div style={{ opacity: titleOpacity, x: titleX }}>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#e5a18e]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#e5a18e] sm:text-xs">
                2001 / 03
              </span>
            </div>

            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#f0dfd2]/80 sm:text-xs">
              The 3D Revolution
            </p>
            <h2 className="max-w-[19rem] text-[2.15rem] font-light uppercase leading-[1.05] tracking-[-0.045em] text-[#fff2e8] sm:max-w-[24rem] sm:text-[3.1rem] lg:text-[3.45rem]">
              Beyond the
              <span className="block font-semibold italic text-[#f0a28d]">
                Flat Screen.
              </span>
            </h2>
            <div className="mt-5 h-px w-20 bg-[#e5a18e]/70" />
          </motion.div>

          <motion.div
            className="absolute left-0 top-0 w-full"
            style={{ opacity: detailOpacity, x: detailX }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#e5a18e]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#e5a18e] sm:text-xs">
                2001 / 03
              </span>
            </div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#f0dfd2]/80 sm:text-xs">
              A New Dimension
            </p>
            <p className="max-w-[24rem] text-sm font-normal leading-[1.75] tracking-[0.01em] text-[#fff2e8] sm:text-base">
              Polygons reshaped gaming. Roads stretched toward the horizon,
              worlds gained depth, and players experienced an entirely new
              sense of movement and speed.
            </p>
            <div className="mt-5 h-px w-20 bg-[#e5a18e]/70" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
