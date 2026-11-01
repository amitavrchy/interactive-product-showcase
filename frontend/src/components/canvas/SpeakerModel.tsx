"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export function SpeakerModel({ colorHex = "#111111" }: { colorHex?: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.25;
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <group ref={ref} scale={1.1}>
      <RoundedBox args={[1.1, 1.35, 1.1]} radius={0.18} castShadow>
        <meshStandardMaterial color={colorHex} roughness={0.75} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 0.15, 0.56]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.06, 48]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.35, 0.56]}>
        <cylinderGeometry args={[0.18, 0.18, 0.05, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.55, 0.56]}>
        <boxGeometry args={[0.2, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#ff4d2e"
          emissive="#ff4d2e"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}
