"use client";

import { useRef } from "react";
import { MotionValue, useScroll } from "motion/react";
import ProgressIndicator from "./ProgressIndicator";
import ScrollDebugOverlay from "./ScrollDebugOverlay";
import { SCROLL_STORY_HEIGHT_VH } from "@/lib/scroll-config";

interface ScrollStoryContainerProps {
  children: (scrollYProgress: MotionValue<number>) => React.ReactNode;
  debug?: boolean;
}

export default function ScrollStoryContainer({
  children,
  debug = false,
}: ScrollStoryContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${SCROLL_STORY_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {children(scrollYProgress)}

        <ProgressIndicator scrollYProgress={scrollYProgress} />

        {debug && <ScrollDebugOverlay scrollYProgress={scrollYProgress} />}
      </div>
    </div>
  );
}