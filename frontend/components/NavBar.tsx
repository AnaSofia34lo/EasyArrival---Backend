"use client";

import React from "react";
import { Navigation, Sparkles } from "lucide-react";
import { COLORS } from "./ui/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

export default function NavBar() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Inicio" },
    { href: "/planificar", label: "Planificar" },
    { href: "/mapa", label: "Mapa" },
    { href: "/comparar", label: "Comparar" },
  ];

  return (
    <div className="ea-navbar">
      <Link href="/" style={{ textDecoration: "none" }}>
        <Logo />
      </Link>
      
      <div className="ea-navbar-menu">
        {items.map((it, i) => {
          const active = pathname === it.href;
          return (
            <Link 
              key={i} 
              href={it.href} 
              className={`ea-navbar-item ${active ? "active" : ""}`}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

