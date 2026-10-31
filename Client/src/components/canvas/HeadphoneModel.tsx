"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  colorHex?: string;
  exploded?: boolean;
  float?: boolean;
  scale?: number;
};

function hexToThree(hex: string) {
  return new THREE.Color(hex);
}

export function HeadphoneModel({
  colorHex = "#F5F0E8",
  exploded = false,
  float = true,
  scale = 1,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const leftCup = useRef<THREE.Group>(null);
  const rightCup = useRef<THREE.Group>(null);
  const band = useRef<THREE.Group>(null);
  const leftCushion = useRef<THREE.Mesh>(null);
  const rightCushion = useRef<THREE.Mesh>(null);
  const driverL = useRef<THREE.Mesh>(null);
  const driverR = useRef<THREE.Mesh>(null);

  const materials = useMemo(() => {
    const shell = new THREE.MeshStandardMaterial({
      color: hexToThree(colorHex),
      metalness: 0.55,
      roughness: 0.35,
    });
    const cushion = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a1a"),
      roughness: 0.9,
      metalness: 0.05,
    });
    const metal = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c8c8cc"),
      metalness: 0.9,
      roughness: 0.25,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ff4d2e"),
      emissive: new THREE.Color("#ff4d2e"),
      emissiveIntensity: 0.35,
      metalness: 0.4,
      roughness: 0.4,
    });
    const meshGrill = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a0a0a"),
      metalness: 0.7,
      roughness: 0.4,
    });
    return { shell, cushion, metal, accent, meshGrill };
  }, [colorHex]);

  useGSAP(
    () => {
      // Soft explode — stays in frame (no camera zoom / Bounds re-fit)
      const tl = gsap.timeline({ defaults: { duration: 1.05, ease: "power2.inOut" } });
      if (exploded) {
        tl.to(leftCup.current?.position ?? {}, { x: -1.05 }, 0)
          .to(rightCup.current?.position ?? {}, { x: 1.05 }, 0)
          .to(band.current?.position ?? {}, { y: 0.28 }, 0)
          .to(leftCushion.current?.position ?? {}, { x: -0.14 }, 0)
          .to(rightCushion.current?.position ?? {}, { x: 0.14 }, 0)
          .to(driverL.current?.position ?? {}, { x: -0.08, z: 0.06 }, 0)
          .to(driverR.current?.position ?? {}, { x: 0.08, z: 0.06 }, 0);
      } else {
        tl.to(leftCup.current?.position ?? {}, { x: -0.78 }, 0)
          .to(rightCup.current?.position ?? {}, { x: 0.78 }, 0)
          .to(band.current?.position ?? {}, { y: 0 }, 0)
          .to(leftCushion.current?.position ?? {}, { x: 0 }, 0)
          .to(rightCushion.current?.position ?? {}, { x: 0 }, 0)
          .to(driverL.current?.position ?? {}, { x: 0, z: 0 }, 0)
          .to(driverR.current?.position ?? {}, { x: 0, z: 0 }, 0);
      }
    },
    { dependencies: [exploded] },
  );

  useFrame((state) => {
    if (!group.current || !float) return;
    const t = state.clock.elapsedTime;
    // Gentle yaw only — no vertical bob (avoids top clipping)
    group.current.rotation.y = Math.sin(t * 0.22) * 0.1;
  });

  return (
    <group ref={group} scale={scale} dispose={null} key={colorHex}>
      <group ref={band} position={[0, 0, 0]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]} position={[0, 0.52, 0]}>
          <torusGeometry args={[0.7, 0.044, 24, 64, Math.PI]} />
          <primitive object={materials.shell} attach="material" />
        </mesh>
        <mesh castShadow position={[0, 0.84, 0]}>
          <boxGeometry args={[0.27, 0.055, 0.11]} />
          <primitive object={materials.metal} attach="material" />
        </mesh>
        <mesh position={[0, 0.87, 0.06]}>
          <boxGeometry args={[0.075, 0.018, 0.01]} />
          <primitive object={materials.accent} attach="material" />
        </mesh>
      </group>

      <group ref={leftCup} position={[-0.78, 0, 0]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.36, 0.22, 48]} />
          <primitive object={materials.shell} attach="material" />
        </mesh>
        <mesh ref={leftCushion} castShadow position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.26, 0.07, 16, 40]} />
          <primitive object={materials.cushion} attach="material" />
        </mesh>
        <mesh ref={driverL} position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
          <primitive object={materials.meshGrill} attach="material" />
        </mesh>
        <mesh position={[-0.12, 0.12, 0.12]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <primitive object={materials.accent} attach="material" />
        </mesh>
        <RoundedBox args={[0.08, 0.4, 0.08]} radius={0.02} position={[0, 0.38, 0]} castShadow>
          <primitive object={materials.metal} attach="material" />
        </RoundedBox>
      </group>

      <group ref={rightCup} position={[0.78, 0, 0]}>
        <mesh castShadow rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.36, 0.22, 48]} />
          <primitive object={materials.shell} attach="material" />
        </mesh>
        <mesh ref={rightCushion} castShadow position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.26, 0.07, 16, 40]} />
          <primitive object={materials.cushion} attach="material" />
        </mesh>
        <mesh ref={driverR} position={[-0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
          <primitive object={materials.meshGrill} attach="material" />
        </mesh>
        <RoundedBox args={[0.08, 0.4, 0.08]} radius={0.02} position={[0, 0.38, 0]} castShadow>
          <primitive object={materials.metal} attach="material" />
        </RoundedBox>
      </group>
    </group>
  );
}
