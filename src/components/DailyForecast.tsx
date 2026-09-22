"use client";

import { DailyWeather } from "@/types/weather";
import { getWeatherDescription, formatDayName } from "@/lib/utils";
import { CalendarDays, Droplets } from "lucide-react";

interface Props {
  data: DailyWeather;
}

export default function DailyForecast({ data }: Props) {
  const days = data.time.slice(0, 7);

  const allMins = data.temperature_2m_min.slice(0, 7);
  const allMaxs = data.temperature_2m_max.slice(0, 7);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const totalRange = Math.max(1, globalMax - globalMin);

  return (
    <div
      className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] p-5 sm:p-6 backdrop-blur-md shadow-sm transition-colors"
      id="daily-forecast"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
            Prakiraan 7 Hari
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Minggu Ini</span>
      </div>

      <div className="space-y-2.5">
        {days.map((dateStr, index) => {
          const isToday = index === 0;
          const condition = getWeatherDescription(data.weather_code[index]);
          const minTemp = Math.round(data.temperature_2m_min[index]);
          const maxTemp = Math.round(data.temperature_2m_max[index]);
          const rainSum = data.precipitation_sum[index];

          const leftPercent = ((minTemp - globalMin) / totalRange) * 100;
          const widthPercent = Math.max(8, ((maxTemp - minTemp) / totalRange) * 100);

          return (
            <div
              key={dateStr}
              className={`flex items-center justify-between gap-3 p-2.5 sm:px-3.5 rounded-xl transition ${
                isToday
                  ? "bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] shadow-sm"
                  : "hover:bg-slate-50 dark:hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              {/* Day Name */}
              <div className="w-20 sm:w-28 shrink-0">
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isToday
                      ? "text-sky-600 dark:text-sky-300 font-semibold"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {isToday ? "Hari Ini" : formatDayName(dateStr)}
                </span>
              </div>

              {/* Weather Condition Icon & Rain */}
              <div className="flex items-center gap-2.5 w-24 sm:w-32 shrink-0">
                <span className="text-xl sm:text-2xl select-none">{condition.icon}</span>
                {rainSum > 0 ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                    <Droplets className="w-3 h-3" />
                    <span>{rainSum.toFixed(0)} mm</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline truncate">
                    {condition.text}
                  </span>
                )}
              </div>

              {/* Temperature Bar */}
              <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-[120px]">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-7 text-right">
                  {minTemp}°
                </span>

                <div className="flex-1 h-1.5 sm:h-2 bg-slate-200 dark:bg-white/[0.08] rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-orange-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-semibold text-slate-900 dark:text-white w-7 text-left">
                  {maxTemp}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
