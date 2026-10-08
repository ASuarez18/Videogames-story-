
"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { EraProps } from "./types";
import { ERA_RANGES } from "@/lib/scroll-config";
import Era02Landscape from "@/components/scroll-story/eras/era02/Era02Landscape";

/**
 * 0  = transparent
 * 1  = outline
 * 2  = hair shadow
 * 3  = hair midtone
 * 4  = hair highlight
 * 5  = skin shadow
 * 6  = skin
 * 7  = skin highlight
 * 8  = armor shadow
 * 9  = armor red
 * 10 = armor highlight
 * 11 = leather
 * 12 = leather highlight
 * 13 = metal shadow
 * 14 = metal
 * 15 = metal highlight
 */
const SPRITE_MATRIX: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 3, 4, 4, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 4, 4, 4, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 4, 4, 3, 3, 3, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 3, 3, 5, 5, 5, 5, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 3, 5, 6, 7, 6, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 5, 6, 1, 6, 6, 1, 5, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 5, 6, 6, 6, 7, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 5, 6, 6, 5, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 8, 8, 9, 10, 9, 8, 8, 0, 0, 0, 14, 0, 0, 0, 0],
  [0, 0, 0, 0, 8, 9, 9, 9, 10, 9, 9, 8, 8, 0, 13, 15, 0, 0, 0, 0],
  [0, 0, 0, 5, 6, 8, 9, 9, 10, 9, 9, 8, 6, 5, 13, 14, 0, 0, 0, 0],
  [0, 0, 5, 6, 7, 8, 9, 9, 9, 9, 9, 8, 7, 6, 13, 14, 0, 0, 0, 0],
  [0, 0, 5, 6, 0, 8, 8, 9, 9, 9, 8, 8, 0, 5, 13, 14, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 11, 11, 11, 12, 11, 11, 11, 0, 1, 13, 14, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 11, 9, 9, 9, 9, 9, 11, 0, 0, 13, 14, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 11, 9, 9, 9, 9, 9, 11, 0, 0, 13, 14, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 11, 11, 1, 1, 11, 11, 0, 0, 0, 13, 14, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 0, 1, 11, 0, 1, 11, 0, 0, 0, 13, 14, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 11, 12, 0, 11, 12, 1, 0, 0, 13, 14, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 11, 12, 12, 0, 11, 12, 12, 1, 0, 13, 14, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 11, 11, 1, 0, 1, 11, 11, 1, 0, 13, 14, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 13, 15, 0, 0, 0, 0],
];

const PIXEL_COLORS: Record<number, string> = {
  1: "#21192b",

  // Hair
  2: "#5b2918",
  3: "#a64b24",
  4: "#ef8b3a",

  // Skin
  5: "#b95f46",
  6: "#ef9a72",
  7: "#ffc49a",

  // Armor / tunic
  8: "#731f35",
  9: "#c93645",
  10: "#ff6670",

  // Leather
  11: "#49303c",
  12: "#805344",

  // Sword
  13: "#73798f",
  14: "#b9c4d6",
  15: "#f4f7ff",
};

type PixelLayer = "structure" | "color" | "highlight";

const STRUCTURE_COLORS = new Set([1, 2, 5, 8, 11, 13]);
const MAIN_COLORS = new Set([3, 6, 9, 12, 14]);

function getPixelLayer(value: number): PixelLayer {
  if (STRUCTURE_COLORS.has(value)) {
    return "structure";
  }

  if (MAIN_COLORS.has(value)) {
    return "color";
  }

  return "highlight";
}

interface SpritePixelProps {
  value: number;
  scrollYProgress: MotionValue<number>;
  structureStart: number;
  colorStart: number;
  highlightStart: number;
  structureEnd: number;
  colorEnd: number;
  highlightEnd: number;
}

function SpritePixel({
  value,
  scrollYProgress,
  structureStart,
  colorStart,
  highlightStart,
  structureEnd,
  colorEnd,
  highlightEnd,
}: SpritePixelProps) {
  const layer = getPixelLayer(value);

  const [layerStart, layerEnd] =
    layer === "structure"
      ? [structureStart, structureEnd]
      : layer === "color"
        ? [colorStart, colorEnd]
        : [highlightStart, highlightEnd];

  const opacity = useTransform(
    scrollYProgress,
    [layerStart, layerEnd],
    [0, 1],
  );

  return (
    <motion.div
      aria-hidden
      className="h-[5px] w-[5px] sm:h-[6px] sm:w-[6px]"
      style={{
        opacity,
        backgroundColor: PIXEL_COLORS[value],
      }}
    />
  );
}

export default function Era02Bit({ scrollYProgress }: EraProps) {
  const [start, end] = ERA_RANGES.era02;
  const span = end - start;

  // Sprite construction
  const structureStart = start + span * 0.05;
  const structureEnd = start + span * 0.2;

  const colorStart = start + span * 0.2;
  const colorEnd = start + span * 0.35;

  const highlightStart = start + span * 0.35;
  const highlightEnd = start + span * 0.5;

  // Scene transition
  const sceneFade = span * 0.05;

  const sceneOpacity = useTransform(
    scrollYProgress,
    [start, start + sceneFade, end - sceneFade, end],
    [0, 1, 1, 0],
  );

  // Horizontal character movement
  const movementStart = highlightEnd;
  const movementEnd = start + span * 0.78;

  const spriteX = useTransform(
    scrollYProgress,
    [movementStart, movementEnd],
    [-20, 28],
  );

  // Narrative animation
  const yearOpacity = useTransform(
    scrollYProgress,
    [start, start + span * 0.15],
    [0, 1],
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [start + span * 0.45, start + span * 0.6],
    [0, 1],
  );

  const titleY = useTransform(
    scrollYProgress,
    [start + span * 0.45, start + span * 0.6],
    [12, 0],
  );

  const descriptionOpacity = useTransform(
    scrollYProgress,
    [start + span * 0.6, start + span * 0.78],
    [0, 1],
  );

  const descriptionY = useTransform(
    scrollYProgress,
    [start + span * 0.6, start + span * 0.78],
    [12, 0],
  );

  return (
    <motion.section
      style={{ opacity: sceneOpacity }}
      className="absolute inset-0 isolate overflow-hidden bg-era2-bg"
    >
      {/* Landscape */}
      <Era02Landscape scrollYProgress={scrollYProgress} />

      {/* Character: independently positioned above the ground */}
      <div className="absolute bottom-[50%] left-1/2 z-10 -translate-x-1/2">
        <motion.div
          aria-label="Original 16-bit JRPG-inspired adventurer"
          role="img"
          className="grid"
          style={{
            x: spriteX,
            gridTemplateColumns: `repeat(${SPRITE_MATRIX[0].length}, minmax(0, 1fr))`,
          }}
        >
          {SPRITE_MATRIX.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;

              if (value === 0) {
                return (
                  <div
                    key={key}
                    aria-hidden
                    className="h-[5px] w-[5px] sm:h-[6px] sm:w-[6px]"
                  />
                );
              }

              return (
                <SpritePixel
                  key={key}
                  value={value}
                  scrollYProgress={scrollYProgress}
                  structureStart={structureStart}
                  structureEnd={structureEnd}
                  colorStart={colorStart}
                  colorEnd={colorEnd}
                  highlightStart={highlightStart}
                  highlightEnd={highlightEnd}
                />
              );
            }),
          )}
        </motion.div>
      </div>

      {/* Narrative */}
      <div className="absolute inset-x-0 bottom-[17%] z-20 flex flex-col items-center text-center">
        <motion.span
          style={{
            opacity: yearOpacity,
            color: "#f1b82d",
          }}
          className="mb-1 font-pixel text-sm tracking-[0.3em] sm:text-base"
        >
          1994
        </motion.span>

        <div className="flex flex-col items-center text-center">
          <motion.h2
            style={{
              opacity: titleOpacity,
              y: titleY,
            }}
            className="font-pixel text-lg text-era2-primary sm:text-2xl"
          >
            The 16-Bit Era
          </motion.h2>

          <motion.p
            style={{
              opacity: descriptionOpacity,
              y: descriptionY,
            }}
            className="mt-5 max-w-sm font-pixel text-[10px] leading-relaxed text-era2-text sm:text-xs"
          >
            Color changed everything. Worlds grew richer, characters became
            expressive, and pixels started telling bigger stories.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
