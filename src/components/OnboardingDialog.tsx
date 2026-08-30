import { useState, useEffect, useCallback } from "react";
import { Html } from "@react-three/drei";
import { useSceneStore } from "../utils/useSceneStore";

interface OnboardingDialogProps {
  position?: [number, number, number];
  isCruising?: boolean;
}

export default function OnboardingDialog({
  position = [0, 8.5, 3.0],
  isCruising = false,
}: OnboardingDialogProps) {
  const hasSeenOnboarding = useSceneStore((state) => state.hasSeenOnboarding);
  const setHasSeenOnboarding = useSceneStore((state) => state.setHasSeenOnboarding);
  const [isVisible, setIsVisible] = useState(!hasSeenOnboarding);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setHasSeenOnboarding(true);
  }, [setHasSeenOnboarding]);

  // Auto-dismiss if boat starts cruising
  useEffect(() => {
    if (isCruising && isVisible) {
      dismiss();
    }
  }, [isCruising, isVisible, dismiss]);

  // Auto-dismiss on movement keys (WASD / Arrows) or Escape / Space
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const dismissKeys = [
        "w", "W", "ArrowUp",
        "s", "S", "ArrowDown",
        "a", "A", "ArrowLeft",
        "d", "D", "ArrowRight",
        "Escape", " ",
      ];

      if (dismissKeys.includes(e.key)) {
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, dismiss]);

  if (!isVisible || hasSeenOnboarding) return null;

  return (
    <Html
      position={position}
      center
      zIndexRange={[100, 0]}
      style={{
        pointerEvents: "auto",
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes rpgDialogEntrance {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes rpgHoverFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .rpg-floating-container {
          animation: rpgDialogEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                     rpgHoverFloat 3.2s ease-in-out infinite 0.4s;
        }
        .rpg-key-badge {
          display: inline-block;
          padding: 1px 6px;
          margin: 0 2px;
          background: rgba(212, 175, 55, 0.22);
          border: 1.5px solid #fbbf24;
          border-radius: 5px;
          color: #fbbf24;
          font-weight: 800;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          line-height: 1.4;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
        }
        .rpg-close-btn {
          background: rgba(212, 175, 55, 0.1);
          border: 1.5px solid rgba(212, 175, 55, 0.5);
          color: #fbbf24;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          transition: all 0.2s ease;
          padding: 0;
        }
        .rpg-close-btn:hover {
          background: #fbbf24;
          color: #0d2825;
          border-color: #fbbf24;
          box-shadow: 0 0 12px rgba(251, 191, 36, 0.7);
          transform: scale(1.1);
        }
        .rpg-action-btn {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%);
          border: 1.5px solid #fbbf24;
          color: #fbbf24;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .rpg-action-btn:hover {
          background: #fbbf24;
          color: #0d2825;
          box-shadow: 0 0 12px rgba(251, 191, 36, 0.6);
          transform: translateY(-1px);
        }
      `}</style>

      <div
        className="rpg-floating-container"
        style={{
          width: "380px",
          background: "rgba(13, 40, 37, 0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "2px solid #d4af37",
          borderRadius: "14px",
          padding: "14px 18px",
          color: "#f8f5f0",
          boxShadow:
            "0 12px 35px rgba(0, 0, 0, 0.75), 0 0 22px rgba(212, 175, 55, 0.25), inset 0 0 12px rgba(212, 175, 55, 0.1)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          position: "relative",
        }}
      >
        {/* Decorative RPG Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
            borderBottom: "1.5px solid rgba(212, 175, 55, 0.3)",
            paddingBottom: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#fbbf24",
              fontWeight: 900,
              fontSize: "12px",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
            }}
          >
            <span style={{ fontSize: "15px" }}></span>
            <span>CAPTAIN'S LOG & GUIDE</span>
          </div>

          <button
            className="rpg-close-btn"
            onClick={dismiss}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Dialog Body Copy */}
        <div
          style={{
            fontSize: "13px",
            lineHeight: "1.55",
            color: "#f8f5f0",
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            fontWeight: 500,
          }}
        >
          <p style={{ margin: 0 }}>
            Hello! Let's spend a night exploring Cairo's best spots.
          </p>
          <p style={{ margin: 0 }}>
            Use <span className="rpg-key-badge">[W]</span>
            <span className="rpg-key-badge">[A]</span>
            <span className="rpg-key-badge">[S]</span>
            <span className="rpg-key-badge">[D]</span> or{" "}
            <span className="rpg-key-badge">[Arrows]</span> to steer your
            felucca down the Nile.
          </p>
          <p style={{ margin: 0 }}>
            Navigate to the docks to uncover each building, <strong>OR</strong> warp instantly using the <span style={{ color: "#fbbf24", fontWeight: 700 }}>Map</span> on the top-right <span className="rpg-key-badge">[M]</span>.
          </p>
          <p style={{ margin: 0, color: "rgba(248, 245, 240, 0.85)" }}>
            Have a great cruise!
          </p>
        </div>

        {/* Footer info & dismiss prompt */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "12px",
            paddingTop: "8px",
            borderTop: "1.5px solid rgba(212, 175, 55, 0.2)",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "rgba(248, 245, 240, 0.7)",
              letterSpacing: "0.3px",
            }}
          >
            <strong style={{ color: "#fbbf24" }}>Cruise (WASD)</strong> to dismiss
          </span>
          <button
            className="rpg-action-btn"
            onClick={dismiss}
          >
            Set Sail ➔
          </button>
        </div>

        {/* Subtle decorative bottom speech pointer */}
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "14px",
            height: "14px",
            background: "rgba(13, 40, 37, 0.95)",
            borderRight: "2px solid #d4af37",
            borderBottom: "2px solid #d4af37",
          }}
        />
      </div>
    </Html>
  );
}
