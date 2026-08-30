import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore, DOCKS, type TriggerType } from "../utils/useSceneStore";

// ══════════════════════════════════════════════════════════════
// ⚓ 3D GEOMETRIC DOCK BUOY MARKER
// ══════════════════════════════════════════════════════════════
function DockBuoy({ pos }: { pos: [number, number, number] }) {
  const buoyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (buoyRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle water bobbing and slight sway
      buoyRef.current.position.y = pos[1] + Math.sin(t * 2.0 + pos[0]) * 0.15;
      buoyRef.current.rotation.z = Math.sin(t * 1.5 + pos[2]) * 0.04;
    }
  });

  return (
    <group ref={buoyRef} position={pos}>
      {/* 1. Dark Cylinder Mooring Base */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 2.4, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* 2. Gold Ring Trim Accent */}
      <mesh position={[0, 2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.75, 0.08, 12, 24]} />
        <meshStandardMaterial color="#d4af37" roughness={0.35} metalness={0.8} />
      </mesh>

      {/* 3. Luminous Gold Top Sphere / Lantern (Bloom-reactive emissive) */}
      <mesh position={[0, 2.7, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={3.2}
          toneMapped={false}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════
// 🛰️ OPTIMIZED SPATIAL TRIGGER SYSTEM (0 GC Allocations in useFrame)
// ══════════════════════════════════════════════════════════════
export default function DockTriggers() {
  const boatRef = useRef<THREE.Object3D | null>(null);

  useFrame((state) => {
    // Cache boat object reference once found in the scene tree
    if (!boatRef.current) {
      boatRef.current = state.scene.getObjectByName("player-boat") || null;
    }
    if (!boatRef.current) return;

    const bx = boatRef.current.position.x;
    const bz = boatRef.current.position.z;

    let matchedTrigger: TriggerType = null;

    // 2D Cylindrical Distance Check (Evaluating X & Z axes, ignoring Y)
    for (let i = 0; i < DOCKS.length; i++) {
      const dock = DOCKS[i];
      const dist = Math.hypot(bx - dock.pos[0], bz - dock.pos[2]);
      if (dist <= dock.radius) {
        matchedTrigger = dock.id;
        break;
      }
    }

    // Only update Zustand store if the trigger state actually changed
    const currentActive = useSceneStore.getState().activeTrigger;
    if (currentActive !== matchedTrigger) {
      useSceneStore.getState().setActiveTrigger(matchedTrigger);
    }
  });

  return (
    <group name="dock-triggers">
      {DOCKS.map((dock) => (
        <DockBuoy key={dock.id} pos={dock.pos} />
      ))}
    </group>
  );
}
