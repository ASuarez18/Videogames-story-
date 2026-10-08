"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Era03World from "./Era03World";
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

  return (
    <motion.section
      className="absolute inset-0 isolate overflow-hidden bg-era3-bg"
      style={{ opacity, pointerEvents: "none" }}
    >
      <div className="absolute inset-0">
        <Era03World scrollYProgress={scrollYProgress} />
      </div>
    </motion.section>
  );
}
