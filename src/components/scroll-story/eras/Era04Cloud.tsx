"use client";

import {
  motion,
  type MotionValue,
  useMotionValueEvent,
} from "motion/react";
import { Canvas } from "@react-three/fiber";
import PortalRings from "./era04/PortalRings";
import ImmersionCamera from "./era04/ImmersionCamera";
import DigitalUniverse from "./era04/DigitalUniverse";
import { useState } from "react";
import Era04Narrative from "./era04/Era04Narrative";

interface Era04CloudProps {
  scrollYProgress: MotionValue<number>;
}

/** Phase 4: portal traversal reveals a scroll-assembled particle universe. */
export default function Era04Cloud({ scrollYProgress }: Era04CloudProps) {
  const [opacity, setOpacity] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextOpacity =
      progress <= 0.75 ? 0 : progress >= 0.785 ? 1 : (progress - 0.75) / 0.035;

    setOpacity(nextOpacity);
  });

  return (
    <motion.section
      aria-label="2026: Beyond the Screen"
      className="pointer-events-none absolute inset-0 z-50 isolate overflow-hidden bg-[#050816]"
      style={{ opacity }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 48, near: 0.1, far: 100 }}
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
        >
          <color attach="background" args={["#050816"]} />
          <ambientLight intensity={0.35} />
          <ImmersionCamera scrollYProgress={scrollYProgress} />
          <group position={[0.6, 0, 0]} scale={0.9}>
            <PortalRings scrollYProgress={scrollYProgress} />
          </group>
          <DigitalUniverse scrollYProgress={scrollYProgress} />
        </Canvas>
      </div>
      <Era04Narrative scrollYProgress={scrollYProgress} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,transparent_20%,rgba(5,8,22,0.65)_100%)]"
      />
    </motion.section>
  );
}
