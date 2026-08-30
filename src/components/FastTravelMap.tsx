import { useEffect, useState } from "react";
import { useSceneStore, type SceneType, DOCKS } from "../utils/useSceneStore";

interface MapZone {
  id: SceneType;
  name: string;
  category: string;
  style: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  tooltipPos: "top" | "bottom";
}

const MAP_ZONES: MapZone[] = [
  {
    id: "overview",
    name: "01 · Overview",
    category: "About & Introduction",
    style: {
      top: "47%",
      left: "10%",
      width: "19%",
      height: "42%",
    },
    tooltipPos: "top",
  },
  {
    id: "skills",
    name: "03 · Skills",
    category: "Tech Stack & Proficiencies",
    style: {
      top: "28%",
      left: "26%",
      width: "17%",
      height: "40%",
    },
    tooltipPos: "top",
  },
  {
    id: "tower",
    name: "05 · The Resume",
    category: "CV & Credentials",
    style: {
      top: "2%",
      left: "44%",
      width: "12%",
      height: "38%",
    },
    tooltipPos: "bottom",
  },
  {
    id: "experience",
    name: "04 · Experience",
    category: "Career & Roles",
    style: {
      top: "20%",
      left: "60%",
      width: "19%",
      height: "36%",
    },
    tooltipPos: "bottom",
  },
  {
    id: "projects",
    name: "02 · Projects",
    category: "Featured Works",
    style: {
      top: "49%",
      left: "70%",
      width: "21%",
      height: "40%",
    },
    tooltipPos: "top",
  },
];

export default function FastTravelMap() {
  const isMapOpen = useSceneStore((state) => state.isMapOpen);
  const setMapOpen = useSceneStore((state) => state.setMapOpen);
  const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
  const currentScene = useSceneStore((state) => state.currentScene);
  const [hoveredZone, setHoveredZone] = useState<SceneType | null>(null);

  // Close on Escape or M key
  useEffect(() => {
    if (!isMapOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "m" || e.key === "M") {
        e.preventDefault();
        setMapOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMapOpen, setMapOpen]);

  if (!isMapOpen) return null;

  const handleZoneClick = (targetScene: SceneType) => {
    // Dock boat at the destination coordinates
    const dock = DOCKS.find((d) => d.id === targetScene);
    if (dock) {
      const currentRot = useSceneStore.getState().savedBoatTransform.rotationY;
      useSceneStore.getState().setBoatTransform({
        position: [dock.pos[0], 3.5, dock.pos[2]],
        rotationY: currentRot,
      });
    }

    setCurrentScene(targetScene);
    setMapOpen(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(2, 4, 8, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "20px",
        animation: "mapModalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        userSelect: "none",
      }}
      onClick={(e) => {
        // Close if clicking outside the map frame
        if (e.target === e.currentTarget) {
          setMapOpen(false);
        }
      }}
    >
      <style>{`
        @keyframes mapModalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pinPulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.4), inset 0 0 8px rgba(251, 191, 36, 0.2);
            border-color: rgba(251, 191, 36, 0.8);
          }
          50% {
            box-shadow: 0 0 25px rgba(251, 191, 36, 0.8), inset 0 0 18px rgba(251, 191, 36, 0.4);
            border-color: #fbbf24;
          }
        }
        .map-hotzone {
          transition: all 0.2s ease-out;
          border: 1.5px dashed transparent;
          border-radius: 12px;
          cursor: pointer;
        }
        .map-hotzone:hover {
          background: rgba(212, 175, 55, 0.18);
          border-color: #fbbf24;
          animation: pinPulse 1.4s infinite;
        }
        .map-hotzone.active-scene {
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
        }
      `}</style>

      {/* Top Header Bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "1024px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          color: "#f8f5f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🗺️</span>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#fbbf24",
                letterSpacing: "1px",
              }}
            >
              FAST TRAVEL · EXPEDITION MAP
            </div>
            <div style={{ fontSize: "12px", color: "rgba(248, 245, 240, 0.7)" }}>
              Select any landmark to teleport directly to that showcase
            </div>
          </div>
        </div>

        <button
          onClick={() => setMapOpen(false)}
          style={{
            background: "rgba(13, 40, 37, 0.9)",
            border: "1px solid #d4af37",
            borderRadius: "8px",
            color: "#f8f5f0",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s",
          }}
          title="Close Map (Esc)"
        >
          <span>✕ Close</span>
          <span
            style={{
              fontSize: "10px",
              background: "rgba(212, 175, 55, 0.25)",
              padding: "1px 5px",
              borderRadius: "4px",
              color: "#fbbf24",
            }}
          >
            ESC
          </span>
        </button>
      </div>

      {/* Map Graphic Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1024px",
          maxHeight: "80vh",
          aspectRatio: "1.84 / 1",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            "0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 175, 55, 0.25)",
          border: "2px solid #d4af37",
          background: "#1c140a",
        }}
      >
        {/* The Map Image */}
        <img
          src="/fast-travel-map.jpg"
          alt="Cairo Nile Map"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />

        {/* Clickable Interactive Hot Zones */}
        {MAP_ZONES.map((zone) => {
          const isCurrent = currentScene === zone.id;
          const isHovered = hoveredZone === zone.id;

          return (
            <div
              key={zone.id}
              className={`map-hotzone ${isCurrent ? "active-scene" : ""}`}
              style={{
                position: "absolute",
                top: zone.style.top,
                left: zone.style.left,
                width: zone.style.width,
                height: zone.style.height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleZoneClick(zone.id)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              {/* Dynamic Hover Tooltip Badge */}
              {(isHovered || isCurrent) && (
                <div
                  style={{
                    position: "absolute",
                    ...(zone.tooltipPos === "top"
                      ? { top: "-42px" }
                      : { bottom: "-42px" }),
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(13, 40, 37, 0.96)",
                    border: `1.5px solid ${isCurrent ? "#38bdf8" : "#fbbf24"}`,
                    borderRadius: "8px",
                    padding: "6px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.9)",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    zIndex: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: isCurrent ? "#38bdf8" : "#fbbf24",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {isCurrent ? "★ CURRENT LOCATION" : `➔ ${zone.name}`}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(248, 245, 240, 0.8)",
                    }}
                  >
                    {zone.category}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div
        style={{
          marginTop: "12px",
          fontSize: "12px",
          color: "rgba(248, 245, 240, 0.6)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span>💡 Click any building on the parchment map to warp instantly</span>
        <span>•</span>
        <span>Press <strong style={{ color: "#fbbf24" }}>[M]</strong> to toggle map anytime</span>
      </div>
    </div>
  );
}
