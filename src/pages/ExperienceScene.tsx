import { useEffect } from "react";
import { useGLTF, useTexture, Stars, Clone } from "@react-three/drei";
import * as THREE from "three";
import ShishWindow from "../components/ShishWindow";
import InfoCard from "../components/InfoCard";

// ══════════════════════════════════════════════════════════════
// 🏛️ EXPERIENCE SCENE (BUILDING 1 SHOWCASE WITH 4 EXPERIENCE WINDOWS)
// ══════════════════════════════════════════════════════════════
const BUILDING_PATH = "/3d-models/building_1.glb";
const SIGN_TEXTURE_PATH = "/experience-sign.jpg";

export default function ExperienceScene() {
  const { scene } = useGLTF(BUILDING_PATH);

  const signTexture = useTexture(SIGN_TEXTURE_PATH, (texture) => {
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

      {/* ── 3D BUILDING 1 FACADE ── */}
      <group position={[-18, -27, -8.36]}>
        <group position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Clone object={scene} scale={[0.38, 0.38, 0.38]} />
        </group>
      </group>

      {/* ── THE ROOF SIGNBOARD ── */}
      <mesh position={[-0.13, 48.5, 30]} rotation={[0, 0, 0]}>
        <planeGeometry args={[22, 3.5]} />
        <meshStandardMaterial
          map={signTexture}
          roughness={0.4}
          metalness={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* ── 4 EXPERIENCE SHISH WINDOWS (2x2 GRID) ── */}
      <group name="experience-windows-container">
        {/* ── ROW 1: UPPER LEVEL ── */}
        {/* WINDOW 1: TOP LEFT - OGTECH */}
        <ShishWindow position={[-10.3, 44.3, 15]} title="OGTECH" width={16} height={9} scale={0.78}>
          <InfoCard title="Software Engineer Intern">
            <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: "#d4af37" }}>
              OGTeck | Aug 2026
            </p>
            <p style={{ margin: "0 0 12px 0" }}>
              Architected and developed "NurseryLink," a high-performance SaaS platform for nursery administration and family engagement.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#a3b8b5",
                borderTop: "1px solid rgba(212,175,55,0.2)",
                paddingTop: "10px",
              }}
            >
              <strong style={{ color: "#f8f5f0" }}>Key:</strong> Implemented strict RBAC routing with three isolated portals and zero-latency Optimistic UI.
            </p>
          </InfoCard>
        </ShishWindow>

        {/* WINDOW 2: TOP RIGHT - CURT AUTONOMOUS */}
        <ShishWindow position={[9.9, 44.3, 15]} title="ROBOTICS" width={16} height={9} scale={0.78}>
          <InfoCard title="Autonomous Systems Member">
            <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: "#d4af37" }}>
              CURT Autonomous | Present
            </p>
            <p style={{ margin: "0 0 12px 0" }}>
              Engineering advanced navigation and control software for autonomous robotic platforms.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#a3b8b5",
                borderTop: "1px solid rgba(212,175,55,0.2)",
                paddingTop: "10px",
              }}
            >
              <strong style={{ color: "#f8f5f0" }}>Focus:</strong> Specializing in path planning algorithms (A*, RRT), motion control techniques, and ROS2 architecture.
            </p>
          </InfoCard>
        </ShishWindow>

        {/* ── ROW 2: LOWER LEVEL ── */}
        {/* WINDOW 3: BOTTOM LEFT - GCI */}
        <ShishWindow position={[-10.3, 35.5, 15]} title="GCI DATA" width={16} height={9} scale={0.78}>
          <InfoCard title="Data Science & ML Program">
            <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: "#d4af37" }}>
              GCI | Technical Program
            </p>
            <p style={{ margin: "0 0 12px 0" }}>
              Mastered end-to-end Machine Learning pipelines and data-driven analysis techniques.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#a3b8b5",
                borderTop: "1px solid rgba(212,175,55,0.2)",
                paddingTop: "10px",
              }}
            >
              <strong style={{ color: "#f8f5f0" }}>Focus:</strong> Feature Engineering, scikit-learn predictive modeling, and Deep Learning integration.
            </p>
          </InfoCard>
        </ShishWindow>

        {/* WINDOW 4: BOTTOM RIGHT - DEPI */}
        <ShishWindow position={[9.9, 35.5, 15]} title="DEPI WEB" width={16} height={9} scale={0.78}>
          <InfoCard title="Full Stack Web Development">
            <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: "#d4af37" }}>
              DEPI | 6-Month Intensive
            </p>
            <p style={{ margin: "0 0 12px 0" }}>
              Comprehensive enterprise web architecture training program focused on scalable applications.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#a3b8b5",
                borderTop: "1px solid rgba(212,175,55,0.2)",
                paddingTop: "10px",
              }}
            >
              <strong style={{ color: "#f8f5f0" }}>Focus:</strong> Enterprise React architecture, scalable backend APIs, and performance optimization.
            </p>
          </InfoCard>
        </ShishWindow>
      </group>
    </>
  );
}

useGLTF.preload(BUILDING_PATH);
