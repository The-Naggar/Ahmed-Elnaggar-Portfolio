import { useEffect } from "react";
import { useGLTF, useTexture, Stars, Clone } from "@react-three/drei";
import * as THREE from "three";
import ShishWindow from "../components/ShishWindow";
import InfoCard from "../components/InfoCard";

// ══════════════════════════════════════════════════════════════
// ⚡ SKILLS SCENE (BUILDING 2 SHOWCASE WITH 4-PILLAR SKILLS GRID)
// ══════════════════════════════════════════════════════════════
const BUILDING_2_PATH = "/3d-models/building_2.glb";
const SIGN_TEXTURE_PATH = "/skills-sign.jpg";

export default function SkillsScene() {
  const { scene } = useGLTF(BUILDING_2_PATH);

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
      <Stars
        radius={200}
        depth={60}
        count={2500}
        factor={3.5}
        saturation={0.5}
        fade
        speed={0.8}
      />

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

      {/* ── 3D BUILDING 2 FACADE ── */}
      <group position={[-20, 14, -3.5]}>
        <group rotation={[0, -Math.PI / 2, 0]}>
          <Clone object={scene} scale={[19, 19, 19]} />
        </group>
      </group>

      {/* ── THE ROOF SIGNBOARD ── */}
      <group position={[0, 42.5, 15]}>
        {/* The Textured Sign Image */}
        <mesh position={[1.1, 11, 0.16]}>
          <planeGeometry args={[39.5, 5.1]} />
          <meshStandardMaterial
            map={signTexture}
            roughness={0.4}
            metalness={0.3}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ── 4-PILLAR SKILLS SHISH WINDOWS (2x2 GRID) ── */}
      <group name="skills-windows-container">
        {/* ── ROW 1 ── */}
        {/* WINDOW 1: FULL STACK */}
        <ShishWindow position={[-11, 44, 15]} title="FULL STACK" width={16} height={9} scale={0.78}>
          <InfoCard title="Full Stack & System Architecture">
            <p style={{ margin: "0 0 14px 0" }}>
              Architecting scalable end-to-end web platforms — uniting distributed system design &amp; robust APIs with intuitive UI/UX design systems, Figma prototyping, and modern frontend engineering.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                "System Design",
                "UI/UX & Figma",
                "React / Next.js",
                "TypeScript",
                "Node.js / Express",
                "PostgreSQL",
                "Prisma ORM",
                "Tailwind CSS",
                "REST & WebSockets",
              ].map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "5px 12px",
                    background: "rgba(212, 175, 55, 0.12)",
                    border: "1px solid rgba(212, 175, 55, 0.35)",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#fef08a",
                    letterSpacing: "0.3px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </InfoCard>
        </ShishWindow>

        {/* WINDOW 2: DATA & ML */}
        <ShishWindow position={[12.8, 44, 15]} title="DATA & ML" width={16} height={9} scale={0.78}>
          <InfoCard title="Data Science & ML">
            <p style={{ margin: "0 0 14px 0" }}>
              End-to-end machine learning pipelines, feature engineering, and predictive modeling algorithms.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                "Python",
                "Pandas / NumPy",
                "scikit-learn",
                "Deep Learning",
                "Data Visualization",
                "Model Deployment",
              ].map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "5px 12px",
                    background: "rgba(212, 175, 55, 0.12)",
                    border: "1px solid rgba(212, 175, 55, 0.35)",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#fef08a",
                    letterSpacing: "0.3px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </InfoCard>
        </ShishWindow>

        {/* ── ROW 2 ── */}
        {/* WINDOW 3: LOW LEVEL */}
        <ShishWindow position={[-11, 33, 15]} title="LOW LEVEL" width={16} height={9} scale={0.78}>
          <InfoCard title="Systems & Hardware">
            <p style={{ margin: "0 0 14px 0" }}>
              Bare-metal programming, digital logic design, and embedded systems architecture.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["C / C++", "ARM Assembly", "VHDL", "STM32", "FPGA (DE1-CV)"].map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "5px 12px",
                    background: "rgba(212, 175, 55, 0.12)",
                    border: "1px solid rgba(212, 175, 55, 0.35)",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#fef08a",
                    letterSpacing: "0.3px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </InfoCard>
        </ShishWindow>

        {/* WINDOW 4: ROBOTICS */}
        <ShishWindow position={[12.8, 33, 15]} title="ROBOTICS" width={16} height={9} scale={0.78}>
          <InfoCard title="Autonomous Robotics">
            <p style={{ margin: "0 0 14px 0" }}>
              Robot Operating System architectures, dynamic motion control, and algorithmic path planning.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                "ROS2",
                "A* & Dijkstra",
                "RRT / RRT*",
                "MPC / DWA",
                "PID Tuning",
                "Kinematics",
                "SLAM",
              ].map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "5px 12px",
                    background: "rgba(212, 175, 55, 0.12)",
                    border: "1px solid rgba(212, 175, 55, 0.35)",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#fef08a",
                    letterSpacing: "0.3px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </InfoCard>
        </ShishWindow>
      </group>
    </>
  );
}

useGLTF.preload(BUILDING_2_PATH);
