"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export function BudsModel({ colorHex = "#111111" }: { colorHex?: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.35;
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.9) * 0.05;
  });

  return (
    <group ref={ref} scale={1.4}>
      <group position={[-0.35, 0.1, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={colorHex} roughness={0.4} metalness={0.35} />
        </mesh>
        <mesh position={[0, -0.16, 0.02]}>
          <cylinderGeometry args={[0.05, 0.06, 0.14, 24]} />
          <meshStandardMaterial color={colorHex} roughness={0.45} metalness={0.3} />
        </mesh>
      </group>
      <group position={[0.35, 0.1, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={colorHex} roughness={0.4} metalness={0.35} />
        </mesh>
        <mesh position={[0, -0.16, 0.02]}>
          <cylinderGeometry args={[0.05, 0.06, 0.14, 24]} />
          <meshStandardMaterial color={colorHex} roughness={0.45} metalness={0.3} />
        </mesh>
      </group>
      <RoundedBox args={[0.55, 0.7, 0.28]} radius={0.08} position={[0, -0.55, 0]} castShadow>
        <meshStandardMaterial color={colorHex} roughness={0.5} metalness={0.25} />
      </RoundedBox>
      <mesh position={[0, -0.2, 0.15]}>
        <boxGeometry args={[0.12, 0.02, 0.01]} />
        <meshStandardMaterial color="#ff4d2e" emissive="#ff4d2e" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}
