import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Environment from "./Environment";
import Moon from "./models/Moon";
import CairoTower from "./models/CairoTower";
import NileBoat from "./models/NileBoat";
import Streetlights from "./models/Streetlights";
import Traffic from "./models/Traffic";
import Buildings from "./models/Buildings";
import Trees from "./models/Trees";
import DockTriggers from "./DockTriggers";
import { useSceneStore } from "../utils/useSceneStore";

export default function Scene() {
  const perfFactor = useSceneStore((state) => state.perfFactor);

  return (
    <>
      {/* Lighting, stars, fog & procedural River Nile */}
      <Suspense fallback={null}>
        <Environment />
      </Suspense>

      {/* ── 3D Models with Granular Suspense Boundaries ── */}
      {/* 1. Luminous Moon */}
      <Suspense fallback={null}>
        <Moon />
      </Suspense>

      {/* 2. Cairo Tower Landmark */}
      <Suspense fallback={null}>
        <CairoTower />
      </Suspense>

      {/* 3. Nile Boat Floating on the River */}
      <Suspense fallback={null}>
        <NileBoat />
      </Suspense>

      {/* 4. Spatial Dock Triggers & 3D Buoy Markers */}
      <Suspense fallback={null}>
        <DockTriggers />
      </Suspense>

      {/* 5. Corniche Streetlights */}
      <Suspense fallback={null}>
        <Streetlights />
      </Suspense>

      {/* 6. Moving Highway Traffic */}
      <Suspense fallback={null}>
        <Traffic />
      </Suspense>

      {/* 7. Destination Hub Buildings */}
      <Suspense fallback={null}>
        <Buildings />
      </Suspense>

      {/* 8. Sidewalk Landscaping Trees */}
      <Suspense fallback={null}>
        <Trees />
      </Suspense>

      {/* ── High-Performance Bloom Post-Processing Pipeline ── */}
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.55}
          luminanceSmoothing={0.3}
          intensity={1.25 * perfFactor}
        />
      </EffectComposer>
    </>
  );
}

