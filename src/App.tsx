import { useState, Suspense, lazy } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import EntryOverlay from "./pages/EntryOverlay";
import DockPrompt from "./components/DockPrompt";
import ReturnButton from "./components/ReturnButton";
import { useSceneStore } from "./utils/useSceneStore";

// 🚀 Lazy-Loaded Scenes for optimal WebGL performance
const RiverScene = lazy(() => import("./components/Scene"));
const OverviewScene = lazy(() => import("./pages/OverviewScene"));
const ProjectsScene = lazy(() => import("./pages/ProjectsScene"));
const SkillsScene = lazy(() => import("./pages/SkillsScene"));
const ExperienceScene = lazy(() => import("./pages/ExperienceScene"));
const TowerScene = lazy(() => import("./pages/TowerScene"));

export default function App() {
  const [entered, setEntered] = useState(false);
  const currentScene = useSceneStore((state) => state.currentScene);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#020408" }}>
      {/* 1. Nocturnal Luxury Audio & Landing Overlay */}
      <EntryOverlay onEnter={() => setEntered(true)} />

      {/* 2. Cinematic DOM Overlays */}
      <DockPrompt />
      <ReturnButton />

      {/* 3. High-Performance 3D WebGL Canvas Router */}
      <Canvas
        frameloop={entered ? "always" : "demand"}
        dpr={[1, 1.5]}
        gl={{ antialias: true, autoClear: true, powerPreference: "high-performance" }}
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* Dedicated Static Camera for Showcase Scenes */}
        {currentScene !== "river" && (
          <PerspectiveCamera
            makeDefault
            position={[0, 40, 56]}
            fov={45}
            near={0.5}
            far={1000}
          />
        )}

        {/* Dynamic Scene Routing — Unmounts inactive scenes to release GPU buffers */}
        <Suspense fallback={null}>
          {currentScene === "river" && <RiverScene />}
          {currentScene === "overview" && <OverviewScene />}
          {currentScene === "projects" && <ProjectsScene />}
          {currentScene === "skills" && <SkillsScene />}
          {currentScene === "experience" && <ExperienceScene />}
          {currentScene === "tower" && <TowerScene />}
        </Suspense>
      </Canvas>
    </div>
  );
}
