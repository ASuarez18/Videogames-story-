"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { EraProps } from "./types";
import { ERA_RANGES } from "@/lib/scroll-config";

// 11x8 pattern: generic pixel-art invader silhouette,
const PIXEL_MATRIX: number[][] = [
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
];

// Keep only active pixels and sort them diagonally so the invader
const ON_CELLS = PIXEL_MATRIX.flatMap((row, rowIndex) =>
  row
    .map((value, colIndex) => ({ value, rowIndex, colIndex }))
    .filter((cell) => cell.value === 1),
).sort((a, b) => a.rowIndex + a.colIndex - (b.rowIndex + b.colIndex));

// Maps each active pixel back to its animation order while allowing
const CELL_ORDER = new Map(
  ON_CELLS.map((cell, order) => [`${cell.rowIndex}-${cell.colIndex}`, order]),
);

const TOTAL_ON = ON_CELLS.length;

interface PixelCellProps {
  scrollYProgress: MotionValue<number>;
  drawStart: number;
  drawEnd: number;
  order: number;
}

function PixelCell({
  scrollYProgress,
  drawStart,
  drawEnd,
  order,
}: PixelCellProps) {
  const cellThreshold = drawStart + (order / TOTAL_ON) * (drawEnd - drawStart);

  const fadeWidth = (drawEnd - drawStart) / TOTAL_ON / 1.5;

  const opacity = useTransform(
    scrollYProgress,
    [cellThreshold - fadeWidth, cellThreshold],
    [0, 1],
  );

  const scale = useTransform(
    scrollYProgress,
    [cellThreshold - fadeWidth, cellThreshold],
    [0.3, 1],
  );

  return (
    <motion.div
      style={{ opacity, scale }}
      className="h-3 w-3 rounded-[1px] bg-era1-primary shadow-[0_0_6px_var(--color-era1-glow)] sm:h-4 sm:w-4"
    />
  );
}

export default function Era01Pixel({ scrollYProgress }: EraProps) {
  const [start, end] = ERA_RANGES.era01;
  const span = end - start;

  // Internal timing for Era 01:
  //  0% -  5% -> initial pause
  //  5% - 55% -> progressive pixel reveal
  // 55% - 80% -> hold completed scene
  // 80% -100% -> transition toward Era 02
  const drawStart = start + span * 0.05;
  const drawEnd = start + span * 0.55;
  const holdEnd = start + span * 0.8;

  // Fade the entire era in and out smoothly.
  const groupOpacity = useTransform(
    scrollYProgress,
    [start, drawStart, holdEnd, end],
    [0, 1, 1, 0],
  );

  // Slightly shrink the invader during the transition to Era 02,
  const groupScale = useTransform(scrollYProgress, [holdEnd, end], [1, 0.85]);

  // Text narrative appears after the invader appears 
  const textStart = drawEnd + span * 0.05;
  const textEnd = drawEnd + span * 0.15;

  const textOpacity = useTransform(
    scrollYProgress,
    [start, drawEnd, textStart, textEnd, holdEnd, end],
    [0, 0, 0, 1, 1, 0],
  );

  const textY = useTransform(
    scrollYProgress,
    [start, textStart, textEnd],
    [16, 16, 0],
  );

  return (
    <motion.div
      style={{ opacity: groupOpacity }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-10 bg-era1-bg"
    >
      {/* CRT scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(51,255,51,0.5) 0px, rgba(51,255,51,0.5) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Animated CRT signal noise */}
      <div
        aria-hidden
        className="crt-noise pointer-events-none absolute inset-0"
      />

      {/* Pixel-art invader */}
      <motion.div
        style={{ scale: groupScale }}
        className="relative z-20 grid grid-cols-11 gap-1 sm:gap-1.5"
      >
        {PIXEL_MATRIX.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;

            if (value === 0) {
              return (
                <div key={key} aria-hidden className="h-3 w-3 sm:h-4 sm:w-4" />
              );
            }

            return (
              <PixelCell
                key={key}
                scrollYProgress={scrollYProgress}
                drawStart={drawStart}
                drawEnd={drawEnd}
                order={CELL_ORDER.get(key) ?? 0}
              />
            );
          }),
        )}
      </motion.div>

      {/* Era narrative */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 px-5 lg:px-0 flex flex-col items-center text-center"
      >
        <span className="font-pixel text-xs text-era1-dim sm:text-sm">
          1985
        </span>

        <h2 className="font-pixel mt-3 text-lg text-era1-primary sm:text-2xl">
          The Birth of the Pixel
        </h2>

        <p className="font-pixel mt-4 max-w-xs text-[10px] leading-relaxed text-era1-text sm:text-xs">
          One matrix. Two states: on or off. This is where it all began.
        </p>
      </motion.div>
    </motion.div>
  );
}
