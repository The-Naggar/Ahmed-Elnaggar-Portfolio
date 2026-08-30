import { useMemo, useRef, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { useTexture, Stars, Environment as DreiEnvironment } from "@react-three/drei";
import * as THREE from "three";
import { Water } from "three-stdlib";

extend({ Water });

declare module "@react-three/fiber" {
  interface ThreeElements {
    water: any;
  }
}

export default function Environment() {
  const waterRef = useRef<any>(null);
  const waterNormals = useTexture(
    "/waternormals.jpg",
    (texture) => {
      if (texture instanceof THREE.Texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    }
  );

  const waterConfig = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(0, 1, -1).normalize(), // Pointing towards the moon
      sunColor: 0xcce0ff, // Moon light color
      waterColor: 0x020813, // Deep Nile dark blue
      distortionScale: 3.7, // Breaks up the repetition
      fog: false,
      format: parseInt(THREE.RGBAFormat.toString(), 10),
    }),
    [waterNormals]
  );

  useFrame((_, delta) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.time.value += delta * 0.5;
    }
  });

  return (
    <>
      {/* Deep midnight background */}
      <color attach="background" args={["#02040b"]} />

      {/* Atmospheric distance fog preserving visibility of distant buildings & tower */}
      <fog attach="fog" args={["#02040b", 320, 680]} />

      {/* Built-in procedural night environment for rich water reflections & ambient fill (0 byte asset overhead) */}
      <DreiEnvironment preset="night" environmentIntensity={0.55} />

      {/* Night Sky Stars */}
      <Stars
        radius={350}
        depth={100}
        count={3500}
        factor={4}
        saturation={0.5}
        fade
        speed={1}
      />

      {/* Ambient nocturnal fill light for building visibility */}
      <ambientLight intensity={1.4} color="#25334a" />

      {/* Main Moonlight Directional Beam coming from the Moon towards the river */}
      <directionalLight
        position={[-25, 90, -350]}
        intensity={2}
        color="#d8e8ff"
      />

      {/* Front fill light behind camera */}
      <directionalLight
        position={[0, 35, 50]}
        intensity={1}
        color="#cbd5e1"
      />

      {/* ── 1. RIVER BASIN (120 width x 740 length, strictly contained between seawalls) ── */}
      <water
        ref={waterRef}
        args={[new THREE.PlaneGeometry(120, 740), waterConfig]}
        rotation-x={-Math.PI / 2}
        position={[0, -0.4, -70]}
      />

      {/* ── 2. RIVERBANKS & CITY LANDMASSES (Solid ground beyond roads) ── */}
      {/* Left City Landmass (Extends from riverbank X=-60 outwards) */}
      <mesh position={[-260, 0.5, -70]}>
        <boxGeometry args={[400, 2, 740]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.9} />
      </mesh>

      {/* Right City Landmass (Extends from riverbank X=60 outwards) */}
      <mesh position={[260, 0.5, -70]}>
        <boxGeometry args={[400, 2, 740]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.9} />
      </mesh>

      {/* Left Seawall */}
      <mesh position={[-59, 0.2, -70]}>
        <boxGeometry args={[2, 1.5, 740]} />
        <meshStandardMaterial color="#1a1c20" roughness={0.9} />
      </mesh>

      {/* Right Seawall */}
      <mesh position={[59, 0.2, -70]}>
        <boxGeometry args={[2, 1.5, 740]} />
        <meshStandardMaterial color="#1a1c20" roughness={0.9} />
      </mesh>

      {/* ── 3. RAISED CORNICHE WALLS (BARRIERS) ── */}
      {/* Left Raised Barrier */}
      <mesh position={[-60.5, 1.25, -70]}>
        <boxGeometry args={[1, 1.5, 740]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.9} />
      </mesh>

      {/* Right Raised Barrier */}
      <mesh position={[60.5, 1.25, -70]}>
        <boxGeometry args={[1, 1.5, 740]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.9} />
      </mesh>

      {/* ── 4. PAINT THE ROAD LANES (DASHED LINES) ── */}
      {/* ── 4. HIGH PERFORMANCE INSTANCED ROAD DIVIDER DASHES ── */}
      <RoadDashes />

      {/* ── 5. SOLID OUTER LANE BOUNDARIES ── */}
      {/* LEFT ROAD: Solid Outer Boundary Line */}
      <mesh position={[-100, 1.51, -70]}>
        <boxGeometry args={[0.4, 0.05, 740]} />
        <meshBasicMaterial color="#ffffff" opacity={0.4} transparent />
      </mesh>

      {/* RIGHT ROAD: Solid Outer Boundary Line */}
      <mesh position={[100, 1.51, -70]}>
        <boxGeometry args={[0.4, 0.05, 740]} />
        <meshBasicMaterial color="#ffffff" opacity={0.4} transparent />
      </mesh>
    </>
  );
}

function RoadDashes() {
  const dashCount = 62;
  const leftMeshRef = useRef<THREE.InstancedMesh>(null);
  const rightMeshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (leftMeshRef.current && rightMeshRef.current) {
      for (let i = 0; i < dashCount; i++) {
        const z = 300 - i * 12;

        dummy.position.set(-80, 1.51, z);
        dummy.updateMatrix();
        leftMeshRef.current.setMatrixAt(i, dummy.matrix);

        dummy.position.set(80, 1.51, z);
        dummy.updateMatrix();
        rightMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      leftMeshRef.current.instanceMatrix.needsUpdate = true;
      rightMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  return (
    <>
      <instancedMesh ref={leftMeshRef} args={[undefined, undefined, dashCount]} frustumCulled={false}>
        <boxGeometry args={[0.4, 0.05, 4]} />
        <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
      </instancedMesh>
      <instancedMesh ref={rightMeshRef} args={[undefined, undefined, dashCount]} frustumCulled={false}>
        <boxGeometry args={[0.4, 0.05, 4]} />
        <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
      </instancedMesh>
    </>
  );
}
