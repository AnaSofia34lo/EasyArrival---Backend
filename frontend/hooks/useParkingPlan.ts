import { useState, useEffect } from "react";
import { Parking } from "../types";
import { useAppContext } from "./useAppContext";
import { parkingService } from "../services/parkingService";

export function useParkingPlan() {
  const { destino } = useAppContext();
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    parkingService.listNearbyParkings(destino)
      .then((data) => {
        if (active) {
          setParkings(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching nearby parkings in useParkingPlan:", err);
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [destino]);

  const recommendedParking = parkings[0] || null;

  return {
    parkings,
    recommendedParking,
    loading,
  };
}
