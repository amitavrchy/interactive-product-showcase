"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";

type Props = {
  children: React.ReactNode;
  enabled?: boolean;
  autoRotate?: boolean;
};

/**
 * Drag to orbit. Idle spin is dampened; wheel scroll stays free unless dragging.
 */
export function DragOrbit({ children, enabled = true, autoRotate = true }: Props) {
  const group = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const target = useRef({ yaw: 0.25, pitch: 0.05 });
  const current = useRef({ yaw: 0.25, pitch: 0.05 });
  const { gl } = useThree();

  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragging.current = true;
      el.style.cursor = "grabbing";
      el.style.touchAction = "none";
      last.current = { x: e.clientX, y: e.clientY };
      lockPageScroll();
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      target.current.yaw += dx * 0.0042;
      target.current.pitch = THREE.MathUtils.clamp(
        target.current.pitch + dy * 0.0028,
        -0.28,
        0.28,
      );
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      el.style.cursor = "grab";
      el.style.touchAction = "pan-y";
      unlockPageScroll();
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    el.addEventListener("pointerdown", onDown, { passive: false });
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp, { passive: false });
    window.addEventListener("pointercancel", onUp, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (dragging.current) unlockPageScroll();
      dragging.current = false;
      el.style.touchAction = "pan-y";
    };
  }, [enabled, gl]);

  useFrame((_, delta) => {
    if (!group.current) return;

    // Cap dt so tab-switch / hitch doesn't jump the orbit
    const dt = Math.min(delta, 1 / 30);

    if (!dragging.current && autoRotate) {
      target.current.yaw += dt * 0.1;
    }

    // Critically damped feel — smoother than hard lerp
    const smooth = 1 - Math.exp(-dt * 6.5);
    current.current.yaw += (target.current.yaw - current.current.yaw) * smooth;
    current.current.pitch += (target.current.pitch - current.current.pitch) * smooth;

    group.current.rotation.order = "YXZ";
    group.current.rotation.y = current.current.yaw;
    group.current.rotation.x = current.current.pitch;
  });

  return <group ref={group}>{children}</group>;
}
