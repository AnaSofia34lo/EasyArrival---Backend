"use client";

import React from "react";
import { Star, Bot } from "lucide-react";
import {
  COLORS,
  money,
  parkingDistanceToDestination,
  sortParkingsByDestination,
} from "./ui/constants";
import { Card, Badge } from "./ui/Card";
import { useAppContext } from "../context/AppContext";

type RowProps = Readonly<{
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  last?: boolean;
}>;

function Row(props: Readonly<RowProps>) {
  const { label, value, valueColor, last } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: last ? "none" : `1px solid ${COLORS.border}`,
      }}
    >
      <span
        style={{
          fontSize: 13.5,
          color: COLORS.textMuted,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          color: valueColor || COLORS.text,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function CompareScreen() {
  const { destino, pref, nearbyParkings } = useAppContext();
  const sortedParkings = nearbyParkings.length
    ? nearbyParkings
    : sortParkingsByDestination(destino);
  const bestParking = sortedParkings[0];
  const bestId = bestParking ? bestParking.id : "centro";
  const bestName = bestParking ? bestParking.name : "";
  let prefLabel = "la mejor opción general";
  if (pref === "ahorrar") {
    prefLabel = "ahorrar dinero";
  } else if (pref === "rapido") {
    prefLabel = "llegar rápido";
  }

  return (
    <div className="mesh-bg fade-in ea-screen-container">
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div className="ea-section-header">
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: COLORS.navy,
              margin: 0,
            }}
          >
            Comparar Alternativas
          </h1>
          <p
            style={{
              color: COLORS.textMuted,
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              marginTop: 4,
            }}
          >
            Opciones ordenadas por cercanía al destino que escribiste.
          </p>
        </div>

        {/* Compare Grid */}
        <div className="ea-compare-grid" style={{ marginBottom: 32 }}>
          {sortedParkings.map((p, index) => {
            const isBest = p.id === bestId;
            return (
              <Card
                key={p.id}
                glow={isBest}
                style={{
                  border: isBest
                    ? `2px solid ${COLORS.blue}`
                    : `1px solid ${COLORS.border}`,
                  position: "relative",
                  background: isBest ? COLORS.white : "rgba(255,255,255,0.7)",
                  padding: 28,
                }}
              >
                {isBest && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: 20,
                      background: `linear-gradient(135deg, ${COLORS.blue}, #4F46E5)`,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontFamily: "'Inter', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      boxShadow: "0 4px 10px rgba(79, 70, 229, 0.2)",
                    }}
                  >
                    <Star size={11} fill="#fff" strokeWidth={0} /> RECOMENDADO
                  </div>
                )}
                {index === 0 && !isBest && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: 20,
                      background: `linear-gradient(135deg, ${COLORS.purple}, #A78BFA)`,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    MÁS CERCANO
                  </div>
                )}

                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: COLORS.navy,
                    margin: "8px 0 16px",
                  }}
                >
                  {p.name}
                </h3>

                <Row label="Disponibilidad" value={<Badge status={p} />} />
                <Row label="Precio" value={money(p.price) + "/h"} />
                <Row
                  label="Distancia"
                  value={parkingDistanceToDestination(p, destino) + " m"}
                />
                <Row label="Caminando" value={p.walk + " min"} />
                <Row
                  label="Horario"
                  value={`${p.scheduleLabel} · ${p.openingTime} a ${p.closingTime}`}
                />
                <Row label="Contacto" value={p.contactPhone} />
                <Row
                  label="IA Sugiere"
                  value={isBest ? "Sí, opción óptima" : "Alternativa"}
                  valueColor={isBest ? COLORS.blue : COLORS.textMuted}
                  last
                />
              </Card>
            );
          })}
        </div>

        {/* AI Insight Box */}
        <div
          className="ea-insight-box"
          style={{
            padding: "20px 24px",
            borderRadius: 20,
            background: COLORS.purpleSoft,
            border: "1px solid rgba(139, 92, 246, 0.1)",
            boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.05)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(139, 92, 246, 0.1)",
            }}
          >
            <Bot size={22} color={COLORS.purple} />
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              fontSize: 14.5,
              color: COLORS.text,
              lineHeight: 1.5,
            }}
          >
            Según tu preferencia de{" "}
            <span style={{ color: COLORS.purple, fontWeight: 700 }}>
              {prefLabel}
            </span>
            , el asistente virtual recomienda dirigirse a{" "}
            <b style={{ color: COLORS.navy }}>{bestName}</b>. Su combinación de
            disponibilidad prevista y tarifa se ajusta a tu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}
