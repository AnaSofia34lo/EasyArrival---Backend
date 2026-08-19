import React from "react";
import { COLORS, statusColor } from "./constants";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  glow?: boolean;
}

export function Card({ children, style, className = "", glow = false }: CardProps) {
  return (
    <div 
      className={`glass-panel hover-lift ${glow ? "glass-panel-glow" : ""} ${className}`}
      style={{
        borderRadius: 20,
        padding: 24,
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function Badge({ status }: { status: { availability: number } }) {
  const s = statusColor(status.availability);
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 12px",
      borderRadius: 999,
      background: s.bg,
      color: s.c,
      fontWeight: 700,
      fontSize: "12.5px",
      fontFamily: "'IBM Plex Mono', monospace",
      border: `1px solid ${s.c}1a`
    }}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: s.c }}></span>
        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: s.c }}></span>
      </span>
      {status.availability}%
    </span>
  );
}
