import { useGLTF, Clone } from "@react-three/drei";

const TREES_PATH = "/3d-models/trees_low_poly.glb";

export default function Trees() {
  const { scene } = useGLTF(TREES_PATH);

  // Helper component to generate a mini-cluster of 3 trees around a specific coordinate
  const TreeCluster = ({ x, z }: { x: number; z: number }) => (
    <group position={[x, 0.5, z]}>
      {/* Center tree */}
      <Clone object={scene} position={[0, 0, 0]} scale={[0.04, 0.04, 0.04]} />
      {/* Offset tree 1 (pushed slightly towards the road) */}
      <Clone
        object={scene}
        position={[x > 0 ? -6 : 6, 0, 12]}
        rotation={[0, 1.2, 0]}
        scale={[0.02, 0.02, 0.02]}
      />
      {/* Offset tree 2 */}
      <Clone
        object={scene}
        position={[0, -0.5, -15]}
        rotation={[0, 0, 0]}
        scale={[0.015, 0.015, 0.015]}
      />
    </group>
  );

  return (
    <group>
      {/* LEFT SIDE BUILDINGS */}
      <TreeCluster x={-115} z={50} />   {/* Overview */}
      <TreeCluster x={-115} z={-210} /> {/* Skills */}

      {/* RIGHT SIDE BUILDINGS */}
      <TreeCluster x={115} z={-80} />   {/* Projects */}
      <TreeCluster x={115} z={-340} />  {/* Experience */}
    </group>
  );
}

useGLTF.preload(TREES_PATH);
