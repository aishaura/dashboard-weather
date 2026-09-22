"use client";

import { WeatherApiResponse } from "@/types/weather";
import { getWeatherDescription } from "@/lib/utils";
import {
  Wind,
  Droplets,
  Gauge,
  Sun,
  CloudRain,
  Sunrise,
  Sunset,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface Props {
  data: WeatherApiResponse;
}

const getWindDirection = (deg: number): string => {
  const directions = ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"];
  return directions[Math.round(deg / 45) % 8];
};

const getUVLevel = (uv: number): { text: string; color: string; barWidth: string } => {
  if (uv < 3) return { text: "Rendah", color: "text-emerald-500 bg-emerald-500", barWidth: "20%" };
  if (uv < 6) return { text: "Sedang", color: "text-amber-500 bg-amber-500", barWidth: "50%" };
  if (uv < 8) return { text: "Tinggi", color: "text-orange-500 bg-orange-500", barWidth: "75%" };
  if (uv < 11) return { text: "Sangat Tinggi", color: "text-rose-500 bg-rose-500", barWidth: "90%" };
  return { text: "Ekstrem", color: "text-purple-500 bg-purple-500", barWidth: "100%" };
};

const getHumidityLevel = (hum: number): string => {
  if (hum < 40) return "Kering";
  if (hum <= 60) return "Ideal & Nyaman";
  if (hum <= 75) return "Lembap";
  return "Sangat Lembap";
};

export default function CurrentWeather({ data }: Props) {
  const current = data.current;
  const condition = getWeatherDescription(current.weather_code);
  const currentHour = new Date().getHours();
  const uv = data.hourly.uv_index?.[currentHour] ?? 0;
  const uvLevel = getUVLevel(uv);

  const maxTemp = data.daily.temperature_2m_max?.[0] != null ? Math.round(data.daily.temperature_2m_max[0]) : null;
  const minTemp = data.daily.temperature_2m_min?.[0] != null ? Math.round(data.daily.temperature_2m_min[0]) : null;

  const sunrise = data.daily.sunrise?.[0]
    ? new Date(data.daily.sunrise[0]).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : null;
  const sunset = data.daily.sunset?.[0]
    ? new Date(data.daily.sunset[0]).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="space-y-4" id="current-weather">
      {/* Hero Weather Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 via-white to-blue-50/50 dark:from-slate-900/90 dark:via-[#0d1627]/90 dark:to-[#0a1020]/95 border border-slate-200 dark:border-white/[0.09] p-5 sm:p-6 shadow-md dark:shadow-xl backdrop-blur-md transition-colors">
        {/* Ambient glow light */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Main Temperature & Condition */}
          <div className="flex items-start sm:items-center gap-5">
            <span className="text-5xl sm:text-6xl drop-shadow-md select-none shrink-0" role="img" aria-label={condition.text}>
              {condition.icon}
            </span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  {Math.round(current.temperature_2m)}°
                </span>
                <span className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-300">C</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-sky-600 dark:text-sky-300">{condition.text}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>Terasa seperti {Math.round(current.apparent_temperature)}°C</span>
              </div>

              {(maxTemp != null || minTemp != null) && (
                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>Maks {maxTemp}°</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span>Min {minTemp}°</span>
                  {sunrise && sunset && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-amber-600 dark:text-amber-300/80 font-medium">
                        <Sunrise className="w-3 h-3" /> {sunrise}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-orange-600 dark:text-orange-300/80 font-medium">
                        <Sunset className="w-3 h-3" /> {sunset}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick summary badge */}
          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-slate-200 dark:border-white/[0.06] pt-3 md:pt-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-medium text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>Kondisi Terkini</span>
            </div>
            <div className="text-right mt-2 hidden md:block">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Pembaruan Stasiun</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Otomatis & Akurat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Metrics Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Kelembaban */}
        <div className="rounded-xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.06] p-3.5 transition group shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Droplets className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              Kelembaban
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {current.relative_humidity_2m}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-0.5">%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{getHumidityLevel(current.relative_humidity_2m)}</span>
            <div className="w-12 h-1 bg-slate-200 dark:bg-white/[0.1] rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 dark:bg-sky-400 rounded-full"
                style={{ width: `${Math.min(100, current.relative_humidity_2m)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Kecepatan Angin */}
        <div className="rounded-xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.06] p-3.5 transition group shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Wind className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
              Kecepatan Angin
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {current.wind_speed_10m}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">km/j</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate">{getWindDirection(current.wind_direction_10m)}</span>
            <span className="flex items-center text-[10px] text-teal-600 dark:text-teal-400 font-mono font-medium">
              <ArrowUpRight
                className="w-3 h-3 transition-transform"
                style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
              />
              {current.wind_direction_10m}°
            </span>
          </div>
        </div>

        {/* Indeks UV */}
        <div className="rounded-xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.06] p-3.5 transition group shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              Indeks UV
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {uv.toFixed(1)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className={`font-semibold ${uvLevel.color.split(" ")[0]}`}>{uvLevel.text}</span>
            <div className="w-12 h-1 bg-slate-200 dark:bg-white/[0.1] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${uvLevel.color.split(" ")[1]}`}
                style={{ width: uvLevel.barWidth }}
              />
            </div>
          </div>
        </div>

        {/* Curah Hujan */}
        <div className="rounded-xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.06] p-3.5 transition group shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <CloudRain className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              Curah Hujan
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {current.precipitation}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">mm</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{current.precipitation > 0 ? "Hujan terdeteksi" : "Tidak ada hujan"}</span>
          </div>
        </div>

        {/* Tekanan Permukaan */}
        <div className="rounded-xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.06] p-3.5 transition group shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Gauge className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              Tekanan Udara
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {Math.round(current.surface_pressure)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">hPa</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{current.surface_pressure >= 1010 ? "Tekanan Normal" : "Tekanan Rendah"}</span>
          </div>
        </div>

        {/* Kenyamanan Suhu */}
        <div className="rounded-xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.06] p-3.5 transition group shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              Sensasi Termal
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {Math.round(current.apparent_temperature)}°
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">C</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              {current.apparent_temperature > current.temperature_2m
                ? "Lebih hangat dari suhu"
                : "Sesuai suhu terukur"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
