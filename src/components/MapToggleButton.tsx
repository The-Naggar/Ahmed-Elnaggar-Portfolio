import { useEffect } from "react";
import { useSceneStore } from "../utils/useSceneStore";

export default function MapToggleButton() {
  const isMapOpen = useSceneStore((state) => state.isMapOpen);
  const setMapOpen = useSceneStore((state) => state.setMapOpen);

  // Keyboard shortcut: Press 'M' or 'm' to toggle the Fast-Travel Map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setMapOpen(!useSceneStore.getState().isMapOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setMapOpen]);

  return (
    <button
      onClick={() => setMapOpen(!isMapOpen)}
      style={{
        position: "fixed",
        top: "30px",
        right: "30px",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "rgba(13, 40, 37, 0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1.5px solid #d4af37",
        borderRadius: "12px",
        padding: "10px 18px",
        color: "#d4af37",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        cursor: "pointer",
        boxShadow:
          "0 10px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(212, 175, 55, 0.2)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        outline: "none",
      }}
      className="map-toggle-btn"
      title="Open Fast-Travel Map (Press 'M')"
    >
      <style>{`
        .map-toggle-btn:hover {
          background: rgba(20, 60, 55, 0.98) !important;
          border-color: #fbbf24 !important;
          color: #fbbf24 !important;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.8), 0 0 25px rgba(251, 191, 36, 0.4) !important;
          transform: translateY(-2px) scale(1.02);
        }
        .map-toggle-btn:active {
          transform: translateY(1px) scale(0.98);
        }
      `}</style>

      {/* Elegant Map Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>

      <span>Fast Travel</span>
      <span
        style={{
          fontSize: "10px",
          background: "rgba(212, 175, 55, 0.18)",
          padding: "2px 6px",
          borderRadius: "4px",
          border: "1px solid rgba(212, 175, 55, 0.4)",
          marginLeft: "2px",
          color: "#f8f5f0",
        }}
      >
        [M]
      </span>
    </button>
  );
}
