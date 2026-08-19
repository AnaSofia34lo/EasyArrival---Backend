"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import { 
  ArrowLeft, Sparkles, Star, DollarSign, MapPin, Footprints, Bot, Check, ChevronRight 
} from "lucide-react";
import { COLORS, PARKINGS, statusColor, money, pillStyle, AI_SERIES } from "./ui/constants";
import { Card } from "./ui/Card";
import { PrimaryButton, GhostButton } from "./ui/Button";

interface PlanScreenProps {
  destino: string;
  hora: string;
  loading: boolean;
  onGoMap: () => void;
  onGoCompare: () => void;
  onBack: () => void;
  confirmed: boolean;
  onConfirm: () => void;
}

function Gauge({ value, size = 140 }: { value: number; size?: number }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 150);
    return () => clearTimeout(t);
  }, [value]);
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (animated / 100) * c;
  const s = statusColor(value);
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(226, 232, 240, 0.5)" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.c} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: size * 0.22, color: COLORS.navy }}>
          {value}%
        </span>
        <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Libre
        </span>
      </div>
    </div>
  );
}

export default function PlanScreen({
  destino,
  hora,
  loading,
  onGoMap,
  onGoCompare,
  onBack,
  confirmed,
  onConfirm
}: PlanScreenProps) {
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "75vh", gap: 20 }} className="mesh-bg">
        <div style={{
          width: 56, height: 56, borderRadius: "50%", border: `4px solid ${COLORS.blueSoft}`,
          borderTopColor: COLORS.blue, animation: "sa-spin 0.8s linear infinite"
        }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>
          🤖 Calculando tu mejor opción con IA...
        </p>
        <style>{`@keyframes sa-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="mesh-bg fade-in ea-screen-container">
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        
        {/* Navigation Breadcrumb */}
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: COLORS.textMuted, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14,
          cursor: "pointer", marginBottom: 24, padding: 0, transition: "color 0.15s ease"
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = COLORS.blue}
          onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}
        >
          <ArrowLeft size={16} /> Editar búsqueda
        </button>

        {/* Title */}
        <div className="ea-plan-header">
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: COLORS.purpleSoft,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Sparkles size={18} color={COLORS.purple} />
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
            Tu Plan Inteligente
          </h1>
        </div>

        {/* Search Parameters Summary */}
        <div className="ea-summary-bar" style={{ 
          marginBottom: 32, 
          fontFamily: "'Inter', sans-serif", 
          background: "rgba(255, 255, 255, 0.4)",
          padding: "12px 20px",
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`
        }}>
          <div>
            <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>DESTINO</span>
            <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 700, color: COLORS.text }}>{destino || "Universidad de Medellín"}</p>
          </div>
          <div className="ea-summary-divider" style={{ width: 1, background: COLORS.border }} />
          <div>
            <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>LLEGADA PREVISTA</span>
            <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 700, color: COLORS.text, fontFamily: "'IBM Plex Mono', monospace" }}>{displayHora}</p>
          </div>
        </div>

        {/* Recommended Parking Section */}
        <Card glow style={{ border: `2px solid ${COLORS.blue}`, position: "relative", overflow: "hidden", padding: 32, marginBottom: 20 }}>
          <div style={{
            position: "absolute", top: 0, right: 0, background: COLORS.blue, color: "#fff",
            padding: "8px 20px", borderRadius: "0 0 0 16px", fontSize: 12, fontWeight: 800,
            fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 6,
            letterSpacing: "0.5px"
          }}>
            <Star size={13} fill="#fff" strokeWidth={0} /> RECOMENDADO POR IA
          </div>

          <div className="ea-plan-card-grid" style={{ marginTop: 12 }}>
            <Gauge value={best.availability} />
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.navy, margin: "0 0 12px" }}>
                {best.name}
              </h2>
              <div className="ea-pills-container">
                <span style={{ ...pillStyle, background: s.bg, color: s.c, border: `1px solid ${s.c}1a` }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.c }} /> {best.availability}% disponible
                </span>
                <span style={pillStyle}><DollarSign size={13} /> {money(best.price)} / hora</span>
                <span style={pillStyle}><MapPin size={13} /> {best.distance} m</span>
                <span style={pillStyle}><Footprints size={13} /> {best.walk} min caminando</span>
              </div>
            </div>
          </div>

          {/* AI Recommendation Context */}
          <div style={{
            marginTop: 28, padding: 20, borderRadius: 16, background: COLORS.purpleSoft,
            border: "1px solid rgba(139, 92, 246, 0.08)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Bot size={18} color={COLORS.purple} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14.5, color: COLORS.navy }}>
                ¿Por qué lo recomendamos?
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
              {[
                "Alta probabilidad de encontrar lugar",
                "Ubicación óptima respecto a tu destino",
                "Tarifa más competitiva para este horario",
                "Tráfico moderado en las vías de acceso"
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: COLORS.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={11} color="#fff" strokeWidth={3} />
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: COLORS.text, fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
            <GhostButton onClick={onGoMap} style={{ flex: 1, minWidth: 150 }}>Ver ubicación en mapa</GhostButton>
            <PrimaryButton 
              onClick={onConfirm} 
              style={{ flex: 1, minWidth: 150 }} 
              icon={confirmed ? <Check size={18} strokeWidth={2.5} /> : null}
            >
              {confirmed ? "¡Espacio reservado!" : "Confirmar llegada aquí"}
            </PrimaryButton>
          </div>
        </Card>

        {/* Secondary Navigation */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button onClick={onGoCompare} style={{
            background: "none", border: "none", color: COLORS.blue, fontFamily: "'Inter', sans-serif",
            fontWeight: 700, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
            transition: "all 0.15s ease"
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
          >
            Comparar con otros parqueaderos cercanos <ChevronRight size={15} />
          </button>
        </div>

        {/* AI Projection Chart */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: COLORS.purpleSoft,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Bot size={16} color={COLORS.purple} />
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
              Disponibilidad Proyectada por la IA
            </h3>
          </div>
          
          <Card style={{ padding: 28 }}>
            <div style={{ height: 200, width: "100%" }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={AI_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="saGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 11.5, fontFamily: "Inter", fill: COLORS.textMuted, fontWeight: 500 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 12, 
                        border: `1px solid ${COLORS.border}`, 
                        fontFamily: "Inter", 
                        fontSize: 13,
                        boxShadow: "0 4px 12px rgba(15,23,42,0.05)"
                      }}
                      formatter={(v) => [`${v}%`, "Disponibilidad"]} 
                    />
                    <Area type="monotone" dataKey="value" stroke={COLORS.blue} strokeWidth={3} fill="url(#saGrad)" />
                    <ReferenceDot x="7 PM" y={91} r={6} fill={COLORS.blue} stroke="#fff" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted, fontFamily: "Inter", fontSize: 14 }}>
                  Cargando proyecciones de ocupación...
                </div>
              )}
            </div>
            
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16,
              paddingTop: 20, borderTop: `1px solid ${COLORS.border}`, flexWrap: "wrap", gap: 16
            }}>
              <div>
                <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 700, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Disponibilidad Estimada
                </span>
                <p style={{ margin: "2px 0 0", fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 700, color: COLORS.navy }}>91%</p>
              </div>
              <p style={{ fontSize: 14, color: COLORS.textMuted, fontFamily: "'Inter', sans-serif", maxWidth: 300, textAlign: "right", margin: 0, lineHeight: 1.4 }}>
                Se estiman aproximadamente <b style={{ color: COLORS.navy }}>~46 espacios libres</b> a la hora seleccionada ({displayHora}).
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
