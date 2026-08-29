import React, { useState, useRef, useEffect, useCallback } from "react";
import { Html, Text } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { a as aWeb } from "@react-spring/web";
import { shishSound } from "../utils/audio";

interface ShishWindowProps {
  position: [number, number, number];
  title: string;
  width?: number;
  height?: number;
  scale?: number | [number, number, number];
  children: React.ReactNode;
}

const AnimatedText = a(Text);

// Helper to generate the 3D louvers (the slats of the traditional Egyptian Shish)
function ShishLouvers({ width, height }: { width: number; height: number }) {
  return (
    <group>
      {/* Main door frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width / 2, height, 0.5]} />
        <meshStandardMaterial color="#0f1318" roughness={0.9} metalness={0.2} />
      </mesh>
      {/* Shutter border frame accent */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[width / 2 - 0.4, height - 0.4, 0.45]} />
        <meshStandardMaterial color="#161c24" roughness={0.85} metalness={0.3} />
      </mesh>
      {/* Horizontal Louver Slats */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[0, -height / 2 + 1.5 + i * ((height - 3) / 5), 0.3]}
          rotation={[-0.25, 0, 0]}
        >
          <boxGeometry args={[width / 2 - 1.2, 0.8, 0.15]} />
          <meshStandardMaterial color="#1e2630" roughness={0.75} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export default function ShishWindow({
  position,
  title,
  width = 16,
  height = 10,
  scale = 0.8,
  children,
}: ShishWindowProps) {
  const [hovered, setHovered] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHovered((prev) => {
      if (!prev) {
        shishSound.playOpen();
      }
      return true;
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // 300ms grace window: never snap shut while cursor moves across any part of window/card
    closeTimeoutRef.current = setTimeout(() => {
      setHovered((prev) => {
        if (prev) {
          shishSound.playClose();
        }
        return false;
      });
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Physics for the swinging double doors and blooming card
  const { doorAngle, contentOpacity, cardZ, cardScale } = useSpring({
    doorAngle: hovered ? Math.PI / 1.5 : 0, // Swings open ~120 degrees
    contentOpacity: hovered ? 1 : 0,
    cardZ: hovered ? 8 : -1, // Pops forward in front of the facade (+8)
    cardScale: hovered ? 1.2 : 0.9, // Expands 1.2x on pop-out for comfortable readability
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const scaleVector: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  return (
    <group
      position={position}
      scale={scaleVector}
      onPointerEnter={(e) => {
        e.stopPropagation();
        handlePointerEnter();
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        handlePointerLeave();
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        handlePointerEnter();
      }}
    >
      {/* 1. DEEP STATIC INVISIBLE HITBOX (Encompasses entire interaction volume) */}
      <mesh position={[0, 0, 3]}>
        <boxGeometry args={[width * 1.5, height * 1.4, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* BACK WALL / RECESS (Interior chamber behind the shutters) */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[width, height, 0.4]} />
        <meshStandardMaterial color="#04070c" roughness={0.95} metalness={0.8} />
      </mesh>

      {/* LEFT SHUTTER (Hinged on the left edge, swings outward towards user) */}
      <a.group
        position={[-width / 2, 0, 0.5]}
        rotation-y={doorAngle.to((aAngle: number) => -aAngle)}
      >
        <group position={[width / 4, 0, 0]}>
          <ShishLouvers width={width} height={height} />
        </group>
      </a.group>

      {/* RIGHT SHUTTER (Hinged on the right edge, swings outward towards user) */}
      <a.group position={[width / 2, 0, 0.5]} rotation-y={doorAngle}>
        <group position={[-width / 4, 0, 0]}>
          <ShishLouvers width={width} height={height} />
        </group>
      </a.group>

      {/* TITLE TEXT (Sits in front of closed doors, fades out on open) */}
      <AnimatedText
        position={[0, 0, 1.2]}
        anchorX="center"
        anchorY="middle"
        color="#d4af37"
        font="/fonts/ArefRuqaa.ttf"
        fontSize={1.5}
        letterSpacing={0.08}
        outlineColor="#000000"
        outlineWidth={0.05}
        fillOpacity={contentOpacity.to((o: number) => Math.max(0, 1 - o * 2.5))}
      >
        {`[ ${title} ]`}
      </AnimatedText>

      {/* INTERIOR HTML CONTENT (Blooms outward & expands 1.5x when hovered) */}
      <a.group position-z={cardZ} scale={cardScale}>
        <Html
          position={[0, 0, 0]}
          transform
          center
          zIndexRange={[100, 0]}
          pointerEvents={hovered ? "auto" : "none"}
        >
          <aWeb.div
            style={{
              opacity: contentOpacity,
              pointerEvents: hovered ? "auto" : "none",
              userSelect: "none",
              boxSizing: "border-box",
            }}
            onMouseEnter={handlePointerEnter}
            onMouseLeave={handlePointerLeave}
            onMouseMove={handlePointerEnter}
          >
            {children}
          </aWeb.div>
        </Html>
      </a.group>
    </group>
  );
}
