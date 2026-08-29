import { useGLTF } from "@react-three/drei";

const TOWER_PATH = "/3d-models/cairo_tower.glb";

export default function CairoTower() {
  const { scene } = useGLTF(TOWER_PATH);

  return (
    <group position={[0, 0, -400]}>
      {/* Cairo Tower Model */}
      <primitive
        object={scene}
        position={[0, 0, 0]}
        scale={[8, 8, 8]}
      />

      {/* 1. TOP LOTUS CROWN LIGHT (Luminous gold glow visible from afar) */}
      <pointLight
        position={[0, 155, 15]}
        intensity={90}
        color="#fbbf24"
        distance={500}
        decay={1.0}
      />

      {/* 2. BODY SHAFT LIGHT (Illuminates the cylindrical lattice shaft) */}
      <pointLight
        position={[0, 75, 40]}
        intensity={70}
        color="#f59e0b"
        distance={380}
        decay={1.2}
      />

      {/* 3. RIVER REFLECTIONS LIGHT (Casts shimmering gold reflection on Nile water) */}
      <pointLight
        position={[0, 3, 50]}
        intensity={35}
        color="#f59e0b"
        distance={250}
        decay={1.4}
      />
    </group>
  );
}

useGLTF.preload(TOWER_PATH);
