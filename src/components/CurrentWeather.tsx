"use client";

import { WeatherApiResponse } from "@/types/weather";
import { getWeatherDescription } from "@/lib/utils";
import { Wind, Droplets, Compass, Gauge, Sun, CloudRain } from "lucide-react";

interface Props {
  data: WeatherApiResponse;
}

export default function CurrentWeather({ data }: Props) {
  const current = data.current;
  const condition = getWeatherDescription(current.weather_code);
  const currentHour = new Date().getHours();
  const uv = data.hourly.uv_index?.[currentHour] ?? 0;

  return (
    <div className="bg-bgCard border border-borderDark rounded p-4">
      <div className="flex items-center justify-between border-b border-borderDark pb-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{condition.icon}</span>
          <div>
            <div className="text-2xl font-bold tracking-tight text-textPrimary">
              {Math.round(current.temperature_2m)}°C
            </div>
            <div className="text-xs text-textSecondary flex items-center gap-2">
              <span className="text-accentBlue font-medium">{condition.text}</span>
              <span>•</span>
              <span>Terasa seperti {Math.round(current.apparent_temperature)}°C</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] uppercase tracking-wider text-textSecondary font-semibold block">
            Kondisi Saat Ini
          </span>
          <span className="text-xs font-mono text-accentGreen">Real-time Telemetry</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-900 border border-borderDark/60 p-2.5 rounded">
          <div className="flex items-center gap-1.5 text-textSecondary mb-1">
            <Droplets className="w-3.5 h-3.5 text-accentBlue" />
            <span>Kelembaban</span>
          </div>
          <div className="font-semibold text-textPrimary text-sm">
            {current.relative_humidity_2m}%
          </div>
        </div>

        <div className="bg-slate-900 border border-borderDark/60 p-2.5 rounded">
          <div className="flex items-center gap-1.5 text-textSecondary mb-1">
            <Wind className="w-3.5 h-3.5 text-accentBlue" />
            <span>Kecepatan Angin</span>
          </div>
          <div className="font-semibold text-textPrimary text-sm">
            {current.wind_speed_10m} km/j
          </div>
        </div>

        <div className="bg-slate-900 border border-borderDark/60 p-2.5 rounded">
          <div className="flex items-center gap-1.5 text-textSecondary mb-1">
            <Compass className="w-3.5 h-3.5 text-accentBlue" />
            <span>Arah Angin</span>
          </div>
          <div className="font-semibold text-textPrimary text-sm">
            {current.wind_direction_10m}°
          </div>
        </div>

        <div className="bg-slate-900 border border-borderDark/60 p-2.5 rounded">
          <div className="flex items-center gap-1.5 text-textSecondary mb-1">
            <CloudRain className="w-3.5 h-3.5 text-accentBlue" />
            <span>Curah Hujan</span>
          </div>
          <div className="font-semibold text-textPrimary text-sm">
            {current.precipitation} mm
          </div>
        </div>

        <div className="bg-slate-900 border border-borderDark/60 p-2.5 rounded">
          <div className="flex items-center gap-1.5 text-textSecondary mb-1">
            <Sun className="w-3.5 h-3.5 text-warning" />
            <span>Indeks UV</span>
          </div>
          <div className="font-semibold text-textPrimary text-sm">
            {uv.toFixed(1)}
          </div>
        </div>

        <div className="bg-slate-900 border border-borderDark/60 p-2.5 rounded">
          <div className="flex items-center gap-1.5 text-textSecondary mb-1">
            <Gauge className="w-3.5 h-3.5 text-accentBlue" />
            <span>Tekanan Udara</span>
          </div>
          <div className="font-semibold text-textPrimary text-sm">
            {Math.round(current.surface_pressure)} hPa
          </div>
        </div>
      </div>
    </div>
  );
}
