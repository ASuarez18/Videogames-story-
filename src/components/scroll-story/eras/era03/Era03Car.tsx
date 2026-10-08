"use client";

import { useMemo } from "react";
import * as THREE from "three";

const COLORS = {
  red: "#c92e3e",
  brightRed: "#e23c4b",
  darkRed: "#861c30",
  glass: "#182436",
  glassHighlight: "#34465b",
  black: "#171821",
  tire: "#101116",
  metal: "#777988",
  taillight: "#ff3447",
  reverseLight: "#e6d9cc",
};

interface WheelProps {
  x: number;
  z: number;
}

function Wheel({ x, z }: WheelProps) {
  const outerSide = x > 0 ? 1 : -1;

  return (
    <group position={[x, 0.42, z]}>
      {/* Wheel axle runs along the X-axis */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.3, 10]} />
        <meshStandardMaterial color={COLORS.tire} flatShading roughness={1} />
      </mesh>

      {/* Outer wheel rim */}
      <mesh position={[outerSide * 0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.025, 8]} />
        <meshStandardMaterial
          color={COLORS.metal}
          flatShading
          metalness={0.35}
          roughness={0.65}
        />
      </mesh>

      {/* Center hub */}
      <mesh position={[outerSide * 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.035, 8]} />
        <meshStandardMaterial color={COLORS.black} />
      </mesh>
    </group>
  );
}

interface TaperedBodyProps {
  bottomWidth: number;
  topWidth: number;
  bottomLength: number;
  topLength: number;
  height: number;
  color: string;
  position: [number, number, number];
}

function TaperedBody({
  bottomWidth,
  topWidth,
  bottomLength,
  topLength,
  height,
  color,
  position,
}: TaperedBodyProps) {
  const geometry = useMemo(() => {
    const bottomX = bottomWidth / 2;
    const topX = topWidth / 2;
    const bottomZ = bottomLength / 2;
    const topZ = topLength / 2;

    const vertices = new Float32Array([
      // Bottom
      -bottomX,
      0,
      -bottomZ,
      bottomX,
      0,
      -bottomZ,
      bottomX,
      0,
      bottomZ,
      -bottomX,
      0,
      bottomZ,

      // Top
      -topX,
      height,
      -topZ,
      topX,
      height,
      -topZ,
      topX,
      height,
      topZ,
      -topX,
      height,
      topZ,
    ]);

    const indices = [
      // Bottom
      0, 2, 1, 0, 3, 2,

      // Top
      4, 5, 6, 4, 6, 7,

      // Front (-Z)
      0, 1, 5, 0, 5, 4,

      // Rear (+Z)
      3, 7, 6, 3, 6, 2,

      // Left
      0, 4, 7, 0, 7, 3,

      // Right
      1, 2, 6, 1, 6, 5,
    ];

    const mesh = new THREE.BufferGeometry();

    mesh.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    mesh.setIndex(indices);
    mesh.computeVertexNormals();

    return mesh;
  }, [bottomWidth, topWidth, bottomLength, topLength, height]);

  return (
    <mesh geometry={geometry} position={position} castShadow>
      <meshStandardMaterial
        color={color}
        flatShading
        roughness={0.65}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CarChassis() {
  return (
    <group>
      {/* Main lower body */}
      <TaperedBody
        bottomWidth={2.05}
        topWidth={2.2}
        bottomLength={4.15}
        topLength={4.35}
        height={0.55}
        color={COLORS.red}
        position={[0, 0.35, 0]}
      />

      {/* Front hood: slopes toward the nose */}
      <TaperedBody
        bottomWidth={2.08}
        topWidth={1.92}
        bottomLength={1.85}
        topLength={1.55}
        height={0.18}
        color={COLORS.brightRed}
        position={[0, 0.87, -1.15]}
      />

      {/* Rear deck */}
      <TaperedBody
        bottomWidth={2.1}
        topWidth={1.95}
        bottomLength={1.25}
        topLength={1.2}
        height={0.16}
        color={COLORS.red}
        position={[0, 0.89, 1.52]}
      />

      {/* Front bumper */}
      <mesh position={[0, 0.48, -2.15]}>
        <boxGeometry args={[1.95, 0.22, 0.12]} />
        <meshStandardMaterial color={COLORS.darkRed} />
      </mesh>

      {/* Side skirts */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.07, 0.37, 0]}>
          <boxGeometry args={[0.09, 0.17, 3.25]} />
          <meshStandardMaterial color={COLORS.darkRed} />
        </mesh>
      ))}
    </group>
  );
}

function CarCabin() {
  return (
    <group>
      {/* Sloped glass cabin */}
      <TaperedBody
        bottomWidth={1.82}
        topWidth={1.42}
        bottomLength={2.2}
        topLength={1.25}
        height={0.65}
        color={COLORS.glass}
        position={[0, 0.98, 0.05]}
      />

      {/* Roof */}
      <mesh position={[0, 1.64, 0.05]}>
        <boxGeometry args={[1.43, 0.09, 1.27]} />
        <meshStandardMaterial color={COLORS.darkRed} flatShading />
      </mesh>

      {/* Rear window highlight */}
      <mesh position={[0, 1.29, 0.91]} rotation={[-0.6, 0, 0]}>
        <planeGeometry args={[1.32, 0.5]} />
        <meshStandardMaterial
          color={COLORS.glassHighlight}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Side mirrors */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.03, 1.08, -0.72]}>
          <boxGeometry args={[0.27, 0.13, 0.22]} />
          <meshStandardMaterial color={COLORS.darkRed} />
        </mesh>
      ))}
    </group>
  );
}

function RearDetails() {
  return (
    <group>
      {/* Rear bumper */}
      <mesh position={[0, 0.49, 2.18]}>
        <boxGeometry args={[2.02, 0.25, 0.12]} />
        <meshStandardMaterial color={COLORS.darkRed} />
      </mesh>

      {/* Taillights */}
      {[-0.72, 0.72].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.78, 2.19]}>
            <boxGeometry args={[0.58, 0.17, 0.05]} />
            <meshBasicMaterial color={COLORS.taillight} />
          </mesh>

          <mesh position={[x, 0.76, 2.225]}>
            <boxGeometry args={[0.16, 0.075, 0.015]} />
            <meshBasicMaterial color={COLORS.reverseLight} />
          </mesh>
        </group>
      ))}

      {/* License plate */}
      <mesh position={[0, 0.56, 2.25]}>
        <boxGeometry args={[0.42, 0.14, 0.025]} />
        <meshStandardMaterial color="#d8d5d2" />
      </mesh>

      {/* Exhaust pipes */}
      {[-0.65, 0.65].map((x) => (
        <mesh key={x} position={[x, 0.26, 2.23]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.2, 8]} />
          <meshStandardMaterial
            color={COLORS.metal}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Spoiler supports */}
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 1.2, 1.83]}>
          <boxGeometry args={[0.09, 0.4, 0.12]} />
          <meshStandardMaterial color={COLORS.black} />
        </mesh>
      ))}

      {/* Rear wing */}
      <mesh position={[0, 1.44, 1.83]} castShadow>
        <boxGeometry args={[2.3, 0.1, 0.42]} />
        <meshStandardMaterial color={COLORS.black} flatShading />
      </mesh>
    </group>
  );
}

export default function Era03Car() {
  return (
    <group position={[0, 0.04, 3]}>
      <CarChassis />
      <CarCabin />
      <RearDetails />

      <Wheel x={-1.1} z={-1.35} />
      <Wheel x={1.1} z={-1.35} />
      <Wheel x={-1.1} z={1.35} />
      <Wheel x={1.1} z={1.35} />

      {/* Contact shadow */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.7, 4.8]} />
        <meshBasicMaterial
          color="#08090e"
          transparent
          opacity={0.28}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
