import { useState, useEffect, useRef, useMemo } from "react";
import { useGLTF, Clone } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import OnboardingDialog from "../OnboardingDialog";
import { useSceneStore } from "../../utils/useSceneStore";

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

// ── Zero-GC Scratch Vectors for per-frame camera math ──
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const _camOffset = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _lookOffset = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

export default function Boat() {
  const boatRef = useRef<THREE.Group>(null);
  const keys = useKeys();
  const boatData = useGLTF(BOAT_PATH);

  // Retrieve last saved boat position & rotation from store
  const savedTransform = useSceneStore((state) => state.savedBoatTransform);
  const isFirstFrame = useRef(true);

  // Initialize camera refs from saved transform
  const cameraPosRef = useRef(new THREE.Vector3(0, 16.5, 288));
  const cameraLookAtRef = useRef(new THREE.Vector3(0, 4, 220));

  // Movement & Steering Dynamics
  const MOVEMENT_SPEED = 35;
  const TURN_SPEED = 1.8;

  useFrame((state, delta) => {
    if (!boatRef.current) return;

    // 0. FIRST FRAME INITIALIZATION (Instantly snap camera & boat to saved transform)
    if (isFirstFrame.current) {
      isFirstFrame.current = false;
      const cur = useSceneStore.getState().savedBoatTransform;
      boatRef.current.position.set(cur.position[0], cur.position[1], cur.position[2]);
      boatRef.current.rotation.set(0, cur.rotationY, 0);

      _camOffset.set(0, 13, 48).applyAxisAngle(Y_AXIS, cur.rotationY);
      _targetCamPos.copy(boatRef.current.position).add(_camOffset);
      cameraPosRef.current.copy(_targetCamPos);

      _lookOffset.set(0, 3.5, -20).applyAxisAngle(Y_AXIS, cur.rotationY);
      _targetLookAt.copy(boatRef.current.position).add(_lookOffset);
      cameraLookAtRef.current.copy(_targetLookAt);

      state.camera.position.copy(_targetCamPos);
      state.camera.lookAt(_targetLookAt);
    }

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

    // 4. CONTINUOUS STORE SYNCHRONIZATION (Guarantees position is never lost on unmount)
    const storeTransform = useSceneStore.getState().savedBoatTransform;
    storeTransform.position[0] = boatRef.current.position.x;
    storeTransform.position[1] = boatRef.current.position.y;
    storeTransform.position[2] = boatRef.current.position.z;
    storeTransform.rotationY = boatRef.current.rotation.y;

    // 5. ZERO-GC DEDICATED CINEMATIC BOAT CHASE CAMERA (Always Active)
    const boatPos = boatRef.current.position;
    const boatRotY = boatRef.current.rotation.y;

    // Ideal camera position behind the boat along its heading (in-place mutation)
    _camOffset.set(0, 13, 48).applyAxisAngle(Y_AXIS, boatRotY);
    _targetCamPos.copy(boatPos).add(_camOffset);

    // Ideal camera target point ahead of the boat bow (in-place mutation)
    _lookOffset.set(0, 3.5, -20).applyAxisAngle(Y_AXIS, boatRotY);
    _targetLookAt.copy(boatPos).add(_lookOffset);

    // Smooth interpolation (lerp)
    const lerpRate = Math.min(delta * 5.0, 0.18);
    cameraPosRef.current.lerp(_targetCamPos, lerpRate);
    cameraLookAtRef.current.lerp(_targetLookAt, lerpRate * 1.2);

    state.camera.position.copy(cameraPosRef.current);
    state.camera.lookAt(cameraLookAtRef.current);
  });

  return (
    // Spawn player boat at its current/saved Nile location
    <group
      ref={boatRef}
      name="player-boat"
      position={savedTransform.position}
      rotation={[0, savedTransform.rotationY, 0]}
    >
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
        {/* Warm Golden Emissive Lantern Sphere */}
        <mesh position={[0, 1, 1]}>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={3.2}
            toneMapped={false}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* 3. Onboarding RPG Tutorial Dialog (Floating directly above captain) */}
      <OnboardingDialog
        position={[5, 15, 3.0]}
        isCruising={keys.forward || keys.backward || keys.left || keys.right}
      />

      {/* 4. Forward Navigation Bow Light Mesh (Bloom reactive) */}
      <mesh position={[0, 1.8, -4.5]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive="#e0f2fe"
          emissiveIntensity={3.5}
          toneMapped={false}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(BOAT_PATH);
