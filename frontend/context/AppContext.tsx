"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { parkingService } from "../services/parkingService";
import { Parking } from "../types";

interface AppContextType {
  destino: string;
  setDestino: (v: string) => void;
  hora: string;
  setHora: (v: string) => void;
  pref: string;
  setPref: (v: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  selectedMarker: string | null;
  setSelectedMarker: (v: string | null) => void;
  confirmed: boolean;
  setConfirmed: (v: boolean) => void;
  parkings: Parking[];
  nearbyParkings: Parking[];
  dataLoading: boolean;
  refreshParkingData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [destino, setDestino] = useState("Universidad de Medellín");
  const [hora, setHora] = useState("19:00");
  const [pref, setPref] = useState("mejor");
  const [loading, setLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<string | null>("centro");
  const [confirmed, setConfirmed] = useState(false);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [nearbyParkings, setNearbyParkings] = useState<Parking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const refreshParkingData = async () => {
    setDataLoading(true);
    const [all, nearby] = await Promise.all([
      parkingService.listParkings(),
      parkingService.listNearbyParkings(destino),
    ]);
    setParkings(all);
    setNearbyParkings(nearby);
    if (nearby[0]) {
      setSelectedMarker(nearby[0].id);
    }
    setDataLoading(false);
  };

  useEffect(() => {
    void refreshParkingData();
  }, [destino]);

  return (
    <AppContext.Provider
      value={{
        destino,
        setDestino,
        hora,
        setHora,
        pref,
        setPref,
        loading,
        setLoading,
        selectedMarker,
        setSelectedMarker,
        confirmed,
        setConfirmed,
        parkings,
        nearbyParkings,
        dataLoading,
        refreshParkingData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
