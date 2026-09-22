"use client";

import { DailyWeather } from "@/types/weather";
import { getWeatherDescription, formatDayName } from "@/lib/utils";
import { CloudRain, Wind } from "lucide-react";

interface Props {
  data: DailyWeather;
}

export default function DailyForecast({ data }: Props) {
  const days = data.time.slice(0, 7);

  return (
    <div className="bg-bgCard border border-borderDark rounded p-4">
      <div className="flex items-center justify-between border-b border-borderDark pb-3 mb-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-textSecondary font-semibold block">
            Prakiraan 7 Hari Ke Depan
          </span>
          <h3 className="text-sm font-semibold text-textPrimary">
            Tren Cuaca Mingguan
          </h3>
        </div>
      </div>

      <div className="flex overflow-x-auto sm:grid sm:grid-cols-7 gap-2 pb-2 sm:pb-0 scrollbar-thin">
        {days.map((dateStr, index) => {
          const isToday = index === 0;
          const condition = getWeatherDescription(data.weather_code[index]);
          const maxTemp = Math.round(data.temperature_2m_max[index]);
          const minTemp = Math.round(data.temperature_2m_min[index]);
          const rain = data.precipitation_sum[index];
          const wind = Math.round(data.wind_speed_10m_max[index]);

          return (
            <div
              key={dateStr}
              className={`min-w-[125px] sm:min-w-0 flex-1 rounded p-2.5 text-center flex flex-col justify-between border transition ${
                isToday
                  ? "bg-slate-900 border-accentBlue"
                  : "bg-slate-900/60 border-borderDark/60 hover:border-slate-600"
              }`}
            >
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {isToday ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accentBlue text-slate-900 uppercase">
                      Hari Ini
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-textSecondary">
                      {formatDayName(dateStr)}
                    </span>
                  )}
                </div>

                <div className="text-2xl my-1">{condition.icon}</div>
                <div className="text-[11px] font-medium text-textPrimary truncate" title={condition.text}>
                  {condition.text}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-borderDark/60 space-y-1.5">
                <div className="flex items-center justify-center gap-2 text-xs font-mono">
                  <span className="font-bold text-textPrimary">{maxTemp}°</span>
                  <span className="text-textSecondary">{minTemp}°</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-textSecondary px-1">
                  <span className="flex items-center gap-0.5 text-sky-400">
                    <CloudRain className="w-3 h-3" />
                    <span>{rain.toFixed(1)}m</span>
                  </span>
                  <span className="flex items-center gap-0.5 text-emerald-400">
                    <Wind className="w-3 h-3" />
                    <span>{wind}k</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
