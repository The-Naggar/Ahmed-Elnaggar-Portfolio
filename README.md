# Interactive 3D Nile Portfolio

An interactive, WebGL-powered 3D portfolio set along the Nile River in Cairo. Users pilot a traditional Egyptian boat (*felucca*) through a dynamic night environment, navigating to interactive docks that showcase engineering projects, technical skills, experience, and background.

**Live Demo / Try It Out:** [ahmed-elnaggar-portfolio.vercel.app](https://ahmed-elnaggar-portfolio.vercel.app/)

---

## Technologies Used

- **Core & Runtime:** React 19, TypeScript, Vite
- **3D Graphics & Rendering:** Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`)
- **Physics & Animations:** React Spring (`@react-spring/three`, `@react-spring/web`)
- **Post-Processing:** Postprocessing, `@react-three/postprocessing` (Selective Bloom, Night Glow)
- **State Management:** Zustand
- **Audio:** HTML5 Web Audio API

---

## Technical Skills & Highlights

### 1. 3D WebGL & Scene Orchestration
- Dynamic night scene featuring custom-lit water shaders, celestial lighting, and procedural city glow.
- Selective bloom post-processing for streetlights, traffic trails, and the Cairo Tower beacon.
- 3D Egyptian architectural motifs including procedural *Shish* (wooden shutter) louvers animated via spring physics.

### 2. Physics & Performance Optimization
- Real-time boat physics with hydrodynamic banking, water-displacement bobbing, and inertia-based steering.
- Zero-GC allocations in the `useFrame` render loop through pre-allocated vector caches.
- Adaptive performance scaling using Drei's `PerformanceMonitor` and device pixel ratio capping.
- Conditional scene mounting to free dormant WebGL buffers and ensure steady 60 FPS performance.

### 3. Spatial Trigger & Navigation Systems
- Cylindrical 2D proximity detection (`Math.hypot(dx, dz)`) preventing vertical wave offsets from disrupting docking zones.
- Interactive 2D Fast-Travel overlay with responsive CSS hot-zones for instant navigation.
- Seamless 2D/3D integration using `<Html>` overlays for responsive, accessible UI cards inside the 3D space.

---

## Key Features

- **Interactive Boat Navigation:** Keyboard-driven controls (WASD / Arrows) with realistic handling.
- **Modular 3D Scenes:** Five distinct destinations (Overview, Projects, Skills, Experience, and Cairo Tower / Resume).
- **Fast-Travel Map:** 2D interactive Nile map for instant teleportation between docks.
- **Ambient Soundscapes:** Dynamic river audio and tactile shutter sound effects.

---

## Project Structure

```text
src/
├── components/
│   ├── models/            # 3D models (Boat, Cairo Tower, Buildings, Traffic)
│   ├── ui/                # Hybrid 2D/3D cards and Shish window components
│   ├── DockPrompt.tsx     # Contextual interaction prompt
│   ├── DockTriggers.tsx   # Spatial collision and docking logic
│   ├── Environment.tsx    # Sky, lighting, and water shader environment
│   ├── FastTravelMap.tsx  # Fast-travel navigation map
│   └── Scene.tsx          # Master river canvas container
├── pages/                 # Modular 3D scene destinations
│   ├── EntryOverlay.tsx   # Interactive onboarding overlay
│   ├── OverviewScene.tsx  # Bio and summary
│   ├── ProjectsScene.tsx  # Highlighted engineering projects
│   ├── SkillsScene.tsx    # Technical skills breakdown
│   ├── ExperienceScene.tsx# Career milestones and experience
│   └── TowerScene.tsx     # Cairo Tower climax and resume
├── utils/
│   ├── audio.ts           # Sound effects and ambient audio
│   └── useSceneStore.ts   # Global Zustand state management
├── App.tsx                # Scene router and canvas controller
├── main.tsx               # Application entry point
└── index.css              # Global styles and typography
```

---

## Author

**Ahmed Elnaggar**  
- **Live Demo:** [ahmed-elnaggar-portfolio.vercel.app](https://ahmed-elnaggar-portfolio.vercel.app/)
- **GitHub:** [@The-Naggar](https://github.com/The-Naggar)