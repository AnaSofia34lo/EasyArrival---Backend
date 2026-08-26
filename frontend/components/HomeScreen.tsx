"use client";

import React from "react";
import { Search, Clock, Wallet, Zap, Star, Sparkles, Navigation } from "lucide-react";
import { COLORS } from "./ui/constants";
import { Card } from "./ui/Card";
import { PrimaryButton, Chip } from "./ui/Button";
import MiniMap from "./MiniMap";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";

function LocalLogo() {
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

export default function HomeScreen() {
  const {
    destino,
    setDestino,
    hora,
    setHora,
    pref,
    setPref,
    setLoading,
    setConfirmed,
  } = useAppContext();
  const router = useRouter();

  function handleSubmit() {
    setLoading(true);
    setConfirmed(false);
    router.push("/planificar");
    // Simulate loading for the IA calculations
    setTimeout(() => setLoading(false), 800);
  }

  return (
    <div className="mesh-bg fade-in ea-screen-container ea-home-screen">
      {/* Landing Header with only the brand logo */}
      <div className="ea-home-header" style={{ 
        maxWidth: 1200, 
        margin: "0 auto 32px auto"
      }}>
        <LocalLogo />
        <div style={{
          padding: "6px 12px",
          background: COLORS.purpleSoft,
          color: COLORS.purple,
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          alignItems: "center"
        }}>
          <span>Predicción en tiempo real</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Banner Section */}
        <div className="ea-home-header-container" style={{ marginBottom: 28 }}>
          <h1 className="ea-home-title">
            Planifica tu llegada <br />
            <span style={{ 
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.purple})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              sin complicaciones.
            </span>
          </h1>
          <p className="ea-home-desc">
            Encuentra y asegura el mejor estacionamiento antes de salir. Nuestro asistente inteligente calcula la disponibilidad y costos en tiempo real.
          </p>
        </div>

        {/* Main Search Grid */}
        <div className="ea-home-grid">
          <Card glow style={{ display: "flex", flexDirection: "column", gap: 24, padding: 32 }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, fontFamily: "'Inter', sans-serif" }}>
                ¿A dónde vas?
              </label>
              <div className="ea-input-wrapper">
                <Search size={18} color={COLORS.blue} style={{ opacity: 0.8 }} />
                <input 
                  className="ea-input" 
                  value={destino} 
                  onChange={(e) => setDestino(e.target.value)} 
                  placeholder="Ej. Universidad de Medellín" 
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, fontFamily: "'Inter', sans-serif" }}>
                ¿A qué hora quieres llegar?
              </label>
              <div className="ea-input-wrapper">
                <Clock size={18} color={COLORS.blue} style={{ opacity: 0.8 }} />
                <input 
                  className="ea-input" 
                  type="time" 
                  value={hora} 
                  onChange={(e) => setHora(e.target.value)} 
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, fontFamily: "'Inter', sans-serif" }}>
                ¿Qué es más importante para ti?
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <Chip 
                  active={pref === "ahorrar"} 
                  onClick={() => setPref("ahorrar")} 
                  icon={<Wallet size={15} />} 
                  label="Ahorrar" 
                />
                <Chip 
                  active={pref === "rapido"} 
                  onClick={() => setPref("rapido")} 
                  icon={<Zap size={15} />} 
                  label="Rápido" 
                />
                <Chip 
                  active={pref === "mejor"} 
                  onClick={() => setPref("mejor")} 
                  icon={<Star size={15} />} 
                  label="Mejor opción" 
                />
              </div>
            </div>

            <PrimaryButton 
              onClick={handleSubmit} 
              style={{ marginTop: 12, padding: "16px 24px", fontSize: 15.5 }}
            >
              Planificar mi llegada
            </PrimaryButton>
          </Card>

          <MiniMap compact={false} />
        </div>
      </div>
    </div>
  );
}
