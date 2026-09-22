"use client";

import { useState, useEffect, useCallback } from "react";
import { GeoLocation, WeatherApiResponse } from "@/types/weather";
import { BMKGQuake, BMKGEarlyWarning } from "@/types/bmkg";
import { getWeatherDescription } from "@/lib/utils";

interface Props {
  location: GeoLocation;
  weather: WeatherApiResponse | null;
  bmkgQuake: BMKGQuake | null;
  bmkgWarning: BMKGEarlyWarning | null;
}

export function useWeatherTips({ location, weather, bmkgQuake, bmkgWarning }: Props) {
  const [tips, setTips] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTips = useCallback(
    async (force: boolean = false) => {
      if (!weather) return;

      const cacheKey = `weather_tips_${location.latitude.toFixed(2)}_${location.longitude.toFixed(2)}`;

      if (!force) {
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < 30 * 60 * 1000 && parsed.tips) {
              setTips(parsed.tips);
              setLoading(false);
              setError(null);
              return;
            }
          }
        } catch {}
      }

      setLoading(true);
      setError(null);

      const currentHour = new Date().getHours();
      const current = weather.current;
      const condition = getWeatherDescription(current.weather_code);

      const payload = {
        location: {
          name: location.name,
          admin1: location.admin1,
          country: location.country,
        },
        weatherData: {
          temperature: Math.round(current.temperature_2m),
          feelsLike: Math.round(current.apparent_temperature),
          description: condition.text,
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          rainProbability: weather.hourly.precipitation_probability?.[currentHour] ?? 0,
          uvIndex: weather.hourly.uv_index?.[currentHour] ?? 0,
        },
        bmkgData: {
          earthquake: bmkgQuake,
          earlyWarning: bmkgWarning?.message || null,
        },
      };

      try {
        const res = await fetch("/api/weather-tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.tips) {
          throw new Error(data.error || "Gagal memuat saran Gemini");
        }

        setTips(data.tips);
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ tips: data.tips, timestamp: Date.now() }));
        } catch {}
      } catch (err: any) {
        setError(err.message || "Gemini AI tidak aktif");
      } finally {
        setLoading(false);
      }
    },
    [location, weather, bmkgQuake, bmkgWarning]
  );

  useEffect(() => {
    fetchTips(false);
  }, [fetchTips]);

  return { tips, loading, error, refresh: () => fetchTips(true) };
}
