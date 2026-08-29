import { useEffect } from "react";
import { useGLTF, useTexture, Stars, Clone } from "@react-three/drei";
import * as THREE from "three";
import ShishWindow from "../components/ShishWindow";
import InfoCard from "../components/InfoCard";

// ══════════════════════════════════════════════════════════════
// 🏛️ OVERVIEW SCENE COMPONENT (VINTAGE FACADE SHOWCASE)
// ══════════════════════════════════════════════════════════════
const BUILDING_PATH = "/3d-models/building_1.glb";
const SIGN_TEXTURE_PATH = "/assets/overview_sign.png";

export default function OverviewScene() {
  const { scene } = useGLTF(BUILDING_PATH);
  const vintageSignTexture = useTexture(SIGN_TEXTURE_PATH, (texture) => {
    if (Array.isArray(texture)) {
      texture.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
    } else {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  });

  // Enhance building materials with moonlight specular highlights
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mat = Array.isArray(child.material)
          ? child.material[0]
          : child.material;
        if (mat) {
          mat.roughness = 0.5;
          mat.metalness = 0.2;
        }
      }
    });
  }, [scene]);

  return (
    <>
      <color attach="background" args={["#030712"]} />

      {/* Atmospheric Midnight Stars */}
      <Stars radius={200} depth={60} count={2500} factor={3.5} saturation={0.5} fade speed={0.8} />

      {/* ── COZY WARM LIGHTING RIG ── */}
      <ambientLight intensity={0.85} color="#bae6fd" />
      <directionalLight position={[0, 50, 30]} intensity={2.6} color="#fef3c7" />
      <directionalLight position={[-25, 35, 15]} intensity={1.5} color="#38bdf8" />
      <directionalLight position={[25, 35, 15]} intensity={1.5} color="#fbbf24" />

      {/* Warm Golden Facade Point Lights */}
      <pointLight position={[0, 60, 20]} intensity={30} distance={120} color="#fbbf24" decay={1.8} />
      <pointLight position={[0, 32, 15]} intensity={25} distance={100} color="#fbbf24" decay={1.8} />
      <pointLight position={[-18, 28, 12]} intensity={20} distance={80} color="#f59e0b" decay={1.8} />
      <pointLight position={[18, 28, 12]} intensity={20} distance={80} color="#f59e0b" decay={1.8} />

      {/* ── 3D BUILDING FACADE ── */}
      <group position={[-18, -27, -8.36]}>
        <group position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Clone object={scene} scale={[0.38, 0.38, 0.38]} />
        </group>
      </group>

      {/* ── SINGLE VINTAGE WEATHERED SIGNBOARD OVER THE ROOFTOP BILLBOARD ── */}
      <mesh position={[-0.13, 48.5, 30]} rotation={[0, 0, 0]}>
        <planeGeometry args={[22, 3.5]} />
        <meshStandardMaterial
          map={vintageSignTexture}
          roughness={0.4}
          metalness={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* ── 3 MECHANICAL "SHISH" (EGYPTIAN SHUTTER) WINDOWS ── */}
      {/* WINDOW 1: IDENTITY */}
      <ShishWindow position={[-10.3, 44.3, 15]} title="WHO AM I">
        <InfoCard title="Ahmed Elnagar">
          <p style={{ margin: "0 0 12px 0", fontStyle: "italic", color: "#a3b8b5" }}>
            Cairo, Egypt
          </p>
          <p style={{ margin: 0 }}>
            Computer Engineering student blending full-stack web architecture with low-level systems and machine learning.
          </p>
        </InfoCard>
      </ShishWindow>

      {/* WINDOW 2: EDUCATION */}
      <ShishWindow position={[9.9, 44.3, 15]} title="EDUCATION">
        <InfoCard title="Cairo University">
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
            B.S. Computer Engineering
          </p>
          <p style={{ margin: "0 0 15px 0", fontStyle: "italic", color: "#a3b8b5" }}>
            Sept 2023 – May 2028
          </p>
          <div style={{ borderLeft: "2px solid rgba(212, 175, 55, 0.5)", paddingLeft: "14px" }}>
            <p style={{ margin: "0 0 4px 0" }}>Dean's Recognition List</p>
            <p style={{ margin: 0, fontSize: "15px", color: "#a3b8b5" }}>
              Ranked Top 60 among 2,000 students
            </p>
          </div>
        </InfoCard>
      </ShishWindow>

      {/* WINDOW 3: CONTACT */}
      <ShishWindow position={[0, 36, 15]} title="Get in touch">
        <InfoCard title="Get In Touch">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "18px" }}>
            <a
              href="mailto:naggar.ahm@gmail.com"
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#f8f5f0",
                textDecoration: "none",
                borderBottom: "1px solid rgba(212, 175, 55, 0.25)",
                paddingBottom: "10px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#f8f5f0")}
            >
              <span style={{ color: "#d4af37" }}>Email</span>
              <span>naggar.ahm@gmail.com</span>
            </a>

            <a
              href="tel:+201119041533"
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#f8f5f0",
                textDecoration: "none",
                borderBottom: "1px solid rgba(212, 175, 55, 0.25)",
                paddingBottom: "10px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#f8f5f0")}
            >
              <span style={{ color: "#d4af37" }}>Phone</span>
              <span>+20 111 904 1533</span>
            </a>

            <a
              href="https://github.com/The-Naggar"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#f8f5f0",
                textDecoration: "none",
                borderBottom: "1px solid rgba(212, 175, 55, 0.25)",
                paddingBottom: "10px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#f8f5f0")}
            >
              <span style={{ color: "#d4af37" }}>GitHub</span>
              <span>The-Naggar ↗</span>
            </a>

            <a
              href="https://linkedin.com/in/ahmed-elnagar01"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#f8f5f0",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#f8f5f0")}
            >
              <span style={{ color: "#d4af37" }}>LinkedIn</span>
              <span>ahmed-elnagar01 ↗</span>
            </a>
          </div>
        </InfoCard>
      </ShishWindow>
    </>
  );
}

useGLTF.preload(BUILDING_PATH);
