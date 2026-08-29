import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Clone } from "@react-three/drei";
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
      scale: isCruising ? [3.6, 3.6, 3.6] : [4.4, 4.4, 4.4],
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
      scale: isCruising ? [3.6, 3.6, 3.6] : [4.4, 4.4, 4.4],
    });
  }

  return cars;
}

const STATIC_CARS = generateCars();

export default function Traffic() {
  const redCarData = useGLTF(RED_CAR_PATH);
  const purpleCarData = useGLTF(PURPLE_CAR_PATH);
  const carList = useMemo(() => STATIC_CARS, []);

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

  return (
    <group>
      {carList.map((car) => (
        <MovingCar
          key={car.id}
          car={car}
          sourceScene={
            car.modelType === "red" ? redCarData.scene : purpleCarData.scene
          }
        />
      ))}
    </group>
  );
}

function MovingCar({
  car,
  sourceScene,
}: {
  car: CarData;
  sourceScene: THREE.Group;
}) {
  const ref = useRef<THREE.Group>(null);
  const zPos = useRef(car.initialZ);

  useFrame((_, delta) => {
    if (ref.current) {
      if (car.direction === 1) {
        // Northbound (towards -Z)
        zPos.current -= car.speed * delta;
        if (zPos.current < -440) {
          zPos.current = 280;
        }
      } else {
        // Southbound (towards +Z)
        zPos.current += car.speed * delta;
        if (zPos.current > 280) {
          zPos.current = -440;
        }
      }
      ref.current.position.z = zPos.current;
    }
  });

  return (
    <group
      ref={ref}
      position={[car.x, 1.5, car.initialZ]}
      rotation={[0, car.rotationY, 0]}
    >
      <group rotation={[0, Math.PI, 0]}>
        <Clone object={sourceScene} scale={car.scale} />
      </group>

      {/* Glowing Headlights (Forward) */}
      <mesh position={[-1.2, 0.8, -6.4]}>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshBasicMaterial color="#ffffdd" />
      </mesh>
      <mesh position={[1.2, 0.8, -6.4]}>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshBasicMaterial color="#ffffdd" />
      </mesh>

      {/* Glowing Taillights (Backward) */}
      <mesh position={[-1.2, 0.8, 6.4]}>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshBasicMaterial color="#ff2222" />
      </mesh>
      <mesh position={[1.2, 0.8, 6.4]}>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshBasicMaterial color="#ff2222" />
      </mesh>
    </group>
  );
}

useGLTF.preload(RED_CAR_PATH);
useGLTF.preload(PURPLE_CAR_PATH);
