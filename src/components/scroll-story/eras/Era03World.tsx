"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import Era03Car from "./Era03Car";

const ROAD_WIDTH = 10;
const ROAD_LENGTH = 180;
const BUILDING_COLORS = ["#28334e", "#34405b", "#42465f", "#52465c", "#303d58"];

function Road() {
  return (
    <group>
      {/* Asphalt */}
      <mesh position={[0, -0.05, -65]} receiveShadow>
        <boxGeometry args={[ROAD_WIDTH, 0.1, ROAD_LENGTH]} />
        <meshStandardMaterial color="#292d3c" roughness={1} flatShading />
      </mesh>

      {/* Road shoulders */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 5.25, 0.015, -65]}>
          <boxGeometry args={[0.5, 0.06, ROAD_LENGTH]} />
          <meshStandardMaterial color="#626176" />
        </mesh>
      ))}

      {/* Lane markings */}
      {Array.from({ length: 30 }, (_, index) => (
        <group key={index}>
          {[-1.65, 1.65].map((x) => (
            <mesh key={x} position={[x, 0.015, 15 - index * 6]}>
              <boxGeometry args={[0.12, 0.015, 3]} />
              <meshBasicMaterial color="#e9d9bd" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Outer boundary lines */}
      {[-4.65, 4.65].map((x) => (
        <mesh key={x} position={[x, 0.02, -65]}>
          <boxGeometry args={[0.12, 0.015, ROAD_LENGTH]} />
          <meshBasicMaterial color="#e7bd83" />
        </mesh>
      ))}
    </group>
  );
}

function RoadsideBarriers() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 6, 0.45, -65]}>
            <boxGeometry args={[0.35, 0.75, ROAD_LENGTH]} />
            <meshStandardMaterial color="#88849a" flatShading />
          </mesh>

          <mesh position={[side * 6, 0.85, -65]}>
            <boxGeometry args={[0.42, 0.12, ROAD_LENGTH]} />
            <meshStandardMaterial color="#c7a4a1" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

interface BuildingData {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
}

function Buildings() {
  const buildings = useMemo<BuildingData[]>(() => {
    const result: BuildingData[] = [];

    for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
      const side = sideIndex === 0 ? -1 : 1;

      for (let index = 0; index < 22; index++) {
        const seed = index * 17 + sideIndex * 31;

        const width = 3 + (seed % 5);
        const height = 5 + ((seed * 7) % 17);
        const depth = 3 + ((seed * 3) % 5);

        result.push({
          x: side * (12 + ((seed * 3) % 13)),
          z: 8 - index * 8,
          width,
          height,
          depth,
          color: BUILDING_COLORS[(index + sideIndex) % BUILDING_COLORS.length],
        });
      }
    }

    return result;
  }, []);

  return (
    <group>
      {buildings.map((building, index) => (
        <mesh
          key={index}
          position={[building.x, building.height / 2 - 0.1, building.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[building.width, building.height, building.depth]}
          />
          <meshStandardMaterial
            color={building.color}
            flatShading
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Streetlights() {
  return (
    <group>
      {Array.from({ length: 14 }, (_, index) => {
        const z = 6 - index * 12;

        return [-1, 1].map((side) => (
          <group key={`${index}-${side}`} position={[side * 7.2, 0, z]}>
            <mesh position={[0, 2.8, 0]}>
              <cylinderGeometry args={[0.06, 0.09, 5.6, 5]} />
              <meshStandardMaterial color="#65677b" />
            </mesh>

            <mesh position={[-side * 0.65, 5.55, 0]}>
              <boxGeometry args={[1.4, 0.09, 0.09]} />
              <meshStandardMaterial color="#65677b" />
            </mesh>

            <mesh position={[-side * 1.25, 5.47, 0]}>
              <boxGeometry args={[0.55, 0.08, 0.4]} />
              <meshBasicMaterial color="#ffcd91" />
            </mesh>
          </group>
        ));
      })}
    </group>
  );
}

function Ground() {
  return (
    <mesh position={[0, -0.22, -65]} receiveShadow>
      <boxGeometry args={[220, 0.25, 220]} />
      <meshStandardMaterial color="#38364d" flatShading roughness={1} />
    </mesh>
  );
}

function Sunset() {
  return (
    <mesh position={[-18, 15, -115]}>
      <sphereGeometry args={[8, 16, 12]} />
      <meshBasicMaterial color="#f3a36f" fog={false} />
    </mesh>
  );
}

function RacingCamera() {
  const { camera } = useThree();

  camera.position.set(0, 2.8, 12);
  camera.lookAt(0, 1.8, -55);
  camera.updateProjectionMatrix();

  return null;
}

interface Era03WorldProps {
  scrollYProgress: MotionValue<number>;
}

function Materialization({ scrollYProgress }: Era03WorldProps) {
  const group = useRef<THREE.Group>(null);
  const entries = useRef<
    {
      solid: THREE.Material;
      wire: THREE.MeshBasicMaterial;
    }[]
  >([]);

  useEffect(() => {
    const root = group.current;
    if (!root) return;
    const tracked: typeof entries.current = [];
    const overlays: THREE.Mesh[] = [];
    const originalMeshes: THREE.Mesh[] = [];
    root.traverse((object) => {
      if (object instanceof THREE.Mesh && !Array.isArray(object.material)) {
        originalMeshes.push(object);
      }
    });

    for (const object of originalMeshes) {
      const solid = object.material as THREE.Material;
      const wire = new THREE.MeshBasicMaterial({
        color: "#b9e5f2",
        wireframe: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        toneMapped: false,
      });
      const overlay = new THREE.Mesh(object.geometry, wire);
      overlay.renderOrder = 2;
      overlay.userData.wireOverlay = true;
      object.add(overlay);
      overlays.push(overlay);
      tracked.push({ solid, wire });
    }
    entries.current = tracked;
    return () => {
      overlays.forEach((overlay) => {
        overlay.parent?.remove(overlay);
        (overlay.material as THREE.Material).dispose();
      });
      entries.current = [];
    };
  }, []);

  useFrame(() => {
    const phase = THREE.MathUtils.clamp(
      (scrollYProgress.get() - 0.56) / 0.04,
      0,
      1,
    );

    /* eslint-disable react-hooks/immutability */
    for (const { solid, wire } of entries.current) {
      const transparent = phase < 1;

      if (solid.transparent !== transparent) {
        solid.transparent = transparent;
        solid.needsUpdate = true;
      }

      solid.opacity = phase;
      solid.depthWrite = phase >= 1;

      wire.opacity = 1 - phase;
      wire.visible = phase < 1;
    }
    /* eslint-enable react-hooks/immutability */
  });

  return (
    <group ref={group}>
      <RacingEnvironment />
    </group>
  );
}

function RacingEnvironment() {
  return (
    <>
      <color attach="background" args={["#75627e"]} />
      <fog attach="fog" args={["#75627e", 55, 170]} />

      <ambientLight intensity={1.8} color="#b8a5c6" />

      <directionalLight
        position={[-15, 25, -35]}
        intensity={2.2}
        color="#ffc38d"
      />

      <hemisphereLight args={["#f0b6a0", "#353348", 1.3]} />

      <Ground />
      <Road />
      <RoadsideBarriers />
      <Buildings />
      <Streetlights />
      <Sunset />
      <Era03Car />
    </>
  );
}

export default function Era03World({ scrollYProgress }: Era03WorldProps) {
  return (
    <Canvas
      camera={{
        position: [0, 4.5, 16],
        fov: 65,
        near: 0.1,
        far: 250,
      }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      dpr={[1, 1.5]}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <RacingCamera />
      <Materialization scrollYProgress={scrollYProgress} />
    </Canvas>
  );
}
