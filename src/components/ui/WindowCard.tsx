import React, { useState } from "react";

export interface WindowCardProps {
  title: string;
  tag?: string;
  category?: string;
  accentColor?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onToggle?: (expanded: boolean) => void;
}

export default function WindowCard({
  title,
  tag,
  category,
  accentColor = "#fbbf24", // Warm golden amber default
  defaultExpanded = true,
  children,
  style,
  className = "",
  onToggle,
}: WindowCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !expanded;
    setExpanded(next);
    onToggle?.(next);
  };

  return (
    <div
      className={`cozy-window-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "rgba(10, 18, 36, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isHovered
          ? `1px solid ${accentColor}`
          : "1px solid rgba(251, 191, 36, 0.22)",
        borderRadius: "14px",
        boxShadow: isHovered
          ? `0 12px 35px rgba(0, 0, 0, 0.7), 0 0 25px ${accentColor}22`
          : "0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#f8fafc",
        width: "320px",
        overflow: "hidden",
        pointerEvents: "auto",
        userSelect: "none",
        ...style,
      }}
    >
      {/* ── CARD HEADER ── */}
      <div
        onClick={handleToggle}
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          background: expanded
            ? "linear-gradient(180deg, rgba(30, 41, 69, 0.5) 0%, rgba(15, 23, 42, 0.3) 100%)"
            : "rgba(15, 23, 42, 0.3)",
          borderBottom: expanded
            ? "1px solid rgba(251, 191, 36, 0.15)"
            : "none",
          transition: "background 0.25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Warm Lantern Glow Beacon */}
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />

          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "15px",
                fontWeight: 700,
                color: isHovered ? accentColor : "#ffffff",
                letterSpacing: "0.5px",
                transition: "color 0.2s ease",
              }}
            >
              {title}
            </div>
            {category && (
              <div
                style={{
                  fontSize: "10.5px",
                  color: "#94a3b8",
                  marginTop: "2px",
                  letterSpacing: "0.3px",
                  fontWeight: 500,
                }}
              >
                {category}
              </div>
            )}
          </div>
        </div>

        {/* Tag & Soft Expand Arrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {tag && (
            <span
              style={{
                fontSize: "10px",
                color: "#e2e8f0",
                background: "rgba(251, 191, 36, 0.12)",
                border: "1px solid rgba(251, 191, 36, 0.2)",
                padding: "2px 7px",
                borderRadius: "6px",
                fontWeight: 600,
              }}
            >
              {tag}
            </span>
          )}
          <span
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
              display: "inline-block",
            }}
          >
            ▾
          </span>
        </div>
      </div>

      {/* ── CARD EXPANDED BODY ── */}
      {expanded && (
        <div
          style={{
            padding: "18px 20px",
            fontSize: "13px",
            lineHeight: "1.7",
            color: "#cbd5e1",
            animation: "cozyFadeIn 0.25s ease-out",
          }}
        >
          {children}
        </div>
      )}

      <style>{`
        @keyframes cozyFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
