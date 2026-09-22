"use client";

import { WeatherAlertItem } from "@/types/weather";
import { AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";

interface Props {
  alerts: WeatherAlertItem[];
}

export default function WeatherAlerts({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="bg-bgCard border border-borderDark rounded px-4 py-2.5 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-accentGreen shrink-0" />
        <div>
          <span className="text-xs font-semibold text-accentGreen block">Status Cuaca Terkendali</span>
          <p className="text-xs text-textSecondary">Tidak ada peringatan dini anomali cuaca ekstrem saat ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const isDanger = alert.type === "danger";
        return (
          <div
            key={alert.id}
            className={`border rounded p-3 text-xs flex items-start gap-2.5 ${
              isDanger
                ? "bg-slate-900 border-danger/80 text-red-100"
                : "bg-slate-900 border-warning/80 text-amber-100"
            }`}
          >
            {isDanger ? (
              <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            )}
            <div>
              <div
                className={`font-semibold tracking-tight ${
                  isDanger ? "text-danger" : "text-warning"
                }`}
              >
                {alert.title}
              </div>
              <p className="text-textSecondary mt-0.5 leading-relaxed">{alert.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
