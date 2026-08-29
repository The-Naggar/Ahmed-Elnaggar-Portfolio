import { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";

interface EntryOverlayProps {
  onEnter?: () => void;
}

export default function EntryOverlay({ onEnter }: EntryOverlayProps) {
  const { progress } = useProgress(); // Tracks 3D asset loading (0 to 100)

  const [entered, setEntered] = useState(false);
  const [audioChoice, setAudioChoice] = useState<boolean | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const isLoaded = progress >= 100;

  // STRICT RULE: ONLY advance to the scene when BOTH (100% loaded) AND (Audio Choice is made)
  useEffect(() => {
    if (isLoaded && audioChoice !== null && !fadeOut) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        onEnter?.();
        if (audioChoice === true) {
          setIsPlayingAudio(true);
        }
        setTimeout(() => {
          setEntered(true);
        }, 1000);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, audioChoice, fadeOut, onEnter]);

  return (
    <>
      {/* 1. YOUTUBE AUDIO ENGINE — ONLY MOUNTS/PLAYS WHEN SCENE IS ENTERED WITH YES */}
      {isPlayingAudio && (
        <div style={{ display: "none" }}>
          <iframe
            src="https://www.youtube.com/embed/7gtIh5dF9Xk?autoplay=1&loop=1&playlist=7gtIh5dF9Xk&enablejsapi=1"
            allow="autoplay"
            title="Cairo Midnight Atmosphere"
          />
        </div>
      )}

      {/* 2. NOCTURNAL LUXURY ENTRY OVERLAY */}
      {!entered && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            background:
              "radial-gradient(circle at 80% 20%, rgba(15, 28, 54, 0.92) 0%, rgba(3, 6, 15, 0.98) 70%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "8vw 10vw",
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: fadeOut ? "none" : "all",
            fontFamily:
              "'Playfair Display', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            overflow: "hidden",
          }}
        >
          {/* Ambient Moonlight Halo */}
          <div
            style={{
              position: "absolute",
              top: "-15vw",
              right: "-10vw",
              width: "50vw",
              height: "50vw",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(147, 197, 253, 0.08) 0%, rgba(3, 6, 15, 0) 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          {/* ── TOP-RIGHT FLOATING AUDIO CHOICE CARD ── */}
          <div
            style={{
              position: "fixed",
              top: "32px",
              right: "32px",
              zIndex: 10000,
              background: "rgba(10, 18, 36, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border:
                isLoaded && audioChoice === null
                  ? "1px solid rgba(147, 197, 253, 0.6)"
                  : "1px solid rgba(199, 210, 254, 0.15)",
              borderRadius: "14px",
              padding: "18px 22px",
              maxWidth: "320px",
              boxShadow:
                isLoaded && audioChoice === null
                  ? "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(147, 197, 253, 0.25)"
                  : "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(147, 197, 253, 0.05)",
              transition: "border 0.3s ease, box-shadow 0.3s ease",
              animation: "cardFloatIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#93c5fd",
                  boxShadow: "0 0 10px #93c5fd",
                  animation: "moonPulse 2.5s infinite ease-in-out",
                }}
              />
              <span
                style={{
                  color: "#e2e8f0",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                }}
              >
                Audio Option
              </span>
            </div>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                lineHeight: "1.4",
                margin: "0 0 14px 0",
                fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
              }}
            >
              Do you want sound?
            </p>

            {/* Strict YES / NO Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setAudioChoice(true)}
                style={{
                  flex: 1,
                  background:
                    audioChoice === true
                      ? "rgba(147, 197, 253, 0.25)"
                      : "rgba(255, 255, 255, 0.04)",
                  border:
                    audioChoice === true
                      ? "1px solid #93c5fd"
                      : "1px solid rgba(255, 255, 255, 0.12)",
                  color: audioChoice === true ? "#ffffff" : "#cbd5e1",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow:
                    audioChoice === true
                      ? "0 0 18px rgba(147, 197, 253, 0.3)"
                      : "none",
                  fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (audioChoice !== true) {
                    e.currentTarget.style.borderColor = "rgba(147, 197, 253, 0.5)";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (audioChoice !== true) {
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.12)";
                    e.currentTarget.style.color = "#cbd5e1";
                  }
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                YES
              </button>

              <button
                onClick={() => setAudioChoice(false)}
                style={{
                  flex: 1,
                  background:
                    audioChoice === false
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(255, 255, 255, 0.04)",
                  border:
                    audioChoice === false
                      ? "1px solid #ffffff"
                      : "1px solid rgba(255, 255, 255, 0.12)",
                  color: audioChoice === false ? "#ffffff" : "#94a3b8",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (audioChoice !== false) {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (audioChoice !== false) {
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.12)";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                NO
              </button>
            </div>

            <div
              style={{
                marginTop: "10px",
                fontSize: "11px",
                color:
                  isLoaded && audioChoice === null ? "#93c5fd" : "#64748b",
                textAlign: "center",
                fontWeight: isLoaded && audioChoice === null ? 500 : 400,
              }}
            >
              {audioChoice === null
                ? isLoaded
                  ? "Select YES or NO to enter"
                  : "Select YES or NO"
                : audioChoice
                ? "Sound: Enabled"
                : "Sound: Disabled"}
            </div>
          </div>

          {/* ── MAIN EDITORIAL BRANDING & LOADING PROGRESS ── */}
          <div style={{ maxWidth: "560px", zIndex: 2 }}>
            <div
              style={{
                display: "inline-block",
                fontSize: "12px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#93c5fd",
                marginBottom: "16px",
                opacity: 0.85,
                fontWeight: 500,
                fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
              }}
            >
              Interactive Portfolio & Architectural Space
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                fontWeight: 700,
                color: "#f8fafc",
                lineHeight: "1.1",
                margin: "0 0 24px 0",
                letterSpacing: "-0.01em",
                textShadow: "0 4px 30px rgba(147, 197, 253, 0.15)",
              }}
            >
              The Nile at Midnight
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
                lineHeight: "1.7",
                marginBottom: "38px",
                fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                maxWidth: "460px",
                fontWeight: 300,
              }}
            >
              A real-time moonlight voyage across Cairo&apos;s Corniche,
              iconic architecture, and interactive showcase destinations.
            </p>

            {/* Hairline Moonlight Progress Bar */}
            <div style={{ width: "100%", maxWidth: "420px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "12px",
                  fontSize: "12px",
                  color: "#cbd5e1",
                  fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                  letterSpacing: "1px",
                }}
              >
                <span style={{ color: "#93c5fd", fontWeight: 500 }}>
                  {!isLoaded
                    ? "Downloading Assets"
                    : audioChoice === null
                    ? "Waiting for Audio Choice..."
                    : "Entering Midnight Cairo..."}
                </span>
                <span
                  style={{
                    color: "#f8fafc",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Progress Track */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "2px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                {/* Glow Fill */}
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #3b82f6 0%, #93c5fd 80%, #ffffff 100%)",
                    boxShadow: "0 0 12px rgba(147, 197, 253, 0.8)",
                    transition: "width 0.3s ease-out",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Animations */}
      <style>{`
        @keyframes cardFloatIn {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes moonPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; box-shadow: 0 0 8px #93c5fd; }
          50% { transform: scale(1.3); opacity: 0.4; box-shadow: 0 0 16px #93c5fd; }
        }
      `}</style>
    </>
  );
}
