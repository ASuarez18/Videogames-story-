"use client";

import { motion, useMotionValueEvent, type MotionValue } from "motion/react";
import { useState } from "react";
import { ERAS, ERA_RANGES } from "@/lib/scroll-config";

interface ScrollDebugOverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function ScrollDebugOverlay({
  scrollYProgress,
}: ScrollDebugOverlayProps) {
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  const activeEra = ERAS.find((era) => {
    const [start, end] = ERA_RANGES[era.key];
    return progress >= start && progress < end;
  });

  return (
    <div className="pointer-events-none fixed left-4 top-4 z-50 rounded-md bg-black/80 p-3 font-mono text-xs text-lime-400 shadow-lg">
      <div>scrollYProgress: {progress.toFixed(4)}</div>
      <div>Active era: {activeEra?.title ?? "—"}</div>
      <div className="mt-1 h-2 w-48 overflow-hidden rounded bg-white/10">
        <motion.div
          className="h-full bg-lime-400"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}