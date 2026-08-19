"use client";

import React from "react";
import { X, Footprints } from "lucide-react";
import { COLORS, PARKINGS, money, pillStyle } from "./ui/constants";
import { Card, Badge } from "./ui/Card";
import { PrimaryButton } from "./ui/Button";
import MiniMap from "./MiniMap";

interface MapScreenProps {
  selected: string | null;
  setSelected: (id: string | null) => void;
}

export default function MapScreen({ selected, setSelected }: MapScreenProps) {
  const sel = PARKINGS.find((p) => p.id === selected);

  return (
    <div className="mesh-bg fade-in ea-screen-container">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Header */}
        <div className="ea-section-header">
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
            Mapa de Parqueaderos
          </h1>
          <p style={{ color: COLORS.textMuted, fontFamily: "'Inter', sans-serif", fontSize: 15, marginTop: 4 }}>
            Visualiza y selecciona parqueaderos recomendados por la IA en tiempo real.
          </p>
        </div>

        {/* Map Area */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden" }}>
          <MiniMap onSelect={setSelected} selected={selected} compact={false} />
          
          {/* Floating Detail Panel */}
          {sel && (
            <Card 
              glow 
              style={{
                position: "absolute", 
                bottom: 24, 
                left: "50%", 
                transform: "translateX(-50%)",
                width: 360, 
                maxWidth: "calc(100% - 32px)", 
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.15)",
                zIndex: 1000,
                border: `1.5px solid ${COLORS.blue}33`,
                animation: "slide-up-keyframes 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
                  {sel.name}
                </h3>
                <button 
                  onClick={() => setSelected(null)} 
                  style={{ 
                    background: "rgba(226, 232, 240, 0.6)", 
                    border: "none", 
                    borderRadius: "50%",
                    width: 26,
                    height: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer", 
                    color: COLORS.textMuted,
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(226, 232, 240, 0.6)"}
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", marginBottom: 16 }}>
                <Badge status={sel} />
                <span style={pillStyle}>{money(sel.price)}/h</span>
                <span style={pillStyle}><Footprints size={13} /> {sel.walk} min</span>
              </div>

              <PrimaryButton style={{ width: "100%", padding: "12px" }}>
                Seleccionar este espacio
              </PrimaryButton>
            </Card>
          )}
        </div>

        {/* Legend */}
        <div style={{ 
          marginTop: 18, 
          display: "flex", 
          flexWrap: "wrap",
          gap: 16, 
          alignItems: "center", 
          fontSize: 13.5, 
          color: COLORS.textMuted, 
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          background: "rgba(255, 255, 255, 0.5)",
          padding: "10px 16px",
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          width: "fit-content"
        }}>
          <span style={{ fontWeight: 700, color: COLORS.navy, marginRight: 4 }}>Disponibilidad IA:</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green }} />
            <span>Alta (&ge;75%)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.orange }} />
            <span>Media (50-74%)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.red }} />
            <span>Baja (&lt;50%)</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up-keyframes {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      ` }} />
    </div>
  );
}
