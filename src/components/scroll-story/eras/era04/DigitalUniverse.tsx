"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";

interface DigitalUniverseProps {
  scrollYProgress: MotionValue<number>;
}

const COUNT = 1800;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

// Deterministic distribution: no random positions during renders.
function fract(n: number) {
  return n - Math.floor(n);
}

export default function DigitalUniverse({
  scrollYProgress,
}: DigitalUniverseProps) {
  const points = useRef<THREE.Points>(null);

  const { size } = useThree();
  const sphereScale = size.width < 640 ? 0.65 : 1;

  const { geometry, scattered, sphere } = useMemo(() => {
    const scattered = new Float32Array(COUNT * 3);
    const sphere = new Float32Array(COUNT * 3);
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const cyan = new THREE.Color("#5de5e7");
    const violet = new THREE.Color("#9b7ae8");
    const white = new THREE.Color("#f4f7ff");
    const color = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
      const u = (i + 0.5) / COUNT;
      const v = fract(i * 0.618033988749895);
      const y = 1 - 2 * u;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = v * Math.PI * 2;
      const radius = 2.3 + 0.18 * Math.sin(i * 0.71);
      const idx = i * 3;

      sphere[idx] = r * Math.cos(angle) * radius;
      sphere[idx + 1] = y * radius;
      sphere[idx + 2] = r * Math.sin(angle) * radius;

      // A deep star field contracts into a recognizable spherical silhouette.
      scattered[idx] = (fract(i * 0.754877666) - 0.5) * 19;
      scattered[idx + 1] = (fract(i * 0.569840296) - 0.5) * 12;
      scattered[idx + 2] = (fract(i * 0.438579021) - 0.5) * 11;
      positions[idx] = scattered[idx];
      positions[idx + 1] = scattered[idx + 1];
      positions[idx + 2] = scattered[idx + 2];

      color.copy(cyan).lerp(violet, fract(i * 0.413));
      if (i % 13 === 0) color.lerp(white, 0.75);
      colors[idx] = color.r;
      colors[idx + 1] = color.g;
      colors[idx + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry, scattered, sphere };
  }, []);

  useFrame((state, delta) => {
    const object = points.current;
    if (!object) return;

    const progress = scrollYProgress.get();
    const appear = smoothstep(clamp01((progress - 0.895) / 0.025));
    const formation = smoothstep(clamp01((progress - 0.915) / 0.045));
    const material = object.material as THREE.PointsMaterial;
    material.opacity = appear;
    object.visible = appear > 0.001;

    const attribute = geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const positions = attribute.array as Float32Array;
    for (let i = 0; i < positions.length; i++) {
      positions[i] = THREE.MathUtils.lerp(scattered[i], sphere[i], formation);
    }
    attribute.needsUpdate = true;

    object.rotation.y += delta * 0.065;
    object.rotation.x = Math.sin(state.clock.elapsedTime * 0.14) * 0.08;
  });

  return (
    <group position={[0.6, 0, -10]}>
      <group scale={sphereScale}>
        <points ref={points} geometry={geometry} frustumCulled={false}>
          <pointsMaterial
            size={0.11}
            sizeAttenuation
            vertexColors
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      </group>
    </group>
  );
}
