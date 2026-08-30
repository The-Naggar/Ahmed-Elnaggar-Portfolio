import { useEffect, useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const STREETLIGHT_PATH = "/3d-models/streetlights.glb";

export default function Streetlights() {
  const { scene } = useGLTF(STREETLIGHT_PATH);
  const lampCount = 26; // 13 left + 13 right

  // Extract all unique child meshes from the streetlight GLB
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

  const instancedMeshRefs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const bulbInstancedRef = useRef<THREE.InstancedMesh | null>(null);

  // Pre-calculate matrices for the 26 streetlights and their glowing bulbs
  useEffect(() => {
    const dummy = new THREE.Object3D();
    const bulbDummy = new THREE.Object3D();
    const lampPositions = Array.from({ length: 13 }).map((_, i) => 300 - i * 60);

    let instanceIdx = 0;

    lampPositions.forEach((z) => {
      // 1. LEFT CORNICHE STREETLIGHT
      dummy.position.set(-65, 1, z);
      dummy.rotation.set(0, -Math.PI / 2, 0);
      dummy.scale.set(2, 2, 2);
      dummy.updateMatrix();

      // Glowing bulb position (matching lamp fixture head)
      bulbDummy.position.set(-80, 20, z);
      bulbDummy.scale.set(0.65, 0.65, 0.65);
      bulbDummy.updateMatrix();

      instancedMeshRefs.current.forEach((meshRef) => {
        if (meshRef) meshRef.setMatrixAt(instanceIdx, dummy.matrix);
      });
      if (bulbInstancedRef.current) {
        bulbInstancedRef.current.setMatrixAt(instanceIdx, bulbDummy.matrix);
      }
      instanceIdx++;

      // 2. RIGHT CORNICHE STREETLIGHT
      dummy.position.set(65, 1, z);
      dummy.rotation.set(0, Math.PI / 2, 0);
      dummy.scale.set(2, 2, 2);
      dummy.updateMatrix();

      bulbDummy.position.set(80, 20, z);
      bulbDummy.scale.set(0.65, 0.65, 0.65);
      bulbDummy.updateMatrix();

      instancedMeshRefs.current.forEach((meshRef) => {
        if (meshRef) meshRef.setMatrixAt(instanceIdx, dummy.matrix);
      });
      if (bulbInstancedRef.current) {
        bulbInstancedRef.current.setMatrixAt(instanceIdx, bulbDummy.matrix);
      }
      instanceIdx++;
    });

    instancedMeshRefs.current.forEach((meshRef) => {
      if (meshRef) meshRef.instanceMatrix.needsUpdate = true;
    });
    if (bulbInstancedRef.current) {
      bulbInstancedRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [meshes]);

  return (
    <group name="corniche-streetlights-instanced">
      {/* 1. Instanced Streetlight Geometry (1 draw call per submesh) */}
      {meshes.map((m, idx) => (
        <instancedMesh
          key={idx}
          ref={(el) => {
            instancedMeshRefs.current[idx] = el;
          }}
          args={[m.geometry, m.material, lampCount]}
          frustumCulled={false}
        />
      ))}

      {/* 2. Instanced Warm Golden Glowing Lamp Fixture Bulbs (Bloom reactive) */}
      <instancedMesh
        ref={bulbInstancedRef}
        args={[undefined, undefined, lampCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#ffcc77"
          emissive="#ffcc77"
          emissiveIntensity={3.8}
          toneMapped={false}
          roughness={0.2}
        />
      </instancedMesh>
    </group>
  );
}

useGLTF.preload(STREETLIGHT_PATH);
