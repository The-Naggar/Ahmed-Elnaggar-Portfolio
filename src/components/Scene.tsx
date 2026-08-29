import { Suspense } from "react";
import Environment from "./Environment";
import Moon from "./models/Moon";
import CairoTower from "./models/CairoTower";
import NileBoat from "./models/NileBoat";
import Streetlights from "./models/Streetlights";
import Traffic from "./models/Traffic";
import Buildings from "./models/Buildings";
import Trees from "./models/Trees";
import DockTriggers from "./DockTriggers";

export default function Scene() {
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
    </>
  );
}
