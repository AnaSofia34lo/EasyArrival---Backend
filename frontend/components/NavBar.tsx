"use client";

import React from "react";
import { Navigation, Sparkles } from "lucide-react";
import { COLORS } from "./ui/constants";

interface NavBarProps {
  screen: string;
  setScreen: (s: string) => void;
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: `linear-gradient(135deg, ${COLORS.blue}, #4F46E5)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        boxShadow: "0 4px 12px rgba(47, 111, 237, 0.25)"
      }}>
        <Navigation size={18} color="#fff" fill="#fff" strokeWidth={0} style={{ transform: "rotate(20deg)" }} />
        <div style={{
          position: "absolute",
          top: -2,
          right: -2,
          width: 13,
          height: 13,
          borderRadius: "50%",
          background: COLORS.purple,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid #ffffff"
        }}>
          <Sparkles size={8} color="#fff" />
        </div>
      </div>
      <span style={{ 
        fontFamily: "'Space Grotesk', sans-serif", 
        fontWeight: 700, 
        fontSize: 20, 
        color: COLORS.navy,
        letterSpacing: "-0.3px"
      }}>
        EasyArrival
      </span>
    </div>
  );
}

export default function NavBar({ screen, setScreen }: NavBarProps) {
  const items = [
    { id: "home", label: "Inicio" },
    { id: "plan", label: "Planificar" },
    { id: "map", label: "Mapa" },
    { id: "compare", label: "Comparar" },
  ];

  return (
    <div className="ea-navbar">
      <Logo />
      
      <div className="ea-navbar-menu">
        {items.map((it, i) => {
          const active = screen === it.id;
          return (
            <button 
              key={i} 
              onClick={() => setScreen(it.id)} 
              className={`ea-navbar-item ${active ? "active" : ""}`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
