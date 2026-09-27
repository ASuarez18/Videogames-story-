"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { ERAS, ERA_RANGES } from "@/lib/scroll-config";

interface ProgressIndicatorProps {
  scrollYProgress: MotionValue<number>;
}

export default function ProgressIndicator({
  scrollYProgress,
}: ProgressIndicatorProps) {
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-4">
      {ERAS.map((era) => (
        <EraDot key={era.key} era={era} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

function EraDot({
  era,
  scrollYProgress,
}: {
  era: (typeof ERAS)[number];
  scrollYProgress: MotionValue<number>;
}) {
  const [start, end] = ERA_RANGES[era.key];
  const mid = (start + end) / 2;

  const scale = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0.6, 1.4, 0.6]
  );
  const opacity = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0.3, 1, 0.3]
  );

  return (
    <motion.div
      className="h-3 w-3 rounded-full bg-white"
      style={{ scale, opacity }}
      title={`${era.year} — ${era.title}`}
    />
  );
}