import { useEffect } from "react";
import { useSceneStore, DOCKS } from "../utils/useSceneStore";

export default function DockPrompt() {
  const currentScene = useSceneStore((state) => state.currentScene);
  const activeTrigger = useSceneStore((state) => state.activeTrigger);
  const setCurrentScene = useSceneStore((state) => state.setCurrentScene);

  // Attach keydown listener for [E] or [Enter]
  useEffect(() => {
    if (!activeTrigger || currentScene !== "river") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "e" ||
        e.key === "E" ||
        e.key === "Enter" ||
        e.key === " "
      ) {
        e.preventDefault();
        setCurrentScene(activeTrigger);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTrigger, currentScene, setCurrentScene]);

  if (!activeTrigger || currentScene !== "river") {
    return null;
  }

  const dock = DOCKS.find((d) => d.id === activeTrigger);
  const dockTitle = dock ? dock.title : "Dock Area";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "42px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "18px",
        background: "rgba(13, 40, 37, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1.5px solid #d4af37",
        borderRadius: "14px",
        padding: "16px 28px",
        color: "#f8f5f0",
        boxShadow:
          "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.25)",
        animation: "dockFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        userSelect: "none",
        cursor: "pointer",
      }}
      onClick={() => setCurrentScene(activeTrigger)}
    >
      <style>{`
        @keyframes dockFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, 15px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
        @keyframes pulseKey {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(212, 175, 55, 0);
          }
        }
      `}</style>

      {/* Keyboard Prompt Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "38px",
          height: "38px",
          padding: "0 10px",
          background: "linear-gradient(135deg, #1e3a34 0%, #0d2825 100%)",
          border: "1.5px solid #fbbf24",
          borderRadius: "8px",
          color: "#fbbf24",
          fontWeight: 800,
          fontSize: "16px",
          fontFamily: "monospace",
          letterSpacing: "1px",
          animation: "pulseKey 2s infinite",
        }}
      >
        E
      </div>

      {/* Dock Title Information */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#a3b8b5",
            fontWeight: 600,
          }}
        >
          Approaching Dock
        </span>
        <span
          style={{
            fontSize: "22px",
            fontFamily: '"Aref Ruqaa", "Georgia", serif',
            color: "#f8f5f0",
            letterSpacing: "0.5px",
          }}
        >
          {dockTitle}
        </span>
      </div>

      {/* Action CTA */}
      <div
        style={{
          marginLeft: "12px",
          paddingLeft: "16px",
          borderLeft: "1px solid rgba(212, 175, 55, 0.3)",
          color: "#d4af37",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "1px",
        }}
      >
        PRESS [E] OR CLICK TO DOCK ➔
      </div>
    </div>
  );
}
