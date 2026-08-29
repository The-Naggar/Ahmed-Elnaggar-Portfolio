import { useState, useEffect } from "react";
import { useTexture, Float, Text, Stars, Sparkles } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import * as THREE from "three";

// ══════════════════════════════════════════════════════════════
// 📜 TOWER / RESUME SCENE (BRIGHT MIDNIGHT STARS & FLOATING CV)
// ══════════════════════════════════════════════════════════════
const CV_PREVIEW_PATH = "/cv-preview.jpg";
const CV_DRIVE_URL = "https://drive.google.com/file/d/1QLuEtpfc5XeKGP5PGzfAQewtHLzApMrc/view?usp=sharing";

export default function TowerScene() {
  const cvTexture = useTexture(CV_PREVIEW_PATH, (texture) => {
    if (Array.isArray(texture)) {
      texture.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
    } else {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  });

  const [hovered, setHovered] = useState(false);

  // Change cursor to pointer when hovering the CV
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  // Spring animation for smooth hover pop-out on the floating CV (1.2x enlarged)
  const { scale } = useSpring({
    scale: hovered ? 1.27 : 1.2,
    config: { mass: 1, tension: 150, friction: 14 },
  });

  const handleCVClick = () => {
    window.open(CV_DRIVE_URL, "_blank");
  };

  return (
    <>
      <color attach="background" args={["#030712"]} />

      {/* ── ✨ BRIGHT BRILLIANT STAR FIELDS ── */}
      {/* 1. Primary High-Luminosity Star Field */}
      <Stars
        radius={220}
        depth={70}
        count={5000}
        factor={6.5}
        saturation={0.8}
        fade
        speed={1.2}
      />
      {/* 2. Deep Ambient Constellation Stars */}
      <Stars
        radius={300}
        depth={90}
        count={3500}
        factor={4.5}
        saturation={1.0}
        fade
        speed={0.7}
      />
      {/* 3. Twinkling Stardust Floating Around Scene */}
      <Sparkles
        count={180}
        scale={[65, 50, 40]}
        size={7}
        speed={0.6}
        opacity={0.9}
        color="#e0f2fe"
        position={[0, 42, 5]}
      />

      {/* ── COZY WARM LIGHTING RIG ── */}
      <ambientLight intensity={0.9} color="#bae6fd" />
      <directionalLight position={[0, 50, 30]} intensity={2.8} color="#fef3c7" />
      <directionalLight position={[-25, 35, 15]} intensity={1.6} color="#38bdf8" />
      <directionalLight position={[25, 35, 15]} intensity={1.6} color="#fbbf24" />

      {/* Golden Focus Illumination */}
      <pointLight position={[0, 42, 25]} intensity={35} distance={120} color="#fbbf24" decay={1.6} />
      <pointLight position={[-15, 35, 20]} intensity={20} distance={90} color="#f59e0b" decay={1.8} />
      <pointLight position={[15, 35, 20]} intensity={20} distance={90} color="#f59e0b" decay={1.8} />

      {/* ── FLOATING CV ARTIFACT BEACON ── */}
      <Float
        position={[0, 42, 14]}
        speed={1.8}
        rotationIntensity={0.12}
        floatIntensity={0.8}
        floatingRange={[-0.4, 0.4]}
      >
        <a.group
          scale={scale}
          onPointerEnter={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCVClick();
          }}
        >
          {/* Outer Teal / Paper Card Shadow Plate */}
          <mesh position={[0, 0, -0.15]}>
            <boxGeometry args={[14.4, 19.0, 0.4]} />
            <meshStandardMaterial
              color={hovered ? "#163a36" : "#0d2825"}
              roughness={0.7}
              metalness={0.2}
            />
          </mesh>

          {/* Gold Filigree Frame Accent */}
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[14.0, 18.6, 0.42]} />
            <meshStandardMaterial
              color="#d4af37"
              roughness={0.35}
              metalness={0.7}
            />
          </mesh>

          {/* CV Document Texture Plane */}
          <mesh position={[0, 0, 0.22]}>
            <planeGeometry args={[13.4, 18.0]} />
            <meshStandardMaterial
              map={cvTexture}
              roughness={0.5}
              metalness={0.1}
              toneMapped={false}
            />
          </mesh>

          {/* Interactive Action Callout */}
          <Text
            position={[0, -11.2, 0.4]}
            anchorX="center"
            anchorY="middle"
            color={hovered ? "#fef08a" : "#d4af37"}
            font="/fonts/ArefRuqaa.ttf"
            fontSize={1.25}
            letterSpacing={0.08}
            outlineColor="#000000"
            outlineWidth={0.05}
          >
            [ CLICK TO VIEW FULL RESUME ↗ ]
          </Text>
        </a.group>
      </Float>
    </>
  );
}
