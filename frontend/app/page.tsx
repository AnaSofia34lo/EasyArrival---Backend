"use client";

import React from "react";
import { COLORS, FONTS } from "../components/ui/constants";
import HomeScreen from "../components/HomeScreen";

export default function EasyArrival() {
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
      <HomeScreen />
    </div>
  );
}
