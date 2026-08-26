"use client";

import React, { useEffect, useState } from "react";
import { COLORS, FONTS, sortParkingsByDestination } from "../components/ui/constants";
import NavBar from "../components/NavBar";
import HomeScreen from "../components/HomeScreen";
import PlanScreen from "../components/PlanScreen";
import MapScreen from "../components/MapScreen";
import CompareScreen from "../components/CompareScreen";
import { Clock, MapPin, Compass } from "lucide-react";

export default function EasyArrival() {
  const [screen, setScreen] = useState("home");
  const [destino, setDestino] = useState("Universidad de Medellín");
  const [hora, setHora] = useState("19:00");
  const [pref, setPref] = useState("mejor");
  const [loading, setLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<string | null>("centro");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const nearestParking = sortParkingsByDestination(destino)[0];
    if (nearestParking) {
      setSelectedMarker(nearestParking.id);
    }
  }, [destino]);

  let prefLabel = "Mejor Opción";
  if (pref === "ahorrar") {
    prefLabel = "Ahorrar Dinero";
  } else if (pref === "rapido") {
    prefLabel = "Llegar Rápido";
  }

  function handlePlan() {
    setLoading(true);
    setScreen("plan");
    setConfirmed(false);
    // Simulate loading for the IA calculations
    setTimeout(() => setLoading(false), 800);
  }

  if (screen === "home") {
    return (
      <div style={{ 
        fontFamily: "'Inter', sans-serif", 
        background: COLORS.bg, 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" 
      }}>
        <style dangerouslySetInnerHTML={{ __html: FONTS }} />
        <HomeScreen 
          destino={destino} 
          setDestino={setDestino} 
          hora={hora} 
          setHora={setHora}
          pref={pref} 
          setPref={setPref} 
          onSubmit={handlePlan} 
        />
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: "'Inter', sans-serif", 
      background: COLORS.bg, 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column" 
    }}>
      <style dangerouslySetInnerHTML={{ __html: FONTS }} />
      
      {/* Dynamic Navigation Header: Hidden on "home" screen */}
      <NavBar screen={screen} setScreen={setScreen} />
      
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
                    <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.navy, fontFamily: "'Inter', sans-serif" }}>Predicción Inteligente</span>
                  </div>
                </div>
                
                <div className="ea-app-sidebar-info">
                  <h3 className="ea-app-sidebar-title">Plan de Llegada</h3>
                  <p className="ea-app-sidebar-desc">Monitorea y compara la disponibilidad estimada de parqueaderos en tu destino.</p>
                  
                  <div className="ea-app-sidebar-details">
                    <div className="ea-app-sidebar-detail-item">
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <MapPin size={12} color={COLORS.blue} />
                        <span className="ea-app-sidebar-detail-label">Destino</span>
                      </div>
                      <span className="ea-app-sidebar-detail-value">{destino || "Universidad de Medellín"}</span>
                    </div>
                    
                    <div className="ea-app-sidebar-detail-item" style={{ marginTop: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <Clock size={12} color={COLORS.blue} />
                        <span className="ea-app-sidebar-detail-label">Llegada Prevista</span>
                      </div>
                      <span className="ea-app-sidebar-detail-value" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {(() => {
                          if (!hora) return "7:00 PM";
                          const [h, m] = hora.split(":").map(Number);
                          const ampm = h >= 12 ? "PM" : "AM";
                          const h12 = h % 12 === 0 ? 12 : h % 12;
                          return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
                        })()}
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
              {screen === "plan" && (
                <PlanScreen 
                  destino={destino} 
                  hora={hora} 
                  loading={loading}
                  onGoMap={() => setScreen("map")} 
                  onGoCompare={() => setScreen("compare")}
                  onBack={() => setScreen("home")} 
                  confirmed={confirmed} 
                  onConfirm={() => setConfirmed(true)} 
                />
              )}
              
              {screen === "map" && (
                <MapScreen 
                  destino={destino}
                  selected={selectedMarker} 
                  setSelected={setSelectedMarker} 
                />
              )}
              
              {screen === "compare" && (
                <CompareScreen 
                  destino={destino}
                  pref={pref} 
                />
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
