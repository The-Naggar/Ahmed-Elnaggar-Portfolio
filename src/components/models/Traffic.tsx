import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const RED_CAR_PATH = "/3d-models/redCar.glb";
const PURPLE_CAR_PATH = "/3d-models/purpleCar.glb";

interface CarData {
  id: number;
  x: number;
  initialZ: number;
  speed: number;
  direction: 1 | -1;
  rotationY: number;
  modelType: "red" | "purple";
  scale: [number, number, number];
}

// Generate 14 cars (7 cars on each highway, distributed across lanes within Z = [280, -440])
function generateCars(): CarData[] {
  const cars: CarData[] = [];
  let idCounter = 1;
  const totalPerHighway = 7;
  const roadSpan = 720; // 280 - (-440)
  const spacing = roadSpan / totalPerHighway;

  // ── Left Highway (Southbound towards +Z) ──
  for (let i = 0; i < totalPerHighway; i++) {
    const isCruising = i % 2 === 0;
    cars.push({
      id: idCounter++,
      x: isCruising ? -70 : -90,
      initialZ: -440 + i * spacing,
      speed: isCruising ? 35 : 45,
      direction: -1,
      rotationY: Math.PI,
      modelType: isCruising ? "red" : "purple",
      scale: isCruising ? [2, 4, 4] : [4.4, 4.4, 6],
    });
  }

  // ── Right Highway (Northbound towards -Z) ──
  for (let i = 0; i < totalPerHighway; i++) {
    const isCruising = i % 2 === 0;
    cars.push({
      id: idCounter++,
      x: isCruising ? 70 : 90,
      initialZ: 280 - i * spacing,
      speed: isCruising ? 35 : 45,
      direction: 1,
      rotationY: 0,
      modelType: isCruising ? "red" : "purple",
      scale: isCruising ? [2, 4, 4] : [4.4, 4.4, 6],
    });
  }

  return cars;
}

const STATIC_CARS = generateCars();

// ── Zero-GC Scratch Objects for per-frame matrix calculation ──
const _carDummy = new THREE.Object3D();
const _lightDummy = new THREE.Object3D();

export default function Traffic() {
  const redCarData = useGLTF(RED_CAR_PATH);
  const purpleCarData = useGLTF(PURPLE_CAR_PATH);

  const carList = useMemo(() => STATIC_CARS, []);

  // Separate red and purple cars for dedicated instancing
  const redCars = useMemo(() => carList.filter((c) => c.modelType === "red"), [carList]);
  const purpleCars = useMemo(() => carList.filter((c) => c.modelType === "purple"), [carList]);

  // Track live Z positions for all 14 cars
  const carZPositions = useRef<number[]>(STATIC_CARS.map((c) => c.initialZ));

  // Extract meshes from GLB scenes
  const redMeshes = useMemo(() => {
    const list: { geometry: THREE.BufferGeometry; material: THREE.Material }[] = [];
    redCarData.scene.traverse((child: any) => {
      if (child.isMesh && child.geometry && child.material) {
        list.push({ geometry: child.geometry, material: child.material });
      }
    });
    return list;
  }, [redCarData]);

  const purpleMeshes = useMemo(() => {
    const list: { geometry: THREE.BufferGeometry; material: THREE.Material }[] = [];
    purpleCarData.scene.traverse((child: any) => {
      if (child.isMesh && child.geometry && child.material) {
        list.push({ geometry: child.geometry, material: child.material });
      }
    });
    return list;
  }, [purpleCarData]);

  const redInstancedRefs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const purpleInstancedRefs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const headlightsRef = useRef<THREE.InstancedMesh | null>(null);
  const taillightsRef = useRef<THREE.InstancedMesh | null>(null);

  // Configure glossy car paint for both car models
  useEffect(() => {
    [redCarData.scene, purpleCarData.scene].forEach((scene) => {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const mat = Array.isArray(child.material)
            ? child.material[0]
            : child.material;
          if (mat) {
            mat.metalness = 0.35;
            mat.roughness = 0.25;
          }
        }
      });
    });
  }, [redCarData, purpleCarData]);

  // ── SINGLE UNIFIED useFrame LOOP (Updates all 14 cars + 56 lights in 1 tick) ──
  useFrame((_, delta) => {
    let redIdx = 0;
    let purpleIdx = 0;
    let lightIdx = 0;

    carList.forEach((car, i) => {
      // 1. Advance position along highway
      if (car.direction === 1) {
        // Northbound (towards -Z)
        carZPositions.current[i] -= car.speed * delta;
        if (carZPositions.current[i] < -440) {
          carZPositions.current[i] = 280;
        }
      } else {
        // Southbound (towards +Z)
        carZPositions.current[i] += car.speed * delta;
        if (carZPositions.current[i] > 280) {
          carZPositions.current[i] = -440;
        }
      }

      const currentZ = carZPositions.current[i];
      const posY = car.modelType === "purple" ? 4 : 1.5;
      const lightPosY = car.modelType === "purple" ? 4.8 : 2.3;

      // 2. Compute Car Instance Matrix
      _carDummy.position.set(car.x, posY, currentZ);
      _carDummy.rotation.set(0, car.rotationY + Math.PI, 0); // Model facing correction
      _carDummy.scale.set(...car.scale);
      _carDummy.updateMatrix();

      if (car.modelType === "red") {
        redInstancedRefs.current.forEach((mesh) => {
          if (mesh) mesh.setMatrixAt(redIdx, _carDummy.matrix);
        });
        redIdx++;
      } else {
        purpleInstancedRefs.current.forEach((mesh) => {
          if (mesh) mesh.setMatrixAt(purpleIdx, _carDummy.matrix);
        });
        purpleIdx++;
      }

      // 3. Compute Headlights & Taillights Matrices (Bloom emissive spheres)
      const heading = car.rotationY; // 0 for Northbound (-Z), PI for Southbound (+Z)
      const forwardZ = heading === 0 ? -1 : 1;

      // Left & Right Headlights (forward)
      [-1.2, 1.2].forEach((offsetSide) => {
        _lightDummy.position.set(
          car.x + (heading === 0 ? offsetSide : -offsetSide),
          lightPosY,
          currentZ + forwardZ * -6.4
        );
        _lightDummy.scale.set(0.38, 0.38, 0.38);
        _lightDummy.updateMatrix();
        if (headlightsRef.current) {
          headlightsRef.current.setMatrixAt(lightIdx, _lightDummy.matrix);
        }

        // Corresponding Taillight (backward)
        _lightDummy.position.set(
          car.x + (heading === 0 ? offsetSide : -offsetSide),
          lightPosY,
          currentZ + forwardZ * 6.4
        );
        _lightDummy.scale.set(0.38, 0.38, 0.38);
        _lightDummy.updateMatrix();
        if (taillightsRef.current) {
          taillightsRef.current.setMatrixAt(lightIdx, _lightDummy.matrix);
        }

        lightIdx++;
      });
    });

    // Notify GPU of instance matrix buffer updates
    redInstancedRefs.current.forEach((mesh) => {
      if (mesh) mesh.instanceMatrix.needsUpdate = true;
    });
    purpleInstancedRefs.current.forEach((mesh) => {
      if (mesh) mesh.instanceMatrix.needsUpdate = true;
    });
    if (headlightsRef.current) {
      headlightsRef.current.instanceMatrix.needsUpdate = true;
    }
    if (taillightsRef.current) {
      taillightsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group name="highway-traffic-instanced">
      {/* 1. Red Cars Instanced Mesh */}
      {redMeshes.map((m, idx) => (
        <instancedMesh
          key={`red-${idx}`}
          ref={(el) => {
            redInstancedRefs.current[idx] = el;
          }}
          args={[m.geometry, m.material, redCars.length]}
          frustumCulled={false}
        />
      ))}

      {/* 2. Purple Cars Instanced Mesh */}
      {purpleMeshes.map((m, idx) => (
        <instancedMesh
          key={`purple-${idx}`}
          ref={(el) => {
            purpleInstancedRefs.current[idx] = el;
          }}
          args={[m.geometry, m.material, purpleCars.length]}
          frustumCulled={false}
        />
      ))}

      {/* 3. Instanced Glowing Headlights (28 instances, bloom reactive) */}
      <instancedMesh
        ref={headlightsRef}
        args={[undefined, undefined, carList.length * 2]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color="#ffffdd"
          emissive="#ffffdd"
          emissiveIntensity={3.6}
          toneMapped={false}
          roughness={0.2}
        />
      </instancedMesh>

      {/* 4. Instanced Glowing Taillights (28 instances, bloom reactive) */}
      <instancedMesh
        ref={taillightsRef}
        args={[undefined, undefined, carList.length * 2]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color="#ff2222"
          emissive="#ff2222"
          emissiveIntensity={3.6}
          toneMapped={false}
          roughness={0.2}
        />
      </instancedMesh>
    </group>
  );
}

useGLTF.preload(RED_CAR_PATH);
useGLTF.preload(PURPLE_CAR_PATH);
