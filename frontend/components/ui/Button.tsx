import React from "react";
import { COLORS } from "./constants";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function PrimaryButton({ children, onClick, style, icon, disabled = false }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: `linear-gradient(135deg, ${COLORS.blue}, #4F46E5)`,
        color: "#fff",
        border: "none",
        borderRadius: 14,
        padding: "14px 24px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: 15,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 4px 16px rgba(79, 70, 229, 0.24)",
        opacity: disabled ? 0.7 : 1,
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-1.5px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(79, 70, 229, 0.35)";
          e.currentTarget.style.filter = "brightness(1.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(79, 70, 229, 0.24)";
          e.currentTarget.style.filter = "brightness(1)";
        }
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, style, icon }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(4px)",
        color: COLORS.navy,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "13px 24px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.background = "#FFFFFF";
        e.currentTarget.style.borderColor = COLORS.blue;
        e.currentTarget.style.color = COLORS.blue;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.color = COLORS.navy;
      }}
    >
      {icon}
      {children}
    </button>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function Chip({ active, onClick, icon, label }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 999,
        border: `1.5px solid ${active ? COLORS.blue : COLORS.border}`,
        background: active ? COLORS.blueSoft : "#FFFFFF",
        color: active ? COLORS.blue : COLORS.textMuted,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: 13.5,
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        flex: 1,
        justifyContent: "center",
        boxShadow: active ? "0 4px 12px rgba(47, 111, 237, 0.12)" : "none"
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = COLORS.blue;
          e.currentTarget.style.color = COLORS.blue;
          e.currentTarget.style.background = "rgba(47, 111, 237, 0.02)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = COLORS.border;
          e.currentTarget.style.color = COLORS.textMuted;
          e.currentTarget.style.background = "#FFFFFF";
        }
      }}
    >
      {icon} 
      <span>{label}</span>
    </button>
  );
}
