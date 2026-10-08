"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";

interface PortalRingsProps {
  scrollYProgress: MotionValue<number>;
}

const RINGS = [
  { radius: 2.7, tube: 0.035, z: -0.65, tilt: 0.22, color: "#5de5e7" },
  { radius: 2.24, tube: 0.028, z: -0.25, tilt: -0.19, color: "#9b7ae8" },
  { radius: 1.79, tube: 0.033, z: 0.12, tilt: 0.17, color: "#5de5e7" },
  { radius: 1.36, tube: 0.025, z: 0.5, tilt: -0.25, color: "#9b7ae8" },
  { radius: 0.94, tube: 0.025, z: 0.82, tilt: 0.15, color: "#a9f4f3" },
] as const;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Scroll-driven portal assembly (0.75–0.81), reversible when scrolling up. */
export default function PortalRings({ scrollYProgress }: PortalRingsProps) {
  const portal = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    const progress = scrollYProgress.get();
    const assembly = easeOutCubic(clamp01((progress - 0.75) / 0.06));

    // Lock the rings into a forward-facing, unobstructed corridor before traversal.
    // Only rotation around Z remains: it cannot obstruct a circular opening.
    const alignment = easeOutCubic(clamp01((progress - 0.815) / 0.045));
    const ambient = 1 - alignment;
    if (portal.current) {
      portal.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.18) * 0.12 * ambient;
    }
    if (inner.current) {
      inner.current.rotation.z += delta * 0.095;
      inner.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.22) * 0.075 * ambient;
    }

    ringRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const ring = RINGS[index];
      // Start scattered in depth and offset from the portal's center.
      const direction = index % 2 === 0 ? 1 : -1;
      mesh.position.set(
        direction * (1 - assembly) * (1.6 + index * 0.2),
        (1 - assembly) * (index - 2) * 0.7,
        ring.z + (1 - assembly) * (index - 2) * 2.2,
      );
      mesh.rotation.set(
        ring.tilt * (1 - alignment) + (1 - assembly) * 0.9,
        (index % 2 ? -0.14 : 0.14) * (1 - alignment) + (1 - assembly) * 0.65,
        (1 - assembly) * direction * 1.2,
      );
      const scale = 0.2 + assembly * 0.8;
      mesh.scale.setScalar(scale);
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.opacity = assembly;
    });
  });

  return (
    <group ref={portal}>
      <group ref={inner}>
        {RINGS.map((ring, index) => (
          <mesh
            key={index}
            ref={(mesh) => {
              ringRefs.current[index] = mesh;
            }}
            position={[0, 0, ring.z]}
            rotation={[ring.tilt, index % 2 ? -0.14 : 0.14, 0]}
          >
            <torusGeometry args={[ring.radius, ring.tube, 12, 128]} />
            <meshStandardMaterial
              color={ring.color}
              emissive={ring.color}
              emissiveIntensity={2.2}
              metalness={0.25}
              roughness={0.3}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      <pointLight
        position={[0, 0, 1.5]}
        color="#5de5e7"
        intensity={12}
        distance={8}
        decay={2}
      />
      <pointLight
        position={[2, 1, -1]}
        color="#9b7ae8"
        intensity={9}
        distance={8}
        decay={2}
      />
    </group>
  );
}
