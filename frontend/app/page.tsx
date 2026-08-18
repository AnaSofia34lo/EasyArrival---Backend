"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import {
  MapPin, Clock, Sparkles, Bell, User, Search, Wallet, Zap, Star,
  Navigation, Footprints, DollarSign, ChevronRight, Check, Bot,
  TrendingUp, X, ArrowLeft
} from "lucide-react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const COLORS = {
  navy: "#0F2A4A",
  navySoft: "#1B3A5C",
  blue: "#2F6FED",
  blueSoft: "#EAF1FF",
  white: "#FFFFFF",
  bg: "#F6F8FB",
  border: "#E7ECF3",
  text: "#12213A",
  textMuted: "#5B6B85",
  purple: "#8B5CF6",
  purpleSoft: "#F4F0FE",
  green: "#22C55E",
  greenSoft: "#E9FBF0",
  orange: "#F59E0B",
  orangeSoft: "#FFF6E6",
  red: "#EF4444",
  redSoft: "#FEECEC",
};

interface Parking {
  id: string;
  name: string;
  availability: number;
  price: number;
  distance: number;
  walk: number;
  x: number;
  y: number;
}

const PARKINGS: Parking[] = [
  { id: "centro", name: "Parqueadero Centro", availability: 91, price: 12000, distance: 450, walk: 5, x: 62, y: 38 },
  { id: "norte", name: "Parqueadero Norte", availability: 76, price: 8000, distance: 900, walk: 8, x: 30, y: 22 },
  { id: "sur", name: "Parqueadero Sur", availability: 63, price: 10000, distance: 260, walk: 3, x: 48, y: 70 },
];

const AI_SERIES = [
  { hour: "5 PM", value: 60 },
  { hour: "6 PM", value: 72 },
  { hour: "7 PM", value: 91 },
  { hour: "8 PM", value: 83 },
  { hour: "9 PM", value: 75 },
];

function statusColor(a: number) {
  if (a >= 75) return { c: COLORS.green, bg: COLORS.greenSoft, label: "Alta disponibilidad" };
  if (a >= 50) return { c: COLORS.orange, bg: COLORS.orangeSoft, label: "Disponibilidad media" };
  return { c: COLORS.red, bg: COLORS.redSoft, label: "Baja disponibilidad" };
}

function money(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

function Gauge({ value, size = 132 }: { value: number; size?: number }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 120);
    return () => clearTimeout(t);
  }, [value]);
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (animated / 100) * c;
  const s = statusColor(value);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.border} strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.c} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: size * 0.24, color: COLORS.text }}>
          {value}%
        </span>
        <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>disponible</span>
      </div>
    </div>
  );
}

function Chip({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
        borderRadius: 999, border: `1.5px solid ${active ? COLORS.blue : COLORS.border}`,
        background: active ? COLORS.blueSoft : COLORS.white,
        color: active ? COLORS.blue : COLORS.textMuted,
        fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5,
        cursor: "pointer", transition: "all .15s ease", flex: 1, justifyContent: "center"
      }}
    >
      {icon} {label}
    </button>
  );
}

function Badge({ status }: { status: { availability: number } }) {
  const s = statusColor(status.availability);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
      borderRadius: 999, background: s.bg, color: s.c, fontWeight: 600, fontSize: 12.5,
      fontFamily: "'IBM Plex Mono', monospace"
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.c }} />
      {status.availability}%
    </span>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.navy})`,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
      }}>
        <Navigation size={16} color="#fff" fill="#fff" strokeWidth={0} style={{ transform: "rotate(20deg)" }} />
        <div style={{
          position: "absolute", top: -3, right: -3, width: 12, height: 12, borderRadius: "50%",
          background: COLORS.purple, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Sparkles size={7.5} color="#fff" />
        </div>
      </div>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19, color: COLORS.navy }}>
        EasyArrival
      </span>
    </div>
  );
}

interface NotificationItem {
  id: string;
  text: string;
  time: string;
}

function NotificationRow({ item, onDelete }: { item: NotificationItem; onDelete: (id: string) => void }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const startXRef = React.useRef(0);
  const rowRef = React.useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    if (rowRef.current) {
      rowRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 120) {
      setIsDeleted(true);
      setTimeout(() => {
        onDelete(item.id);
      }, 250);
    } else {
      setDragOffset(0);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        background: COLORS.redSoft,
        overflow: "hidden",
        height: isDeleted ? 0 : "auto",
        opacity: isDeleted ? 0 : 1,
        transition: "height 0.25s ease, opacity 0.25s ease",
        margin: isDeleted ? "0" : "4px 0"
      }}
    >
      <div style={{
        position: "absolute",
        left: 12,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        color: COLORS.red,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "Inter"
      }}>
        <Check size={14} style={{ marginRight: 4 }} /> ELIMINADO
      </div>

      <div
        ref={rowRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: "relative",
          padding: 12,
          background: COLORS.white,
          border: `1.5px solid ${COLORS.border}`,
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          userSelect: "none",
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          zIndex: 2
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: COLORS.text, lineHeight: 1.4 }}>{item.text}</p>
        <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>{item.time}</span>
      </div>
    </div>
  );
}

function NavBar({ screen, setScreen }: { screen: string; setScreen: (s: string) => void }) {
  const items = [
    { id: "home", label: "Inicio" },
    { id: "plan", label: "Planificar" },
    { id: "map", label: "Mapa" },
    { id: "compare", label: "Comparar" },
  ];
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "1", text: "¡Gran oportunidad! Parqueadero Centro tiene 91% de disponibilidad ahora.", time: "Hace 2 min" },
    { id: "2", text: "Tráfico fluido detectado en la ruta a Universidad de Medellín.", time: "Hace 10 min" },
    { id: "3", text: "El precio en Parqueadero Norte se mantiene estable en $8,000/h.", time: "Hace 30 min" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="ea-navbar">
      <Logo />
      <div className="ea-navbar-menu" style={{ display: "flex", gap: 4 }}>
        {items.map((it, i) => {
          const active = screen === it.id;
          return (
            <button key={i} onClick={() => setScreen(it.id)} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: active ? COLORS.blueSoft : "transparent",
              color: active ? COLORS.blue : COLORS.textMuted,
              fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14.5,
              transition: "all .15s ease"
            }}>
              {it.label}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
        <div style={{ position: "relative" }}>
          <div style={{ cursor: "pointer" }} onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={19} color={COLORS.navy} />
            {notifications.length > 0 && (
              <div style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: COLORS.red }} />
            )}
          </div>
          
          {showNotifications && (
            <div style={{
              position: "absolute", top: "100%", right: -40, marginTop: 12, width: 340,
              background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16,
              boxShadow: "0 10px 30px rgba(15,42,74,0.15)", zIndex: 100, padding: 16,
              maxHeight: 400, overflowY: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: COLORS.navy }}>Notificaciones</span>
                <button onClick={() => setShowNotifications(false)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }}>
                  <X size={16} />
                </button>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: COLORS.textMuted, fontSize: 13.5 }}>
                  No tienes notificaciones
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {notifications.map((item) => (
                    <NotificationRow key={item.id} item={item} onDelete={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: COLORS.navy,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <User size={16} color="#fff" />
        </div>
      </div>
    </div>
  );
}

function MiniMap({ onSelect, selected, compact }: { onSelect?: (id: string) => void; selected?: string | null; compact?: boolean }) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const leafletMapRef = React.useRef<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((module) => {
      // Fallback for CommonJS/ESM bundling differences
      setL(module.default || module);
    });
  }, []);

  useEffect(() => {
    if (!L || !mapRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapRef.current, {
        center: [6.2312, -75.6113],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Destination Marker
    const destIcon = L.divIcon({
      html: `
        <div style="text-align: center; transform: translate(-50%, -100%);">
          <div style="
            width: 30px; height: 30px; border-radius: 50% 50% 50% 0; background: ${COLORS.navy};
            transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;
            box-shadow: 0 3px 8px rgba(15,42,74,.35); margin: 0 auto;
          ">
            <svg style="transform: rotate(45deg); margin-top: 5px; margin-left: 5px;" width="14" height="14" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="0">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
          <span style="
            font-size: 11px; font-weight: 600; color: ${COLORS.navy}; background: #fff; padding: 2px 6px;
            border-radius: 6px; margin-top: 4px; display: inline-block; box-shadow: 0 1px 4px rgba(0,0,0,.08);
            white-space: nowrap;
          ">Destino</span>
        </div>
      `,
      className: "custom-dest-icon",
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    L.marker([6.2312, -75.6113], { icon: destIcon }).addTo(map);

    // Parking Markers
    const parkingCoords: Record<string, [number, number]> = {
      centro: [6.2325, -75.6085],
      norte: [6.2360, -75.6125],
      sur: [6.2270, -75.6105]
    };

    PARKINGS.forEach((p) => {
      const coord = parkingCoords[p.id];
      if (!coord) return;

      const s = statusColor(p.availability);
      const isSel = selected === p.id;

      const iconHtml = `
        <div style="position: relative; width: ${isSel ? '40px' : '32px'}; height: ${isSel ? '40px' : '32px'}; transform: translate(-50%, -50%);">
          ${isSel ? `
            <div style="
              position: absolute; inset: -10px; border-radius: 50%; background: ${s.c}; opacity: 0.18;
              animation: sa-pulse 1.6s ease-out infinite;
            "></div>
          ` : ""}
          <div style="
            width: 100%; height: 100%; border-radius: 50%; background: ${s.c};
            border: 3px solid #fff; box-shadow: 0 3px 8px rgba(0,0,0,.18);
            display: flex; align-items: center; justify-content: center;
            transition: all .2s ease;
          ">
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 700; color: #fff;">
              P
            </span>
          </div>
        </div>
      `;

      const pIcon = L.divIcon({
        html: iconHtml,
        className: "custom-parking-icon",
        iconSize: [isSel ? 40 : 32, isSel ? 40 : 32],
        iconAnchor: [isSel ? 20 : 16, isSel ? 20 : 16]
      });

      const marker = L.marker(coord, { icon: pIcon }).addTo(map);
      marker.on("click", () => {
        if (onSelect) {
          onSelect(p.id);
        }
      });
    });
  }, [L, selected, onSelect]);

  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      position: "relative", width: "100%", height: compact ? 320 : 480,
      borderRadius: 16, overflow: "hidden", background: "#EFF3F9", border: `1px solid ${COLORS.border}`,
      zIndex: 1
    }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />


      <div style={{
        position: "absolute", top: 14, left: 14, background: "#fff", padding: "7px 12px", borderRadius: 10,
        display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 10px rgba(15,42,74,.1)",
        zIndex: 10
      }}>
        <Sparkles size={13} color={COLORS.purple} />
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.navy, fontFamily: "'Inter', sans-serif" }}>
          IA predice 91% de disponibilidad
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sa-pulse { 0% { transform: scale(0.6); opacity: 0.35; } 100% { transform: scale(1.6); opacity: 0; } }
        .custom-dest-icon, .custom-parking-icon {
          background: none !important;
          border: none !important;
        }
      ` }} />
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 18,
      padding: 24, boxShadow: "0 2px 16px rgba(15,42,74,.05)", ...style
    }}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, style, icon }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; icon?: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      background: COLORS.blue, color: "#fff", border: "none", borderRadius: 12,
      padding: "14px 22px", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15,
      cursor: "pointer", transition: "all .15s ease", boxShadow: "0 4px 14px rgba(47,111,237,.28)",
      ...style
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = "#2660D6"}
      onMouseLeave={(e) => e.currentTarget.style.background = COLORS.blue}
    >
      {icon}{children}
    </button>
  );
}

function GhostButton({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      background: COLORS.white, color: COLORS.navy, border: `1.5px solid ${COLORS.border}`, borderRadius: 12,
      padding: "13px 22px", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15,
      cursor: "pointer", transition: "all .15s ease", ...style
    }}>
      {children}
    </button>
  );
}

// ---------- SCREEN 1: HOME ----------
function HomeScreen({ destino, setDestino, hora, setHora, pref, setPref, onSubmit }: { destino: string; setDestino: (v: string) => void; hora: string; setHora: (v: string) => void; pref: string; setPref: (v: string) => void; onSubmit: () => void }) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 42, fontWeight: 700, color: COLORS.navy,
          margin: 0, letterSpacing: "-0.5px"
        }}>
          Planifica tu llegada
        </h1>
        <p style={{ fontSize: 17, color: COLORS.textMuted, marginTop: 8, fontFamily: "'Inter', sans-serif" }}>
          Encuentra dónde estacionar antes de salir.
        </p>
      </div>

      <div className="ea-home-grid">
        <Card style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <label style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>
              ¿A dónde vas?
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginTop: 8, padding: "13px 14px",
              border: `1.5px solid ${COLORS.border}`, borderRadius: 12, background: COLORS.bg
            }}>
              <Search size={17} color={COLORS.blue} />
              <input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ej. Universidad de Medellín"
                style={{
                  border: "none", outline: "none", background: "transparent", flex: 1,
                  fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: COLORS.text
                }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>
              ¿A qué hora quieres llegar?
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginTop: 8, padding: "13px 14px",
              border: `1.5px solid ${COLORS.border}`, borderRadius: 12, background: COLORS.bg
            }}>
              <Clock size={17} color={COLORS.blue} />
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)}
                style={{
                  border: "none", outline: "none", background: "transparent", flex: 1,
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 14.5, color: COLORS.text
                }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>
              ¿Qué es más importante para ti?
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <Chip active={pref === "ahorrar"} onClick={() => setPref("ahorrar")} icon={<Wallet size={15} />} label="Ahorrar" />
              <Chip active={pref === "rapido"} onClick={() => setPref("rapido")} icon={<Zap size={15} />} label="Rápido" />
              <Chip active={pref === "mejor"} onClick={() => setPref("mejor")} icon={<Star size={15} />} label="Mejor opción" />
            </div>
          </div>

          <PrimaryButton onClick={onSubmit} icon={<Sparkles size={17} />} style={{ marginTop: 4, padding: "16px 22px", fontSize: 15.5 }}>
            Planificar mi llegada
          </PrimaryButton>
        </Card>

        <MiniMap />
      </div>
    </div>
  );
}

// ---------- SCREEN 2: PLAN ----------
function PlanScreen({ destino, hora, loading, onGoMap, onGoCompare, onBack, confirmed, onConfirm }: { destino: string; hora: string; loading: boolean; onGoMap: () => void; onGoCompare: () => void; onBack: () => void; confirmed: boolean; onConfirm: () => void }) {
  const best = PARKINGS[0];
  const s = statusColor(best.availability);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayHora = useMemo(() => {
    if (!hora) return "7:00 PM";
    const [h, m] = hora.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  }, [hora]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh", gap: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", border: `4px solid ${COLORS.blueSoft}`,
          borderTopColor: COLORS.blue, animation: "sa-spin 0.8s linear infinite"
        }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: COLORS.navy, fontSize: 15 }}>
          🤖 La IA está calculando tu mejor opción...
        </p>
        <style>{`@keyframes sa-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px 80px" }}>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
        color: COLORS.textMuted, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5,
        cursor: "pointer", marginBottom: 18, padding: 0
      }}>
        <ArrowLeft size={15} /> Editar búsqueda
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Sparkles size={22} color={COLORS.purple} />
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
          Tu plan inteligente
        </h1>
      </div>

      <div style={{ display: "flex", gap: 24, marginBottom: 28, fontFamily: "'Inter', sans-serif", flexWrap: "wrap" }}>
        <div>
          <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>DESTINO</span>
          <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 600, color: COLORS.text }}>{destino || "Universidad de Medellín"}</p>
        </div>
        <div style={{ width: 1, background: COLORS.border }} />
        <div>
          <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>LLEGADA</span>
          <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 600, color: COLORS.text, fontFamily: "'IBM Plex Mono', monospace" }}>{displayHora}</p>
        </div>
      </div>

      <Card style={{ border: `2px solid ${COLORS.blue}`, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, right: 0, background: COLORS.blue, color: "#fff",
          padding: "6px 16px", borderRadius: "0 0 0 14px", fontSize: 12, fontWeight: 700,
          fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 5
        }}>
          <Star size={12} fill="#fff" /> RECOMENDADO
        </div>

        <div className="ea-plan-card-grid" style={{ marginTop: 8 }}>
          <Gauge value={best.availability} />
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: COLORS.navy, margin: "0 0 10px" }}>
              {best.name}
            </h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ ...pillStyle, background: s.bg, color: s.c }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.c }} /> {best.availability}% disponibilidad
              </span>
              <span style={pillStyle}><DollarSign size={13} /> {money(best.price)} / hora</span>
              <span style={pillStyle}><MapPin size={13} /> {best.distance} m</span>
              <span style={pillStyle}><Footprints size={13} /> {best.walk} min caminando</span>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 24, padding: 18, borderRadius: 14, background: COLORS.purpleSoft
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Bot size={17} color={COLORS.purple} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: COLORS.navy }}>
              ¿Por qué lo recomendamos?
            </span>
          </div>
          {["Alta disponibilidad prevista", "Cerca de tu destino", "Buen precio", "Bajo riesgo de llegar y no encontrar espacio"].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <Check size={14} color={COLORS.purple} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: COLORS.text }}>{r}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <GhostButton onClick={onGoMap} style={{ flex: 1, minWidth: 120 }}>Ver en mapa</GhostButton>
          <PrimaryButton onClick={onConfirm} style={{ flex: 1, minWidth: 120 }} icon={confirmed ? <Check size={16} /> : null}>
            {confirmed ? "¡Reservado!" : "Elegir este"}
          </PrimaryButton>
        </div>
      </Card>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button onClick={onGoCompare} style={{
          background: "none", border: "none", color: COLORS.blue, fontFamily: "'Inter', sans-serif",
          fontWeight: 600, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4
        }}>
          Comparar con otras opciones <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Bot size={18} color={COLORS.purple} />
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
            La IA predice tu disponibilidad
          </h3>
        </div>
        <Card>
          <div style={{ height: 180 }}>
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={AI_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="saGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" tick={{ fontSize: 11.5, fontFamily: "Inter", fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${COLORS.border}`, fontFamily: "Inter", fontSize: 12 }}
                    formatter={(v) => [`${v}%`, "Disponibilidad"]} />
                  <Area type="monotone" dataKey="value" stroke={COLORS.blue} strokeWidth={2.5} fill="url(#saGrad)" />
                  <ReferenceDot x="7 PM" y={91} r={5} fill={COLORS.blue} stroke="#fff" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted, fontFamily: "Inter", fontSize: 14 }}>
                Cargando gráfico...
              </div>
            )}
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12,
            paddingTop: 16, borderTop: `1px solid ${COLORS.border}`, flexWrap: "wrap", gap: 12
          }}>
            <div>
              <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>DISPONIBILIDAD PREVISTA</span>
              <p style={{ margin: "2px 0 0", fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 600, color: COLORS.navy }}>91%</p>
            </div>
            <p style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: "'Inter', sans-serif", maxWidth: 260, textAlign: "right", margin: 0 }}>
              Se estiman <b style={{ color: COLORS.text }}>~46 espacios</b> disponibles a las {displayHora}.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

const pillStyle = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
  borderRadius: 999, background: COLORS.bg, color: COLORS.text, fontSize: 12.5,
  fontWeight: 600, fontFamily: "'Inter', sans-serif"
};

// ---------- SCREEN 3: MAP ----------
function MapScreen({ selected, setSelected }: { selected: string | null; setSelected: (id: string | null) => void }) {
  const sel = PARKINGS.find((p) => p.id === selected);
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 32px 60px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: COLORS.navy, margin: "0 0 16px" }}>
        Mapa de parqueaderos
      </h1>
      <div style={{ position: "relative" }}>
        <MiniMap onSelect={setSelected} selected={selected} />
        {sel && (
          <Card style={{
            position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
            width: 320, maxWidth: "calc(100% - 32px)", boxShadow: "0 10px 30px rgba(15,42,74,.18)",
            zIndex: 1000
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
                {sel.name}
              </h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <Badge status={sel} />
              <span style={pillStyle}>{money(sel.price)}/hora</span>
              <span style={pillStyle}><Footprints size={12} /> {sel.walk} min</span>
            </div>
            <PrimaryButton style={{ marginTop: 14, width: "100%", padding: "11px" }}>Seleccionar</PrimaryButton>
          </Card>
        )}
      </div>
      <p style={{ marginTop: 14, fontSize: 13, color: COLORS.textMuted, fontFamily: "'Inter', sans-serif" }}>
        🟢 Alta disponibilidad &nbsp;&nbsp; 🟠 Disponibilidad media &nbsp;&nbsp; 🔴 Baja disponibilidad
      </p>
    </div>
  );
}

// ---------- SCREEN 4: COMPARE ----------
function CompareScreen({ pref }: { pref: string }) {
  const bestId = pref === "ahorrar" ? "norte" : pref === "rapido" ? "sur" : "centro";
  const bestParking = PARKINGS.find((p) => p.id === bestId);
  const bestName = bestParking ? bestParking.name : "";
  const prefLabel = pref === "ahorrar" ? "ahorrar dinero" : pref === "rapido" ? "llegar rápido" : "la mejor opción general";

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 32px 80px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: COLORS.navy, margin: "0 0 4px" }}>
        Compara tus opciones
      </h1>
      <p style={{ color: COLORS.textMuted, fontFamily: "'Inter', sans-serif", fontSize: 14.5, margin: "0 0 28px" }}>
        Tres alternativas cerca de tu destino, evaluadas por la IA.
      </p>

      <div className="ea-compare-grid">
        {PARKINGS.map((p) => {
          const isBest = p.id === bestId;
          return (
            <Card key={p.id} style={{
              border: isBest ? `2px solid ${COLORS.blue}` : `1px solid ${COLORS.border}`,
              position: "relative"
            }}>
              {isBest && (
                <div style={{
                  position: "absolute", top: -11, left: 16, background: COLORS.blue, color: "#fff",
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                  fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 4
                }}>
                  <Star size={10} fill="#fff" /> RECOMENDADO
                </div>
              )}
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16.5, fontWeight: 700, color: COLORS.navy, margin: "6px 0 14px" }}>
                {p.name}
              </h3>
              <Row label="Disponibilidad" value={<Badge status={p} />} />
              <Row label="Precio" value={money(p.price) + "/h"} />
              <Row label="Distancia" value={p.distance + " m"} />
              <Row label="Caminando" value={p.walk + " min"} />
              <Row label="IA sugiere" value={isBest ? "Sí" : "—"} valueColor={isBest ? COLORS.blue : COLORS.textMuted} last />
            </Card>
          );
        })}
      </div>

      <div style={{
        marginTop: 22, padding: 18, borderRadius: 14, background: COLORS.purpleSoft,
        display: "flex", alignItems: "center", gap: 12
      }}>
        <Bot size={20} color={COLORS.purple} />
        <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: 14, color: COLORS.text }}>
          Según tu preferencia de <b>{prefLabel}</b>, recomendamos <b style={{ color: COLORS.navy }}>{bestName}</b>.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor, last }: { label: string; value: React.ReactNode; valueColor?: string; last?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0", borderBottom: last ? "none" : `1px solid ${COLORS.border}`
    }}>
      <span style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: valueColor || COLORS.text, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function EasyArrival() {
  const [screen, setScreen] = useState("home");
  const [destino, setDestino] = useState("Universidad de Medellín");
  const [hora, setHora] = useState("19:00");
  const [pref, setPref] = useState("mejor");
  const [loading, setLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<string | null>("centro");
  const [confirmed, setConfirmed] = useState(false);

  function handlePlan() {
    setLoading(true);
    setScreen("plan");
    setConfirmed(false);
    setTimeout(() => setLoading(false), 1000);
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bg, minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: FONTS }} />
      <NavBar screen={screen} setScreen={setScreen} />
      {screen === "home" && (
        <HomeScreen destino={destino} setDestino={setDestino} hora={hora} setHora={setHora}
          pref={pref} setPref={setPref} onSubmit={handlePlan} />
      )}
      {screen === "plan" && (
        <PlanScreen destino={destino} hora={hora} loading={loading}
          onGoMap={() => setScreen("map")} onGoCompare={() => setScreen("compare")}
          onBack={() => setScreen("home")} confirmed={confirmed} onConfirm={() => setConfirmed(true)} />
      )}
      {screen === "map" && <MapScreen selected={selectedMarker} setSelected={setSelectedMarker} />}
      {screen === "compare" && <CompareScreen pref={pref} />}
    </div>
  );
}
