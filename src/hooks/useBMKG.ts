"use client";

import { useState, useEffect, useCallback } from "react";
import { BMKGQuake, BMKGEarlyWarning } from "@/types/bmkg";
import { fetchLatestQuake, fetchRecentQuakes, fetchEarlyWarning } from "@/lib/api/bmkg";

export function useBMKG(province?: string) {
  const [earthquake, setEarthquake] = useState<BMKGQuake | null>(null);
  const [recentQuakes, setRecentQuakes] = useState<BMKGQuake[]>([]);
  const [earlyWarning, setEarlyWarning] = useState<BMKGEarlyWarning | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBMKG = useCallback(async () => {
    try {
      setError(null);
      const [latest, recents, warning] = await Promise.all([
        fetchLatestQuake(),
        fetchRecentQuakes(),
        fetchEarlyWarning(province),
      ]);
      setEarthquake(latest);
      setRecentQuakes(recents);
      setEarlyWarning(warning);
    } catch {
      setError("Gagal memuat telemetri BMKG");
    } finally {
      setLoading(false);
    }
  }, [province]);

  useEffect(() => {
    loadBMKG();
    const interval = setInterval(async () => {
      const latest = await fetchLatestQuake();
      if (latest) setEarthquake(latest);
    }, 60000);

    return () => clearInterval(interval);
  }, [loadBMKG]);

  return { earthquake, recentQuakes, earlyWarning, loading, error, refresh: loadBMKG };
}
