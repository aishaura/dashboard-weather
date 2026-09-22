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
  CartesianGrid,
} from "recharts";
import { Clock, Thermometer, CloudRain, Wind } from "lucide-react";

interface Props {
  data: HourlyWeather;
}

type ViewMode = "combo" | "temp" | "rain" | "wind";

export default function HourlyChart({ data }: Props) {
  const [mode, setMode] = useState<ViewMode>("combo");

  const currentHour = new Date().getHours();
  const chartData = data.time.slice(0, 24).map((t, i) => {
    const hourStr = t.includes("T") ? t.split("T")[1].slice(0, 5) : `${i.toString().padStart(2, "0")}:00`;
    return {
      time: hourStr,
      temp: Math.round(data.temperature_2m[i] * 10) / 10,
      rainProb: data.precipitation_probability[i],
      wind: Math.round(data.wind_speed_10m[i]),
      uv: data.uv_index[i],
      isNow: i === currentHour,
    };
  });

  const maxRain = Math.max(...chartData.map((d) => d.rainProb));
  const maxTemp = Math.max(...chartData.map((d) => d.temp));
  const peakRainHour = chartData.find((d) => d.rainProb === maxRain)?.time;

  return (
    <div
      className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] p-5 sm:p-6 backdrop-blur-md shadow-sm transition-colors"
      id="hourly-chart"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Prakiraan 24 Jam
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {maxRain > 50
              ? `Peluang hujan tertinggi ${maxRain}% sekitar pukul ${peakRainHour}`
              : `Suhu maksimum mencapai ${maxTemp}°C dalam 24 jam ke depan`}
          </p>
        </div>

        {/* Mode Segmented Controls */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-xs self-start sm:self-auto">
          <button
            onClick={() => setMode("combo")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              mode === "combo"
                ? "bg-white dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-slate-200 dark:border-sky-400/30 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setMode("temp")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              mode === "temp"
                ? "bg-white dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-slate-200 dark:border-sky-400/30 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Thermometer className="w-3 h-3" />
            <span>Suhu</span>
          </button>
          <button
            onClick={() => setMode("rain")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              mode === "rain"
                ? "bg-white dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-blue-400/30 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CloudRain className="w-3 h-3" />
            <span>Hujan</span>
          </button>
          <button
            onClick={() => setMode("wind")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              mode === "wind"
                ? "bg-white dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-slate-200 dark:border-teal-400/30 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>Angin</span>
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-60 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -22, bottom: 5 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity={0.35} />
                <stop offset="90%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                <stop offset="90%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.12)" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              interval={2}
              dy={8}
            />
            <YAxis
              yAxisId="temp"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
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
              axisLine={false}
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
              axisLine={false}
              domain={[0, "auto"]}
              unit="k"
              hide={mode !== "wind"}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.12] p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[150px]">
                    <div className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/[0.08] pb-1 flex items-center justify-between">
                      <span>Pukul {label}</span>
                      {d.isNow && (
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-500/10 px-1.5 py-0.2 rounded font-normal">
                          Sekarang
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-sky-500" /> Suhu:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{d.temp}°C</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 flex items-center gap-1">
                        <CloudRain className="w-3 h-3 text-blue-500" /> Peluang Hujan:
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{d.rainProb}%</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Wind className="w-3 h-3 text-teal-500" /> Angin:
                      </span>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">{d.wind} km/j</span>
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
                opacity={0.4}
                radius={[4, 4, 0, 0]}
              />
            )}

            {(mode === "combo" || mode === "temp") && (
              <Area
                yAxisId="temp"
                type="monotone"
                dataKey="temp"
                stroke="#0284c7"
                strokeWidth={2.5}
                fill="url(#tempGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
              />
            )}

            {mode === "wind" && (
              <Area
                yAxisId="wind"
                type="monotone"
                dataKey="wind"
                stroke="#0d9488"
                strokeWidth={2.5}
                fill="url(#windGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#0d9488", stroke: "#ffffff", strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
