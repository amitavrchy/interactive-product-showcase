"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import { HeadphoneModel } from "./HeadphoneModel";
import { SpeakerModel } from "./SpeakerModel";
import { BudsModel } from "./BudsModel";
import { DragOrbit } from "./DragOrbit";
import { unlockPageScroll } from "@/lib/scroll-lock";

export type SceneProduct = "headphones" | "speaker" | "earbuds";

type Props = {
  colorHex?: string;
  exploded?: boolean;
  productType?: SceneProduct;
  className?: string;
  interactive?: boolean;
  framed?: boolean;
};

function Model({
  productType,
  colorHex,
  exploded,
  interactive,
}: {
  productType: SceneProduct;
  colorHex: string;
  exploded: boolean;
  interactive: boolean;
}) {
  if (productType === "speaker") {
    return <SpeakerModel colorHex={colorHex} />;
  }
  if (productType === "earbuds") {
    return <BudsModel colorHex={colorHex} />;
  }
  return (
    <HeadphoneModel
      colorHex={colorHex}
      exploded={exploded}
      float={!exploded && !interactive}
      scale={1.05}
    />
  );
}

export function ProductScene({
  colorHex = "#F5F0E8",
  exploded = false,
  productType = "headphones",
  className,
  interactive = true,
  framed = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cameraZ = framed ? 3.9 : 3.75;

  useEffect(() => () => unlockPageScroll(), []);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        // pan-y keeps vertical page scroll when hovering the stage
        touchAction: "pan-y",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.12, cameraZ], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%", touchAction: "pan-y", display: "block" }}
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = "pan-y";
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.52} />
        <spotLight position={[4, 6, 3]} intensity={2.1} angle={0.4} penumbra={0.85} castShadow />
        <spotLight position={[-3, 2, -2]} intensity={0.7} color="#7cffb2" />

        <Suspense fallback={null}>
          {/* Lower + centered in frame — size unchanged */}
          <group position={[0, framed ? -0.42 : -0.28, 0]}>
            {interactive ? (
              <DragOrbit enabled autoRotate={!exploded}>
                <Model
                  productType={productType}
                  colorHex={colorHex}
                  exploded={exploded}
                  interactive={interactive}
                />
              </DragOrbit>
            ) : (
              <DragOrbit enabled={false} autoRotate>
                <Model
                  productType={productType}
                  colorHex={colorHex}
                  exploded={exploded}
                  interactive={false}
                />
              </DragOrbit>
            )}
          </group>

          <ContactShadows
            position={[0, framed ? -1.55 : -1.45, 0]}
            opacity={0.4}
            scale={12}
            blur={2.4}
            far={2.6}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
