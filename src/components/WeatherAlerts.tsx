"use client";

import { WeatherAlertItem } from "@/types/weather";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface Props {
  alerts: WeatherAlertItem[];
}

export default function WeatherAlerts({ alerts }: Props) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {alerts.map((alert) => {
        const isDanger = alert.type === "danger";
        const isWarning = alert.type === "warning";

        return (
          <div
            key={alert.id}
            className={`rounded-2xl border p-4 text-xs flex items-start gap-3 backdrop-blur-md transition-colors shadow-sm ${
              isDanger
                ? "bg-rose-50/90 dark:bg-rose-950/25 border-rose-300 dark:border-rose-500/30 text-rose-900 dark:text-rose-200"
                : isWarning
                ? "bg-amber-50/90 dark:bg-amber-950/25 border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200"
                : "bg-sky-50/90 dark:bg-sky-950/25 border-sky-300 dark:border-sky-500/30 text-sky-900 dark:text-sky-200"
            }`}
          >
            {isDanger ? (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            ) : isWarning ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div
                className={`font-semibold tracking-tight ${
                  isDanger
                    ? "text-rose-700 dark:text-rose-300"
                    : isWarning
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-sky-700 dark:text-sky-300"
                }`}
              >
                {alert.title}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{alert.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
