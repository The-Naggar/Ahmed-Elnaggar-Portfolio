import { useState, useEffect, useRef } from "react";
import { useGLTF, Clone } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ══════════════════════════════════════════════════════════════
// 🎮 1. KEYBOARD CONTROLS HOOK (WASD & ARROWS)
// ══════════════════════════════════════════════════════════════
function useKeys() {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp")
        setKeys((k) => ({ ...k, forward: true }));
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown")
        setKeys((k) => ({ ...k, backward: true }));
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft")
        setKeys((k) => ({ ...k, left: true }));
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight")
        setKeys((k) => ({ ...k, right: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp")
        setKeys((k) => ({ ...k, forward: false }));
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown")
        setKeys((k) => ({ ...k, backward: false }));
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft")
        setKeys((k) => ({ ...k, left: false }));
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight")
        setKeys((k) => ({ ...k, right: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
}

// ══════════════════════════════════════════════════════════════
// ⛵ 2. CONTROLLABLE PLAYER BOAT COMPONENT
// ══════════════════════════════════════════════════════════════
const BOAT_PATH = "/3d-models/boat_1.glb";
const BOAT_BASE_Y = 3.5;

export default function Boat() {
  const boatRef = useRef<THREE.Group>(null);
  const keys = useKeys();
  const boatData = useGLTF(BOAT_PATH);

  const cameraPosRef = useRef(new THREE.Vector3(0, 16.5, 288));
  const cameraLookAtRef = useRef(new THREE.Vector3(0, 4, 220));

  // Movement & Steering Dynamics
  const MOVEMENT_SPEED = 35;
  const TURN_SPEED = 1.8;

  useFrame((state, delta) => {
    if (!boatRef.current) return;

    // 1. DRIVING MECHANICS (Relative to Boat Heading)
    if (keys.forward) {
      boatRef.current.translateZ(-MOVEMENT_SPEED * delta);
    }
    if (keys.backward) {
      boatRef.current.translateZ(MOVEMENT_SPEED * 0.5 * delta);
    }
    if (keys.left) {
      boatRef.current.rotation.y += TURN_SPEED * delta;
    }
    if (keys.right) {
      boatRef.current.rotation.y -= TURN_SPEED * delta;
    }

    // 2. GENTLE RIVER WATER BOBBING & PITCH/ROLL PHYSICS
    const t = state.clock.getElapsedTime();
    const isMoving = keys.forward || keys.backward;
    const waveBob = Math.sin(t * 2.2) * 0.12;
    const waveRoll = Math.sin(t * 1.6) * 0.03 + (keys.left ? 0.04 : keys.right ? -0.04 : 0);
    const wavePitch = (isMoving ? -0.03 : 0) + Math.cos(t * 1.8) * 0.02;

    boatRef.current.position.y = BOAT_BASE_Y + waveBob;
    boatRef.current.rotation.z = waveRoll;
    boatRef.current.rotation.x = wavePitch;

    // 3. RIVER BASIN CONFINEMENT (Keeps boat safely between Nile seawalls)
    // River X bounds: [-52, +52], Z bounds: [+260, -420]
    boatRef.current.position.x = Math.max(-52, Math.min(52, boatRef.current.position.x));
    boatRef.current.position.z = Math.max(-420, Math.min(260, boatRef.current.position.z));

    // 4. DESTINATION TRIGGER ZONES
    const pos = boatRef.current.position;

    // Zone 1: OVERVIEW Building (Z ~ 50, Left Bank X < -35)
    if (pos.z < 90 && pos.z > 10 && pos.x < -35) {
      // Trigger Overview hub
    }
    // Zone 2: PROJECTS Building (Z ~ -80, Right Bank X > 35)
    if (pos.z < -40 && pos.z > -120 && pos.x > 35) {
      // Trigger Projects hub
    }
    // Zone 3: SKILLS Building (Z ~ -210, Left Bank X < -35)
    if (pos.z < -170 && pos.z > -250 && pos.x < -35) {
      // Trigger Skills hub
    }
    // Zone 4: EXPERIENCE Building (Z ~ -310, Right Bank X > 35)
    // 5. DEDICATED CINEMATIC BOAT CHASE CAMERA (Always Active)
    const boatPos = boatRef.current.position;
    const boatRotY = boatRef.current.rotation.y;
    const yAxis = new THREE.Vector3(0, 1, 0);

    // Ideal camera position behind the boat along its heading
    const camOffset = new THREE.Vector3(0, 13, 48);
    camOffset.applyAxisAngle(yAxis, boatRotY);
    const targetCamPos = boatPos.clone().add(camOffset);

    // Ideal camera target point ahead of the boat bow
    const lookOffset = new THREE.Vector3(0, 3.5, -20);
    lookOffset.applyAxisAngle(yAxis, boatRotY);
    const targetLookAt = boatPos.clone().add(lookOffset);

    // Smooth interpolation (lerp)
    const lerpRate = Math.min(delta * 5.0, 0.18);
    cameraPosRef.current.lerp(targetCamPos, lerpRate);
    cameraLookAtRef.current.lerp(targetLookAt, lerpRate * 1.2);

    state.camera.position.copy(cameraPosRef.current);
    state.camera.lookAt(cameraLookAtRef.current);
  });

  return (
    // Start the player boat at the far upstream river entrance: [0, 3.5, 240]
    <group ref={boatRef} name="player-boat" position={[0, BOAT_BASE_Y, 240]} rotation={[0, 0, 0]}>
      {/* 1. The Boat Model (Flipped 180° so bow points forward) */}
      <Clone
        object={boatData.scene}
        scale={[10, 10, 10]}
        rotation={[0, Math.PI, 0]}
      />

      {/* 2. Character Model / Captain Anchor */}
      <group position={[0, 0.1, 0]} scale={[3, 3, 3]}>
        {/* Placeholder captain silhouette / lantern bearer */}
        <mesh position={[0, 0.05, 1]}>
          <cylinderGeometry args={[0.3, 0.4, 1.2, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1, 1]}>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.5} />
        </mesh>
      </group>

      {/* 3. Warm Atmospheric Boat Lantern Glow */}
      <pointLight
        position={[0, 2.5, -1.0]}
        color="#fbbf24"
        intensity={3.5}
        distance={28}
        decay={1.8}
      />

      {/* 4. Forward Navigation Light (Illuminates water ahead of boat) */}
      <pointLight
        position={[0, 1.8, -4.5]}
        color="#e0f2fe"
        intensity={2.5}
        distance={35}
        decay={1.6}
      />
    </group>
  );
}

useGLTF.preload(BOAT_PATH);
