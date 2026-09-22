"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, Wind, CloudRain, Thermometer, Cloud } from "lucide-react";

interface Props {
  lat: number;
  lon: number;
}

type OverlayType = "wind" | "rain" | "temp" | "clouds";

declare global {
  interface Window {
    L?: any;
    windyInit?: (options: any, callback: (windyAPI: any) => void) => void;
  }
}

export default function WindyMap({ lat, lon }: Props) {
  const [overlay, setOverlay] = useState<OverlayType>("wind");
  const [isApiReady, setIsApiReady] = useState(false);
  const [windyApiInstance, setWindyApiInstance] = useState<any>(null);
  const apiKey = process.env.NEXT_PUBLIC_WINDY_API_KEY;
  const markerRef = useRef<any>(null);

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
          return;
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
    if (isApiReady && windyApiInstance?.store) {
      windyApiInstance.store.set("overlay", newOverlay);
    }
  };

  const layers: { id: OverlayType; label: string; icon: React.ReactNode }[] = [
    { id: "wind", label: "Angin", icon: <Wind className="w-3.5 h-3.5" /> },
    { id: "rain", label: "Hujan & Radar", icon: <CloudRain className="w-3.5 h-3.5" /> },
    { id: "temp", label: "Suhu", icon: <Thermometer className="w-3.5 h-3.5" /> },
    { id: "clouds", label: "Awan", icon: <Cloud className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-950 flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r border-borderDark">
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-slate-900/90 border border-borderDark p-1 rounded shadow-md">
        <span className="px-2 py-1 text-[11px] font-semibold text-textSecondary flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-accentBlue" />
          <span>Layer:</span>
        </span>
        {layers.map((l) => (
          <button
            key={l.id}
            onClick={() => handleOverlayChange(l.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
              overlay === l.id
                ? "bg-slate-800 text-accentBlue border border-slate-700"
                : "text-textSecondary hover:text-textPrimary"
            }`}
          >
            {l.icon}
            <span>{l.label}</span>
          </button>
        ))}
      </div>

      <div className="relative flex-1 w-full h-full min-h-[260px]">
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

      <div className="bg-slate-900 border-t border-borderDark px-3 py-1.5 flex items-center justify-between text-[11px] text-textSecondary z-20">
        <span className="flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-accentGreen"></span>
          <span>Koordinat: {lat.toFixed(4)}, {lon.toFixed(4)}</span>
        </span>
        <span className="font-medium text-slate-400">Windy Animated Telemetry</span>
      </div>
    </div>
  );
}
