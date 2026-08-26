"use client";

import React from "react";
import { COLORS, FONTS } from "../../components/ui/constants";
import NavBar from "../../components/NavBar";
import { Clock, MapPin, Compass } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { destino, hora, pref } = useAppContext();

  let prefLabel = "Mejor Opción";
  if (pref === "ahorrar") {
    prefLabel = "Ahorrar Dinero";
  } else if (pref === "rapido") {
    prefLabel = "Llegar Rápido";
  }

  const formatHora = (hStr: string) => {
    if (!hStr) return "7:00 PM";
    const [h, m] = hStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: COLORS.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: FONTS }} />

      {/* Dynamic Navigation Header */}
      <NavBar />

      {/* Page Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="ea-app-layout">
          {/* Left Sidebar Panel (Visible on Desktop only) */}
          <div className="ea-app-sidebar">
            <div className="ea-app-sidebar-card glass-panel">
              <div className="ea-app-sidebar-image-container">
                <img
                  src="/parking_illustration.jpg"
                  alt="EasyArrival Smart Parking Navigation"
                  className="ea-app-sidebar-image"
                />
                <div className="ea-app-sidebar-image-overlay">
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: COLORS.navy,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Predicción Inteligente
                  </span>
                </div>
              </div>

              <div className="ea-app-sidebar-info">
                <h3 className="ea-app-sidebar-title">Plan de Llegada</h3>
                <p className="ea-app-sidebar-desc">
                  Monitorea y compara la disponibilidad estimada de parqueaderos en tu destino.
                </p>

                <div className="ea-app-sidebar-details">
                  <div className="ea-app-sidebar-detail-item">
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <MapPin size={12} color={COLORS.blue} />
                      <span className="ea-app-sidebar-detail-label">Destino</span>
                    </div>
                    <span className="ea-app-sidebar-detail-value">
                      {destino || "Universidad de Medellín"}
                    </span>
                  </div>

                  <div className="ea-app-sidebar-detail-item" style={{ marginTop: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <Clock size={12} color={COLORS.blue} />
                      <span className="ea-app-sidebar-detail-label">Llegada Prevista</span>
                    </div>
                    <span
                      className="ea-app-sidebar-detail-value"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {formatHora(hora)}
                    </span>
                  </div>

                  <div className="ea-app-sidebar-detail-item" style={{ marginTop: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <Compass size={12} color={COLORS.blue} />
                      <span className="ea-app-sidebar-detail-label">Preferencia</span>
                    </div>
                    <span className="ea-app-sidebar-detail-value">{prefLabel}</span>
                  </div>
                </div>

                <div className="ea-app-sidebar-status">
                  <span className="ea-app-sidebar-status-dot"></span>
                  <span className="ea-app-sidebar-status-text">Monitoreando disponibilidad</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="ea-app-main-content" style={{ flex: 1 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
