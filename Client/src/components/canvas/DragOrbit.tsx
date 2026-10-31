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
 * Drag to orbit. Wheel scroll stays free unless actively dragging.
 */
export function DragOrbit({ children, enabled = true, autoRotate = true }: Props) {
  const group = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const target = useRef({ yaw: 0.2, pitch: 0.06 });
  const current = useRef({ yaw: 0.2, pitch: 0.06 });
  const { gl } = useThree();

  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;
    // Allow browser/Lenis vertical scroll when hovering; drag still works
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
      target.current.yaw += dx * 0.0055;
      target.current.pitch = THREE.MathUtils.clamp(
        target.current.pitch + dy * 0.0035,
        -0.32,
        0.32,
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

    // Wheel: do NOT prevent — let page/Lenis scroll while hovering the model
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

  useFrame((_, dt) => {
    if (!group.current) return;

    if (!dragging.current && autoRotate) {
      target.current.yaw += dt * 0.16;
    }

    const k = 1 - Math.exp(-dt * 12);
    current.current.yaw += (target.current.yaw - current.current.yaw) * k;
    current.current.pitch += (target.current.pitch - current.current.pitch) * k;

    group.current.rotation.order = "YXZ";
    group.current.rotation.y = current.current.yaw;
    group.current.rotation.x = current.current.pitch;
  });

  return <group ref={group}>{children}</group>;
}
