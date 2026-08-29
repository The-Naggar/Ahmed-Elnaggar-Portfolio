import { useEffect } from "react";
import { useGLTF, useTexture, Stars, Clone } from "@react-three/drei";
import * as THREE from "three";
import ShishWindow from "../components/ShishWindow";
import InfoCard from "../components/InfoCard";

// ══════════════════════════════════════════════════════════════
// 🏗️ PROJECTS SCENE (BUILDING 2 SHOWCASE WITH 8 PROJECT GRID)
// ══════════════════════════════════════════════════════════════
const BUILDING_2_PATH = "/3d-models/building_2.glb";
const SIGN_TEXTURE_PATH = "/projects-sign.png";

function GitHubLink({ url }: { url: string }) {
  return (
    <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(212, 175, 55, 0.25)" }}>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "#d4af37",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.5px",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fef08a")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#d4af37")}
      >
        <span>CODE REPOSITORY</span>
        <span>↗</span>
      </a>
    </div>
  );
}

export default function ProjectsScene() {
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

      {/* ── 8 PROJECT SHISH WINDOWS (2 COLUMNS x 4 ROWS) ── */}
      <group name="projects-windows-container">
        {/* ── ROW 1 ── */}
        {/* WINDOW 1: NURSERYLINK */}
        <ShishWindow position={[-12, 47, 15]} title="NURSERYLINK" width={16} height={8} scale={0.7}>
          <InfoCard title="NurseryLink">
            <p style={{ margin: "0 0 10px 0" }}>
              High-performance SaaS platform engineered to streamline nursery administration and family engagement.
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#a3b8b5" }}>
              <strong>Tools:</strong> React, Vite, TypeScript, Node.js, PostgreSQL, Prisma
            </p>
            <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>
              <strong>Highlight:</strong> Architected a strict RBAC routing system with three isolated, secure portals and zero-latency Optimistic UI.
            </p>
            <GitHubLink url="https://github.com/The-Naggar/NurseryLink" />
          </InfoCard>
        </ShishWindow>

        {/* WINDOW 2: 3D PORTFOLIO */}
        <ShishWindow position={[13.5, 47, 15]} title="3D PORTFOLIO" width={16} height={8} scale={0.7}>
          <InfoCard title="Immersive Portfolio">
            <p style={{ margin: "0 0 10px 0" }}>
              An interactive, physics-driven 3D web experience mapping professional engineering history to an authentic Cairo night scene.
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#a3b8b5" }}>
              <strong>Tools:</strong> React Three Fiber, WebGL, Drei, React Spring
            </p>
            <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>
              <strong>Highlight:</strong> Engineered custom 3D mechanical shaders, interactive physics, and decoupled cinematic UI overlays.
            </p>
            <GitHubLink url="https://github.com/The-Naggar/my-portofolio.git" />
          </InfoCard>
        </ShishWindow>

        {/* ── ROW 2 ── */}
        {/* WINDOW 3: PEERSPACE */}
        <ShishWindow position={[-12, 39, 15]} title="PEERSPACE" width={16} height={8} scale={0.7}>
          <InfoCard title="PeerSpace">
            <p style={{ margin: "0 0 10px 0" }}>
              Full-stack academic collaboration platform connecting students and instructors with real-time communication.
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#a3b8b5" }}>
              <strong>Tools:</strong> TypeScript, React, Next.js, Node.js, REST APIs
            </p>
            <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>
              <strong>Highlight:</strong> Implemented intelligent engagement analytics and dynamic dashboards for course management.
            </p>
            <GitHubLink url="https://github.com/The-Naggar/PeerSpace" />
          </InfoCard>
        </ShishWindow>

        {/* WINDOW 4: BITBOY */}
        <ShishWindow position={[13.5, 39, 15]} title="BITBOY" width={16} height={8} scale={0.7}>
          <InfoCard title="Bitboy">
            <p style={{ margin: "0 0 10px 0" }}>
              Custom handheld gaming console powered by the STM32 microcontroller with retro game emulation.
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#a3b8b5" }}>
              <strong>Tools:</strong> ARM Assembly, C, STM32, Embedded Systems
            </p>
            <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>
              <strong>Highlight:</strong> Implemented TFT display config and a Dino game in ARM assembly, meticulously optimizing embedded memory.
            </p>
            <GitHubLink url="https://github.com/Ali-Said1/Bitboy" />
          </InfoCard>
        </ShishWindow>

        {/* ── ROW 3 ── */}
        {/* WINDOW 5: TRI-TRACK */}
        <ShishWindow position={[-12, 31, 15]} title="TRI-TRACK" width={16} height={8} scale={0.7}>
          <InfoCard title="TRI-TRACK">
            <p style={{ margin: "0 0 10px 0" }}>
              Mobile application for real-time subject tracking, automated audio transcription, and PDF summarization.
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#a3b8b5" }}>
              <strong>Tools:</strong> Flutter, YOLOv8 (TFLite), FFmpeg, ESP32
            </p>
            <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>
              <strong>Highlight:</strong> Engineered an auto-framing Pan/Tilt physical gimbal steered via UDP based on edge ML inference.
            </p>
            <GitHubLink url="https://github.com/The-Naggar/Tri-Track" />
          </InfoCard>
        </ShishWindow>

        {/* WINDOW 6: OS SCHEDULER */}
        <ShishWindow position={[13.5, 31, 15]} title="OS SCHEDULER" width={16} height={8} scale={0.7}>
          <InfoCard title="OS Scheduler">
            <p style={{ margin: "0 0 10px 0" }}>
              Custom operating system process scheduler handling process states, context switching, and resource allocation.
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#a3b8b5" }}>
              <strong>Tools:</strong> C/C++, Systems Programming
            </p>
            <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>
              <strong>Highlight:</strong> Architected robust FSM logic for prioritization and seamless process life-cycle management.
            </p>
            <GitHubLink url="https://github.com/The-Naggar" />
          </InfoCard>
        </ShishWindow>

        {/* ── ROW 4 ── */}
        {/* WINDOW 7: MONOPOLY */}
        <ShishWindow position={[0.8, 35, 15]} title="MONOPOLY" width={16} height={8} scale={0.7}>
          <InfoCard title="Snake & Ladders Monopoly">
            <p style={{ margin: "0 0 10px 0" }}>
              A console-based implementation of a board game designed to master core software architecture.
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#a3b8b5" }}>
              <strong>Tools:</strong> C++, OOP, Design Patterns
            </p>
            <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>
              <strong>Highlight:</strong> Heavily utilized inheritance, polymorphism, and encapsulation for highly modular game mechanics.
            </p>
            <GitHubLink url="https://github.com/The-Naggar/Monopoly-Ladder-and-Snake" />
          </InfoCard>
        </ShishWindow>

        {/* WINDOW 8: ELEVATOR */}
        <ShishWindow position={[0.8, 42, 15]} title="ELEVATOR" width={16} height={8} scale={0.7}>
          <InfoCard title="10-Floor Elevator">
            <p style={{ margin: "0 0 10px 0" }}>
              Hardware controller logic with intelligent request prioritization and safety interlocks for a 10-floor system.
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#a3b8b5" }}>
              <strong>Tools:</strong> VHDL, FPGA (DE1-CV), Digital Logic, ModelSim
            </p>
            <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>
              <strong>Highlight:</strong> Designed FSM-based logic, developed self-checking testbenches, and completed full hardware integration.
            </p>
            <GitHubLink url="https://github.com/The-Naggar/Elevator" />
          </InfoCard>
        </ShishWindow>
      </group>
    </>
  );
}

useGLTF.preload(BUILDING_2_PATH);
