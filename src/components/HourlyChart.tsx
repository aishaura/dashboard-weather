"use client";

import { useState } from "react";
import { HourlyWeather } from "@/types/weather";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  data: HourlyWeather;
}

type ViewMode = "combo" | "temp" | "rain" | "wind";

export default function HourlyChart({ data }: Props) {
  const [mode, setMode] = useState<ViewMode>("combo");

  const chartData = data.time.slice(0, 24).map((t, i) => {
    const hourStr = t.includes("T") ? t.split("T")[1].slice(0, 5) : `${i.toString().padStart(2, "0")}:00`;
    return {
      time: hourStr,
      temp: data.temperature_2m[i],
      rainProb: data.precipitation_probability[i],
      wind: data.wind_speed_10m[i],
      uv: data.uv_index[i],
    };
  });

  return (
    <div className="bg-bgCard border border-borderDark rounded p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-borderDark pb-3 mb-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-textSecondary font-semibold block">
            Prakiraan 24 Jam
          </span>
          <h3 className="text-sm font-semibold text-textPrimary">
            Dinamika Suhu, Hujan & Angin
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 border border-borderDark rounded text-xs">
          <button
            onClick={() => setMode("combo")}
            className={`px-2 py-1 rounded transition text-[11px] font-medium ${
              mode === "combo" ? "bg-slate-800 text-accentBlue" : "text-textSecondary hover:text-textPrimary"
            }`}
          >
            Gabungan
          </button>
          <button
            onClick={() => setMode("temp")}
            className={`px-2 py-1 rounded transition text-[11px] font-medium ${
              mode === "temp" ? "bg-slate-800 text-accentBlue" : "text-textSecondary hover:text-textPrimary"
            }`}
          >
            Suhu
          </button>
          <button
            onClick={() => setMode("rain")}
            className={`px-2 py-1 rounded transition text-[11px] font-medium ${
              mode === "rain" ? "bg-slate-800 text-accentBlue" : "text-textSecondary hover:text-textPrimary"
            }`}
          >
            Hujan
          </button>
          <button
            onClick={() => setMode("wind")}
            className={`px-2 py-1 rounded transition text-[11px] font-medium ${
              mode === "wind" ? "bg-slate-800 text-accentBlue" : "text-textSecondary hover:text-textPrimary"
            }`}
          >
            Angin
          </button>
        </div>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              interval={2}
            />
            <YAxis
              yAxisId="temp"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              domain={["auto", "auto"]}
              unit="°"
              hide={mode === "rain" || mode === "wind"}
            />
            <YAxis
              yAxisId="rain"
              orientation="right"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              domain={[0, 100]}
              unit="%"
              hide={mode === "temp" || mode === "wind"}
            />
            <YAxis
              yAxisId="wind"
              orientation="right"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              domain={[0, "auto"]}
              unit="k"
              hide={mode !== "wind"}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-borderDark p-2.5 rounded shadow-lg text-xs space-y-1">
                    <div className="font-semibold text-textPrimary border-b border-borderDark pb-1 mb-1">
                      Pukul {label}
                    </div>
                    <div className="text-accentBlue flex justify-between gap-4">
                      <span>Suhu:</span>
                      <span className="font-mono font-semibold">{d.temp}°C</span>
                    </div>
                    <div className="text-sky-300 flex justify-between gap-4">
                      <span>Peluang Hujan:</span>
                      <span className="font-mono font-semibold">{d.rainProb}%</span>
                    </div>
                    <div className="text-emerald-400 flex justify-between gap-4">
                      <span>Kecepatan Angin:</span>
                      <span className="font-mono font-semibold">{d.wind} km/j</span>
                    </div>
                    <div className="text-warning flex justify-between gap-4">
                      <span>Indeks UV:</span>
                      <span className="font-mono font-semibold">{d.uv}</span>
                    </div>
                  </div>
                );
              }}
            />

            {(mode === "combo" || mode === "rain") && (
              <Bar
                yAxisId="rain"
                dataKey="rainProb"
                fill="#38bdf8"
                opacity={0.35}
                radius={[2, 2, 0, 0]}
              />
            )}

            {(mode === "combo" || mode === "temp") && (
              <Area
                yAxisId="temp"
                type="monotone"
                dataKey="temp"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="#38bdf8"
                fillOpacity={0.1}
              />
            )}

            {mode === "wind" && (
              <Area
                yAxisId="wind"
                type="monotone"
                dataKey="wind"
                stroke="#4ade80"
                strokeWidth={2}
                fill="#4ade80"
                fillOpacity={0.1}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
