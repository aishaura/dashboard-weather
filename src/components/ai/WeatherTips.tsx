"use client";

import { useState, useEffect } from "react";
import { WeatherApiResponse } from "@/types/weather";
import { RefreshCw, Bot, CheckCircle2 } from "lucide-react";

interface Props {
  tips: string;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  weather: WeatherApiResponse | null;
}

export default function WeatherTips({ tips, loading, error, onRefresh, weather }: Props) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!tips) {
      setDisplayedText("");
      return;
    }

    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      i += 3;
      setDisplayedText(tips.slice(0, i));
      if (i >= tips.length) {
        clearInterval(interval);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [tips]);

  const getRuleBasedTips = (): string[] => {
    if (!weather) return [];
    const currentHour = new Date().getHours();
    const rain = weather.hourly.precipitation_probability?.[currentHour] ?? 0;
    const uv = weather.hourly.uv_index?.[currentHour] ?? 0;
    const temp = weather.current.temperature_2m;
    const wind = weather.current.wind_speed_10m;

    const list: string[] = [];
    if (rain > 70) list.push("🌧️ Siapkan payung atau jas hujan hari ini.");
    if (uv > 8) list.push("☀️ Gunakan sunscreen SPF 30+ dan pelindung kepala.");
    if (temp > 35) list.push("🥵 Perbanyak minum air putih untuk cegah dehidrasi.");
    if (wind > 40) list.push("💨 Amankan benda ringan di luar rumah dari tiupan angin kencang.");

    if (list.length === 0) {
      list.push("🌤️ Kondisi cuaca stabil, aman untuk aktivitas harian di luar ruangan.");
      list.push("💧 Jaga asupan hidrasi harian secara berkala.");
    }
    return list;
  };

  const isFallback = Boolean(error || (!tips && !loading));
  const fallbackList = isFallback ? getRuleBasedTips() : [];

  return (
    <div className="bg-bgCard border border-borderDark rounded p-4">
      <div className="flex items-center justify-between border-b border-borderDark pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-slate-800 text-accentBlue">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-textPrimary flex items-center gap-1.5">
              <span>🤖 Saran Cuaca Hari Ini</span>
              {!isFallback && (
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-800 text-accentBlue border border-borderDark">
                  Gemini AI
                </span>
              )}
            </h3>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-slate-900 border border-borderDark text-textSecondary hover:text-accentBlue hover:border-slate-600 transition"
          title="Refresh Saran"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accentBlue" : ""}`} />
          <span className="hidden sm:inline">Refresh Saran</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-2 py-1">
          <div className="h-3.5 bg-slate-800 rounded animate-pulse w-5/6"></div>
          <div className="h-3.5 bg-slate-800 rounded animate-pulse w-full"></div>
          <div className="h-3.5 bg-slate-800 rounded animate-pulse w-4/6"></div>
        </div>
      ) : isFallback ? (
        <div className="space-y-2">
          <div className="space-y-1.5">
            {fallbackList.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-borderDark/60 rounded p-2.5 text-xs text-textPrimary flex items-start gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-accentGreen shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
          {error && (
            <p className="text-[11px] text-slate-500 italic mt-1">
              (Menampilkan saran aturan cuaca otomatis)
            </p>
          )}
        </div>
      ) : (
        <div className="text-xs leading-relaxed text-textPrimary whitespace-pre-line bg-slate-900 border border-borderDark/60 rounded p-3 font-sans">
          {displayedText || tips}
        </div>
      )}
    </div>
  );
}
