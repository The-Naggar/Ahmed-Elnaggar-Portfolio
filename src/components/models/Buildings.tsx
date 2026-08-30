import { useGLTF, Clone } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const BUILDING_1_PATH = "/3d-models/building_1.glb";
const BUILDING_2_PATH = "/3d-models/building_2.glb";

// ══════════════════════════════════════════════════════════════
// 🎨 PROCEDURAL 2D SIGNBOARD TEXTURE GENERATOR
// Matches exact reference image: high-contrast serif typography,
// double border, skyline graphic, and custom background themes.
// ══════════════════════════════════════════════════════════════
function createSignTexture(
  prefix: string,
  title: string,
  num: string,
  baseColor: string,
  darkColor: string,
  accentColor: string
): THREE.CanvasTexture {
  const width = 1200;
  const height = 220;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // 1. Dark outer border / frame
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, width, height);

  // 2. Main Background with Gradient (replacing red with building's theme)
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, darkColor);
  grad.addColorStop(0.5, baseColor);
  grad.addColorStop(1, darkColor);
  ctx.fillStyle = grad;
  ctx.fillRect(8, 8, width - 16, height - 16);

  // 3. Subtle Halftone / Matrix Grid Texture
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  for (let x = 12; x < width - 12; x += 10) {
    for (let y = 12; y < height - 12; y += 8) {
      ctx.fillRect(x, y, 4, 2);
    }
  }

  // 4. White City Skyline / Silhouette along bottom (matching reference image)
  ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
  ctx.beginPath();
  ctx.moveTo(12, height - 10);
  const skylineHeights = [
    25, 45, 20, 60, 35, 50, 75, 40, 65, 30, 80, 50, 35, 70, 45, 90, 60, 40, 75, 50, 30, 60, 40, 20,
  ];
  const step = (width - 24) / (skylineHeights.length - 1);
  skylineHeights.forEach((h, i) => {
    const x = 12 + i * step;
    ctx.lineTo(x, height - 10 - h);
    ctx.lineTo(x + step * 0.7, height - 10 - h);
  });
  ctx.lineTo(width - 12, height - 10);
  ctx.closePath();
  ctx.fill();

  // 5. Crisp Double Frame Border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 3;
  ctx.strokeRect(14, 14, width - 28, height - 28);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  // 6. Typography - High Contrast Bold Serif (Matching exact "THE LOOP 125" look)
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  // Prefix (e.g. "THE")
  ctx.font = "italic 700 32px 'Playfair Display', 'Cinzel', 'Bodoni MT', 'Didot', 'Georgia', serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(prefix, 45, 42);

  // Main Title (e.g. "OVERVIEW", "PROJECTS", "SKILLS", "EXPERIENCE")
  ctx.font = "900 95px 'Playfair Display', 'Cinzel', 'Bodoni MT', 'Didot', 'Georgia', serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(title, 135, height / 2 + 6);

  // Number Badge on Right (e.g. "01", "02", "03", "04")
  ctx.font = "900 90px 'Playfair Display', 'Cinzel', 'Bodoni MT', 'Didot', 'Georgia', serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(num, width - 45, height / 2 + 6);

  // Corner Accents / Rivets
  ctx.fillStyle = accentColor;
  [
    [18, 18],
    [width - 18, 18],
    [18, height - 18],
    [width - 18, height - 18],
  ].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// ══════════════════════════════════════════════════════════════
// 🏢 LABELED BUILDING WRAPPER (Building + 2D Signboard Panel)
// ══════════════════════════════════════════════════════════════
interface LabeledBuildingProps {
  modelScene: THREE.Object3D;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  signTexture: THREE.CanvasTexture;
  signPosition: [number, number, number];
  signRotation?: [number, number, number];
  signSize: [number, number];
  children?: React.ReactNode;
}

function LabeledBuilding({
  modelScene,
  position,
  rotation,
  scale,
  signTexture,
  signPosition,
  signRotation,
  signSize,
}: LabeledBuildingProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* 1. The Building Model */}
      <Clone object={modelScene} scale={scale} />

      {/* 2. Integrated 2D Signboard Rectangle (Bloom-reactive emissive) */}
      <mesh position={signPosition} rotation={signRotation || [0, 0, 0]}>
        <planeGeometry args={signSize} />
        <meshStandardMaterial
          map={signTexture}
          emissiveMap={signTexture}
          emissive="#ffffff"
          emissiveIntensity={2.2}
          roughness={0.25}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Buildings() {
  const b1 = useGLTF(BUILDING_1_PATH);
  const b2 = useGLTF(BUILDING_2_PATH);

  // Generate the 4 2D Signboard Textures matching the exact reference style
  const overviewSign = useMemo(
    () => createSignTexture("THE", "OVERVIEW", "01", "#0284c7", "#082f49", "#38bdf8"),
    []
  );
  const projectsSign = useMemo(
    () => createSignTexture("THE", "PROJECTS", "02", "#c026d3", "#4a044e", "#f472b6"),
    []
  );
  const skillsSign = useMemo(
    () => createSignTexture("THE", "SKILLS", "03", "#059669", "#064e3b", "#34d399"),
    []
  );
  const experienceSign = useMemo(
    () => createSignTexture("THE", "EXPERIENCE", "04", "#d97706", "#451a03", "#fbbf24"),
    []
  );

  // Hide the background skyscraper / tower meshes from building_2 so only the brick building displays
  useMemo(() => {
    b2.scene.traverse((child: any) => {
      if (child.isMesh) {
        if (
          ["Object_9", "Object_11", "Object_59"].includes(child.name) ||
          ["Object_9", "Object_11", "Object_59"].includes(child.geometry?.name)
        ) {
          child.visible = false;
        }
        if (child.geometry) {
          child.geometry.computeBoundingBox();
          if (child.geometry.boundingBox && child.geometry.boundingBox.max.y > 2.0) {
            child.visible = false;
          }
        }
      }
    });
  }, [b2]);

  // Enhance building materials so they catch moonlight and architectural illumination
  useEffect(() => {
    [b1.scene, b2.scene].forEach((scene) => {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const mat = Array.isArray(child.material)
            ? child.material[0]
            : child.material;
          if (mat) {
            mat.roughness = 0.45;
            mat.metalness = 0.25;
          }
        }
      });
    });
  }, [b1, b2]);

  return (
    <group>
      {/* ── 1. OVERVIEW (Left Side, Closest: Z = +50) ── */}
      <LabeledBuilding
        modelScene={b1.scene}
        position={[-170, 0.5, 50]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[0.38, 0.38, 0.38]}
        signTexture={overviewSign}
        signPosition={[22, 80, -18]}
        signRotation={[0, Math.PI / 2, 0]}
        signSize={[37, 7]}
      />

      {/* ── 2. PROJECTS (Right Side: Z = -80) ── */}
      <LabeledBuilding
        modelScene={b2.scene}
        position={[120, -10, -80]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[35, 35, 35]}
        signTexture={projectsSign}
        signPosition={[20, 78, -40]}
        signRotation={[0, Math.PI / 2, 0]}
        signSize={[82, 11]}
      />

      {/* ── 3. SKILLS (Left Side: Z = -210) ── */}
      <LabeledBuilding
        modelScene={b2.scene}
        position={[-130, -10, -260]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[35, 35, 35]}
        signTexture={skillsSign}
        signPosition={[-62, 78, -40]}
        signRotation={[0, -Math.PI / 2, 0]}
        signSize={[82, 11]}
      />

      {/* ── 4. EXPERIENCE (Right Side, Closest to Tower: Z = -310) ── */}
      <LabeledBuilding
        modelScene={b1.scene}
        position={[120, 0.5, -310]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[0.6, 0.6, 0.6]}
        signTexture={experienceSign}
        signPosition={[35, 128, -27]}
        signRotation={[0, Math.PI / 2, 0]}
        signSize={[58, 8]}
      />
    </group>
  );
}

useGLTF.preload(BUILDING_1_PATH);
useGLTF.preload(BUILDING_2_PATH);
