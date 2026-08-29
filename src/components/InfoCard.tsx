import React from "react";

export interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

export default function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div
      style={{
        background: "#0d2825", // Deep authentic teal
        border: "1.5px solid rgba(212, 175, 55, 0.4)", // Soft gold border
        borderRadius: "12px",
        padding: "36px",
        color: "#f8f5f0", // Warm cream paper color
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.25)",
        width: "640px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          margin: "0 0 20px 0",
          borderBottom: "1.5px solid rgba(212, 175, 55, 0.5)", // Gold separator
          paddingBottom: "16px",
          color: "#d4af37", // Gold title
          fontSize: "32px",
          fontWeight: "normal",
          fontFamily: '"Aref Ruqaa", serif', // Matches the outer painted font
          letterSpacing: "1.5px",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: "19px",
          lineHeight: "1.85",
          fontFamily: '"Georgia", serif', // Elegant, cinematic serif for body text
          color: "#e0dfd5",
        }}
      >
        {children}
      </div>
    </div>
  );
}
