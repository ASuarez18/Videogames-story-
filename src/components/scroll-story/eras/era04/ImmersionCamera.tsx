"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";

interface ImmersionCameraProps {
  scrollYProgress: MotionValue<number>;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const lookTarget = new THREE.Vector3();

/** Scroll-controlled camera: approach the portal, cross it, then pause for Phase 4. */
export default function ImmersionCamera({
  scrollYProgress,
}: ImmersionCameraProps) {
  const { camera } = useThree();

  useFrame(() => {
    const progress = scrollYProgress.get();
    const approach = smoothstep(clamp01((progress - 0.81) / 0.065));
    const crossing = smoothstep(clamp01((progress - 0.875) / 0.055));

    // Portal center is at x=0.6. Move toward it as the camera advances.
    camera.position.set(
      THREE.MathUtils.lerp(0, 0.6, approach),
      0,
      THREE.MathUtils.lerp(10, 3.1, approach) - crossing * 6,
    );
    // Keep the view facing forward even after crossing the ring plane.
    lookTarget.set(camera.position.x, 0, camera.position.z - 10);
    camera.lookAt(lookTarget);
    camera.updateProjectionMatrix();
  });

  return null;
}
