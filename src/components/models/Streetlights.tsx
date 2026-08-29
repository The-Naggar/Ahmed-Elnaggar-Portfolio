import { useGLTF, Clone } from "@react-three/drei";

const STREETLIGHT_PATH = "/3d-models/streetlights.glb";

// ══════════════════════════════════════════════════════════════
// 💡 ROAD LIGHT CONTROLS - Easily customize coordinates & lighting
// ══════════════════════════════════════════════════════════════
export const ROAD_LIGHT_CONFIG = {
  // LEFT ROAD LIGHT POSITION:
  // - x: position across the road (default -80 centers on the road lanes)
  // - y: height above ground (default 2.5 sits right above road & cars)
  // - zOffset: offset along the road relative to each streetlight
  leftPosition: { x: -65, y: 10, zOffset: 0 },

  // RIGHT ROAD LIGHT POSITION:
  // - x: position across the road (default 80 centers on the road lanes)
  // - y: height above ground (default 2.5 sits right above road & cars)
  // - zOffset: offset along the road relative to each streetlight
  rightPosition: { x: 65, y: 10, zOffset: 0 },

  // LIGHT PROPERTIES:
  color: "#ffcc77", // Warm amber streetlight color
  intensity: 30,     // Brightness of the road light
  distance: 35,     // Reach of the light on road and passing cars
  decay: .6,         // Light falloff rate
};

export default function Streetlights() {
  const { scene } = useGLTF(STREETLIGHT_PATH);

  // Generate an array of Z positions spacing every 60 units down to Z=-420
  const lampPositions = Array.from({ length: 13 }).map((_, i) => 300 - i * 60);

  return (
    <group>
      {lampPositions.map((z, index) => (
        <group key={`lamp-${index}`}>
          {/* ── LEFT CORNICHE STREETLIGHT MODEL ── */}
          <group position={[-60.5, 0, z]} rotation={[0, Math.PI / 2, 0]}>
            <Clone object={scene} scale={[3, 3, 3]} position={[0, 1, 0]} />
          </group>

          {/* 💡 LEFT ROAD GROUND LIGHT (Illuminates road surface & passing cars) */}
          <pointLight
            position={[
              ROAD_LIGHT_CONFIG.leftPosition.x,
              ROAD_LIGHT_CONFIG.leftPosition.y,
              z + ROAD_LIGHT_CONFIG.leftPosition.zOffset,
            ]}
            intensity={ROAD_LIGHT_CONFIG.intensity}
            distance={ROAD_LIGHT_CONFIG.distance}
            color={ROAD_LIGHT_CONFIG.color}
            decay={ROAD_LIGHT_CONFIG.decay}
          />

          {/* ── RIGHT CORNICHE STREETLIGHT MODEL ── */}
          <group position={[60.5, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
            <Clone object={scene} scale={[3, 3, 3]} position={[0, 1, 0]} />
          </group>

          {/* 💡 RIGHT ROAD GROUND LIGHT (Illuminates road surface & passing cars) */}
          <pointLight
            position={[
              ROAD_LIGHT_CONFIG.rightPosition.x,
              ROAD_LIGHT_CONFIG.rightPosition.y,
              z + ROAD_LIGHT_CONFIG.rightPosition.zOffset,
            ]}
            intensity={ROAD_LIGHT_CONFIG.intensity}
            distance={ROAD_LIGHT_CONFIG.distance}
            color={ROAD_LIGHT_CONFIG.color}
            decay={ROAD_LIGHT_CONFIG.decay}
          />
        </group>
      ))}
    </group>
  );
}

useGLTF.preload(STREETLIGHT_PATH);
