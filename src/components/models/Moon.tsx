import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const MOON_PATH = "/3d-models/moon.glb";

export default function Moon() {
  const { scene } = useGLTF(MOON_PATH);
  const moonGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const originalMat = mesh.material as THREE.MeshStandardMaterial;
          // Keep original texture map from the GLB
          const texture = originalMat.map;

          // Create a glowing lunar material that doesn't get swallowed by fog
          const lunarMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            emissive: new THREE.Color("#fff7db"),
            emissiveMap: texture || null,
            emissiveIntensity: 0.85,
            roughness: 0.8,
            metalness: 0.1,
            fog: false, // Ensure moon is bright and clear across any fog distance
          });

          mesh.material = lunarMaterial;
        }
      }
    });
  }, [scene]);

  // Subtle rotation to make the moon feel alive 
  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={moonGroupRef} position={[-60, 65, -400]}>
      {/* Centered Lunar Sphere with Texture */}
      <group ref={coreRef} position={[0, -18, 0]}>
        <primitive
          object={scene}
          scale={[25, 25, 25]}
        />
      </group>

      {/* Atmospheric Lunar Halo / Glow Aura */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[52, 52]} />
        <meshBasicMaterial
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
          map={createGlowTexture()}
        />
      </mesh>

      {/* Wider subtle atmospheric outer haze */}
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[110, 110]} />
        <meshBasicMaterial
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
          map={createGlowTexture()}
        />
      </mesh>

      {/* Moon Light Source casting luminescence across the sky and Nile */}
      <pointLight
        color="#e8f2ff"
        intensity={4}
        distance={350}
        decay={1.2}
      />
    </group>
  );
}

// Generate procedural soft circular gradient for the moon halo
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 250, 225, 1)");
    gradient.addColorStop(0.2, "rgba(220, 235, 255, 0.7)");
    gradient.addColorStop(0.5, "rgba(180, 215, 255, 0.25)");
    gradient.addColorStop(1, "rgba(10, 30, 80, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

useGLTF.preload(MOON_PATH);
