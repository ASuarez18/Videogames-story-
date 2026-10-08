"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { ERA_RANGES } from "@/lib/scroll-config";

import sky from "@/public/images/era02/sky.png";
import mountains from "@/public/images/era02/mountains.png";
import midground from "@/public/images/era02/midground.png";
import ground from "@/public/images/era02/ground.png";
import foreground from "@/public/images/era02/foreground.png";

interface Era02LandscapeProps {
  scrollYProgress: MotionValue<number>;
}

interface LandscapeLayerProps {
  image: StaticImageData;
  className: string;
  zIndex: number;
  movement: number;
  scrollYProgress: MotionValue<number>;
}

function LandscapeLayer({
  image,
  className,
  zIndex,
  movement,
  scrollYProgress,
}: LandscapeLayerProps) {
  const [start, end] = ERA_RANGES.era02;
  const span = end - start;

  // Synchronize with the character's horizontal movement
  const movementStart = start + span * 0.5;
  const movementEnd = start + span * 0.78;

  const x = useTransform(
    scrollYProgress,
    [movementStart, movementEnd],
    [0, movement],
  );

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{
        x,
        zIndex,
      }}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        draggable={false}
        className="object-cover object-center [image-rendering:pixelated]"
      />
    </motion.div>
  );
}

export default function Era02Landscape({
  scrollYProgress,
}: Era02LandscapeProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#1a1328]"
    >
      {/* Sunset sky */}
      <LandscapeLayer
        image={sky}
        className="left-0 top-0 h-[53%] w-full"
        zIndex={0}
        movement={0}
        scrollYProgress={scrollYProgress}
      />

      {/* Distant mountains */}
      <LandscapeLayer
        image={mountains}
        className="-inset-x-16 bottom-[53%] h-[34%]"
        zIndex={1}
        movement={-12}
        scrollYProgress={scrollYProgress}
      />

      {/* Midground */}
      <LandscapeLayer
        image={midground}
        className="-inset-x-16 bottom-[49%] h-[25%]"
        zIndex={2}
        movement={-24}
        scrollYProgress={scrollYProgress}
      />

      {/* Ground */}
      <LandscapeLayer
        image={ground}
        className="-inset-x-16 bottom-[40%] h-[15%]"
        zIndex={3}
        movement={-36}
        scrollYProgress={scrollYProgress}
      />

      {/* Foreground */}
      <LandscapeLayer
        image={foreground}
        className="-inset-x-16 bottom-0 h-[20%]"
        zIndex={4}
        movement={-48}
        scrollYProgress={scrollYProgress}
      />
    </div>
  );
}
