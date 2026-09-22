"use client";

import { useEffect, useRef, useState } from "react";
import {
  Layers,
  Wind,
  CloudRain,
  Thermometer,
  Cloud,
  Maximize2,
  Minimize2,
  MapPin,
  Sparkles,
  Droplets,
  Activity,
} from "lucide-react";
import { WeatherApiResponse } from "@/types/weather";
import { BMKGQuake } from "@/types/bmkg";
import { getWeatherDescription } from "@/lib/utils";

export type OverlayType = "wind" | "rain" | "temp" | "clouds";

interface Props {
  lat: number;
  lon: number;
  locationName?: string;
  weather?: WeatherApiResponse | null;
  earthquake?: BMKGQuake | null;
  currentOverlay?: OverlayType;
  onOverlaySelect?: (overlay: OverlayType) => void;
  className?: string;
}

declare global {
  interface Window {
    L?: any;
    windyInit?: (options: any, callback: (windyAPI: any) => void) => void;
  }
}

export default function WindyMap({
  lat,
  lon,
  locationName = "Lokasi Terpilih",
  weather,
  earthquake,
  currentOverlay = "wind",
  onOverlaySelect,
  className = "",
}: Props) {
  const [overlay, setOverlay] = useState<OverlayType>(currentOverlay);
  const [isApiReady, setIsApiReady] = useState(false);
  const [windyApiInstance, setWindyApiInstance] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_WINDY_API_KEY;
  const markerRef = useRef<any>(null);

  // Sync external overlay change from shortcuts
  useEffect(() => {
    if (currentOverlay && currentOverlay !== overlay) {
      setOverlay(currentOverlay);
      if (isApiReady && windyApiInstance?.store) {
        windyApiInstance.store.set("overlay", currentOverlay);
      }
    }
  }, [currentOverlay, isApiReady, windyApiInstance, overlay]);

  useEffect(() => {
    if (!apiKey) return;

    let isMounted = true;
    const fallbackTimer = setTimeout(() => {
      if (isMounted && !isApiReady) {
        setIsApiReady(false);
      }
    }, 3000);

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject();
        document.head.appendChild(s);
      });
    };

    const init = async () => {
      try {
        await loadScript("https://unpkg.com/leaflet@1.4.0/dist/leaflet.js");
        await loadScript("https://api.windy.com/assets/map-forecast/libBoot.js");

        if (!window.windyInit || !isMounted) return;

        window.windyInit(
          {
            key: apiKey,
            lat,
            lon,
            zoom: 7,
          },
          (windyAPI: any) => {
            if (!isMounted) return;
            setIsApiReady(true);
            setWindyApiInstance(windyAPI);
            if (window.L && windyAPI.map) {
              markerRef.current = window.L.marker([lat, lon]).addTo(windyAPI.map);
            }
          }
        );
      } catch {
        if (isMounted) setIsApiReady(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, [apiKey]);

  useEffect(() => {
    if (isApiReady && windyApiInstance?.map) {
      windyApiInstance.map.setView([lat, lon], 8);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
      } else if (window.L) {
        markerRef.current = window.L.marker([lat, lon]).addTo(windyApiInstance.map);
      }
    }
  }, [lat, lon, isApiReady, windyApiInstance]);

  const handleOverlayChange = (newOverlay: OverlayType) => {
    setOverlay(newOverlay);
    if (onOverlaySelect) {
      onOverlaySelect(newOverlay);
    }
    if (isApiReady && windyApiInstance?.store) {
      windyApiInstance.store.set("overlay", newOverlay);
    }
  };

  const layers: { id: OverlayType; label: string; icon: React.ReactNode }[] = [
    { id: "wind", label: "Angin", icon: <Wind className="w-3.5 h-3.5" /> },
    { id: "rain", label: "Radar Hujan", icon: <CloudRain className="w-3.5 h-3.5" /> },
    { id: "temp", label: "Suhu", icon: <Thermometer className="w-3.5 h-3.5" /> },
    { id: "clouds", label: "Awan", icon: <Cloud className="w-3.5 h-3.5" /> },
  ];

  const condition = weather ? getWeatherDescription(weather.current.weather_code) : null;

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.1] bg-slate-900 shadow-xl flex flex-col transition-all duration-300 ${
        isExpanded ? "fixed inset-3 md:inset-6 z-50 shadow-2xl" : className || "relative w-full h-full min-h-[500px]"
      }`}
    >
      {/* Top Floating Bar: Layers & Expand Button */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none gap-2">
        {/* Layer Selector Chips */}
        <div className="flex items-center gap-1 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-white/[0.1] shadow-lg pointer-events-auto overflow-x-auto max-w-[calc(100%-48px)]">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            <span className="hidden sm:inline">Lapisan:</span>
          </div>
          {layers.map((l) => (
            <button
              key={l.id}
              onClick={() => handleOverlayChange(l.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                overlay === l.id
                  ? "bg-sky-500 text-white dark:bg-sky-500/20 dark:text-sky-300 dark:border dark:border-sky-400/40 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {l.icon}
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Fullscreen Expand/Minimize Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-lg pointer-events-auto transition"
          title={isExpanded ? "Perkecil Tampilan" : "Perbesar Layar Penuh"}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Mini Weather HUD Card (Top Right / Bottom Right overlay) */}
      {weather && condition && (
        <div className="absolute top-16 right-3 z-30 pointer-events-none hidden sm:block">
          <div className="bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border border-slate-200 dark:border-white/[0.1] rounded-2xl p-3 shadow-xl pointer-events-auto min-w-[170px] space-y-1.5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-1.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-white truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-500" />
                {locationName}
              </span>
              <span className="text-lg">{condition.icon}</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(weather.current.temperature_2m)}°C
              </span>
              <span className="text-[11px] font-medium text-sky-600 dark:text-sky-400">
                {condition.text}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="flex items-center gap-1">
                <Wind className="w-2.5 h-2.5 text-teal-500" />
                {Math.round(weather.current.wind_speed_10m)} km/j
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="w-2.5 h-2.5 text-sky-500" />
                {weather.current.relative_humidity_2m}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Map Canvas / iFrame */}
      <div className="relative flex-1 w-full h-full min-h-0">
        <div
          id="windy"
          className={`w-full h-full absolute inset-0 ${isApiReady ? "block" : "hidden"}`}
          style={{ width: "100%", height: "100%" }}
        />

        {!isApiReady && (
          <iframe
            key={`${lat}-${lon}-${overlay}`}
            title="Peta Animasi Cuaca Windy"
            className="w-full h-full border-0 absolute inset-0"
            src={`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=7&level=surface&overlay=${overlay}&product=ecmwf&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`}
          />
        )}
      </div>

      {/* Footer Ticker / Status Bar */}
      <div className="bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/[0.08] px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 dark:text-slate-400 z-20 gap-1.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
            <span>Peta Satelit {locationName}</span>
          </span>
          <span className="text-slate-400 font-mono text-[11px] hidden md:inline">
            ({lat.toFixed(2)}°, {lon.toFixed(2)}°)
          </span>
        </div>

        {earthquake && (
          <div className="flex items-center gap-1.5 text-[11px] truncate text-slate-600 dark:text-slate-300">
            <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="font-semibold text-rose-600 dark:text-rose-400">Gempa:</span>
            <span className="truncate">
              M{earthquake.Magnitude} — {earthquake.Wilayah}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
