import { useMemo, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const TREES_PATH = "/3d-models/trees_low_poly.glb";

interface TreeTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export default function Trees() {
  const { scene } = useGLTF(TREES_PATH);

  // Extract all unique child meshes from the tree model
  const meshes = useMemo(() => {
    const list: { geometry: THREE.BufferGeometry; material: THREE.Material }[] = [];
    scene.traverse((child: any) => {
      if (child.isMesh && child.geometry && child.material) {
        list.push({
          geometry: child.geometry,
          material: child.material,
        });
      }
    });
    return list;
  }, [scene]);

  // Generate lush sidewalk trees along both banks with safe clearance from the road
  const treeTransforms = useMemo<TreeTransform[]>(() => {
    const list: TreeTransform[] = [];

    // ── 1. CONTINUOUS AVENUE TREES (Left Bank: X ∈ [-112, -116] | Right Bank: X ∈ [112, 116]) ──
    const zStart = 260;
    const zEnd = -380;
    const spacing = 34;
    const count = Math.floor((zStart - zEnd) / spacing) + 1;

    for (let i = 0; i < count; i++) {
      const z = zStart - i * spacing;
      const seed = (i * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      const scaleBase = 0.24 + rnd * 0.08; // Natural scale between 0.24 and 0.32
      const yaw = rnd * Math.PI * 2;

      // Left Bank Tree (Road ends at X = -100; safe sidewalk at X = -112 to -115)
      list.push({
        position: [-112 - (rnd > 0.5 ? 3 : 0), 0.5, z + (rnd - 0.5) * 6],
        rotation: [-Math.PI / 2, 0, yaw],
        scale: [scaleBase, scaleBase, scaleBase],
      });

      // Right Bank Tree (Road ends at X = +100; safe sidewalk at X = +112 to +115)
      const rightYaw = (yaw + 1.6) % (Math.PI * 2);
      list.push({
        position: [112 + (rnd > 0.5 ? 3 : 0), 0.5, z + (0.5 - rnd) * 6],
        rotation: [-Math.PI / 2, 0, rightYaw],
        scale: [scaleBase * 0.95, scaleBase * 0.95, scaleBase * 0.95],
      });
    }

    // ── 2. PLAZA ACCENT CLUSTERS (Backdrop foliage behind destination buildings) ──
    const plazas = [
      { side: -1, z: 50 },   // Overview (Left)
      { side: 1, z: -80 },   // Projects (Right)
      { side: -1, z: -260 }, // Skills (Left)
      { side: 1, z: -340 },  // Experience (Right)
    ];

    plazas.forEach(({ side, z }, idx) => {
      const baseX = side * 122; // Safely behind the sidewalk line
      list.push({
        position: [baseX, 0.5, z - 14],
        rotation: [-Math.PI / 2, 0, idx * 1.3],
        scale: [0.28, 0.28, 0.28],
      });
      list.push({
        position: [baseX + side * 6, 0.5, z + 14],
        rotation: [-Math.PI / 2, 0, idx * 2.1 + 0.8],
        scale: [0.26, 0.26, 0.26],
      });
    });

    return list;
  }, []);

  const totalTrees = treeTransforms.length;
  const instancedMeshRefs = useRef<(THREE.InstancedMesh | null)[]>([]);

  useEffect(() => {
    const dummy = new THREE.Object3D();

    treeTransforms.forEach((t, i) => {
      dummy.position.set(...t.position);
      dummy.rotation.set(...t.rotation);
      dummy.scale.set(...t.scale);
      dummy.updateMatrix();

      instancedMeshRefs.current.forEach((meshRef) => {
        if (meshRef) meshRef.setMatrixAt(i, dummy.matrix);
      });
    });

    instancedMeshRefs.current.forEach((meshRef) => {
      if (meshRef) meshRef.instanceMatrix.needsUpdate = true;
    });
  }, [treeTransforms, meshes]);

  return (
    <group name="landscaping-trees-instanced">
      {meshes.map((m, idx) => (
        <instancedMesh
          key={idx}
          ref={(el) => {
            instancedMeshRefs.current[idx] = el;
          }}
          args={[m.geometry, m.material, totalTrees]}
          frustumCulled={false}
        />
      ))}
    </group>
  );
}

useGLTF.preload(TREES_PATH);
