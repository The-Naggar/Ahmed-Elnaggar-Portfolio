import { create } from "zustand";

export type SceneType =
  | "river"
  | "overview"
  | "projects"
  | "skills"
  | "experience"
  | "tower";

export type TriggerType =
  | "overview"
  | "projects"
  | "skills"
  | "experience"
  | "tower"
  | null;

export interface DockInfo {
  id: "overview" | "projects" | "skills" | "experience" | "tower";
  title: string;
  pos: [number, number, number];
  radius: number;
}

export const DOCKS: DockInfo[] = [
  // 1. OVERVIEW (Left Bank: Building at X=-170, Z=50)
  { id: "overview", title: "01 · The Overview", pos: [-34, 0, 50], radius: 22 },
  // 2. PROJECTS (Right Bank: Building at X=120, Z=-80)
  { id: "projects", title: "02 · The Projects", pos: [34, 0, -80], radius: 22 },
  // 3. SKILLS (Left Bank: Building at X=-110, Z=-210)
  { id: "skills", title: "03 · The Skills", pos: [-34, 0, -210], radius: 22 },
  // 4. EXPERIENCE (Right Bank: Building at X=120, Z=-310)
  { id: "experience", title: "04 · The Experience", pos: [34, 0, -310], radius: 22 },
  // 5. TOWER / RESUME (River Destination: Tower at X=0, Z=-400)
  { id: "tower", title: "05 · The Resume", pos: [0, 0, -360], radius: 24 },
];

interface SceneState {
  currentScene: SceneType;
  activeTrigger: TriggerType;
  setCurrentScene: (scene: SceneType) => void;
  setActiveTrigger: (trigger: TriggerType) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  currentScene: "river",
  activeTrigger: null,
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setActiveTrigger: (trigger) => set({ activeTrigger: trigger }),
}));
