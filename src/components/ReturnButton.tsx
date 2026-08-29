import { useState, useEffect } from "react";
import { useSceneStore } from "../utils/useSceneStore";

export default function ReturnButton() {
  const currentScene = useSceneStore((state) => state.currentScene);
  const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
  const [hovered, setHovered] = useState(false);

  // Allow pressing Escape or Backspace to return to the river
  useEffect(() => {
    if (currentScene === "river") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        setCurrentScene("river");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentScene, setCurrentScene]);

  if (currentScene === "river") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setCurrentScene("river")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        top: "28px",
        left: "28px",
        zIndex: 1000,
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        background: hovered
          ? "rgba(22, 58, 54, 0.95)"
          : "rgba(13, 40, 37, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: hovered
          ? "1.5px solid #fbbf24"
          : "1.5px solid rgba(212, 175, 55, 0.6)",
        borderRadius: "10px",
        padding: "12px 20px",
        color: hovered ? "#fef08a" : "#f8f5f0",
        boxShadow: hovered
          ? "0 12px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.35)"
          : "0 8px 25px rgba(0, 0, 0, 0.6)",
        cursor: "pointer",
        fontFamily: '"Aref Ruqaa", "Georgia", serif',
        fontSize: "16px",
        letterSpacing: "1px",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "rgba(212, 175, 55, 0.2)",
          color: "#d4af37",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        ←
      </span>
      <span>RETURN TO NILE RIVER</span>
      <span
        style={{
          fontSize: "11px",
          color: "#a3b8b5",
          fontFamily: "monospace",
          marginLeft: "4px",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          padding: "2px 6px",
          borderRadius: "4px",
        }}
      >
        ESC
      </span>
    </button>
  );
}
