"use client";

import React, { useState, useEffect } from "react";
import { COLORS, PARKINGS, statusColor } from "./ui/constants";
import { Sparkles } from "lucide-react";

interface MiniMapProps {
  onSelect?: (id: string) => void;
  selected?: string | null;
  compact?: boolean;
}

export default function MiniMap({ onSelect, selected, compact }: MiniMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const leafletMapRef = React.useRef<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with window object in Leaflet
    import("leaflet").then((module) => {
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

    // Clear existing markers to prevent duplicates
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
            width: 32px; height: 32px; border-radius: 50% 50% 50% 0; background: ${COLORS.navy};
            transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(15,42,74,.35); margin: 0 auto;
            border: 2px solid #ffffff;
          ">
            <svg style="transform: rotate(45deg); margin-top: 3px; margin-left: 3px;" width="14" height="14" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="0">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
          <span style="
            font-size: 11px; font-weight: 700; color: ${COLORS.navy}; background: #fff; padding: 3px 8px;
            border-radius: 8px; margin-top: 4px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,.1);
            white-space: nowrap; border: 1px solid rgba(15,42,74,.1);
          ">Destino</span>
        </div>
      `,
      className: "custom-dest-icon",
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    L.marker([6.2312, -75.6113], { icon: destIcon }).addTo(map);

    PARKINGS.forEach((p) => {
      if (!p.latitude || !p.longitude) return;
      const coord: [number, number] = [p.latitude, p.longitude];

      const s = statusColor(p.availability);
      const isSel = selected === p.id;

      const iconHtml = `
        <div style="position: relative; width: ${isSel ? '42px' : '34px'}; height: ${isSel ? '42px' : '34px'}; transform: translate(-50%, -50%);">
          ${isSel ? `
            <div style="
              position: absolute; inset: -12px; border-radius: 50%; background: ${s.c}; opacity: 0.22;
              animation: sa-pulse 1.8s ease-out infinite;
            "></div>
          ` : ""}
          <div style="
            width: 100%; height: 100%; border-radius: 50%; background: ${s.c};
            border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,.15);
            display: flex; align-items: center; justify-content: center;
            transition: all .2s cubic-bezier(0.4, 0, 0.2, 1);
          ">
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: ${isSel ? '12px' : '11px'}; font-weight: 700; color: #fff;">
              P
            </span>
          </div>
        </div>
      `;

      const pIcon = L.divIcon({
        html: iconHtml,
        className: "custom-parking-icon",
        iconSize: [isSel ? 42 : 34, isSel ? 42 : 34],
        iconAnchor: [isSel ? 21 : 17, isSel ? 21 : 17]
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
    <div className="ea-map-wrapper" style={{
      position: "relative",
      width: "100%",
      height: compact ? 320 : undefined,
      borderRadius: 24,
      overflow: "hidden",
      background: "#EFF3F9",
      border: `1px solid ${COLORS.border}`,
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
      zIndex: 1
    }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      <div style={{
        position: "absolute",
        top: 16,
        left: 16,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        padding: "8px 14px",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
        boxShadow: "0 4px 12px rgba(15,42,74,.08)",
        zIndex: 10,
        border: "1px solid rgba(226, 232, 240, 0.8)"
      }}>
        <Sparkles size={13.5} color={COLORS.purple} />
        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy, fontFamily: "'Inter', sans-serif" }}>
          Predicción IA activa
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sa-pulse { 0% { transform: scale(0.6); opacity: 0.45; } 100% { transform: scale(1.8); opacity: 0; } }
        .custom-dest-icon, .custom-parking-icon {
          background: none !important;
          border: none !important;
        }
      ` }} />
    </div>
  );
}
