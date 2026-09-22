"use client";

import { BMKGQuake } from "@/types/bmkg";
import { AlertTriangle, Info, Waves, Clock, MapPin } from "lucide-react";

interface Props {
  earthquake: BMKGQuake | null;
  loading?: boolean;
}

export default function EarthquakeAlert({ earthquake, loading }: Props) {
  if (loading && !earthquake) {
    return (
      <div className="bg-bgCard border border-borderDark rounded p-3 text-xs text-textSecondary flex items-center justify-between">
        <span>Menghubungi Pusat Gempa BMKG...</span>
        <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"></span>
      </div>
    );
  }

  if (!earthquake) return null;

  const mag = parseFloat(earthquake.Magnitude) || 0;
  const isDanger = mag >= 5.0;

  return (
    <div
      className={`border rounded p-3.5 text-xs transition relative ${
        isDanger
          ? "bg-slate-900 border-danger/80 text-slate-100"
          : "bg-slate-900 border-borderDark text-textPrimary"
      }`}
    >
      <div className="flex items-center justify-between border-b border-borderDark/60 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          {isDanger ? (
            <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-accentBlue shrink-0" />
          )}
          <span className={`font-semibold tracking-tight ${isDanger ? "text-danger" : "text-textPrimary"}`}>
            Gempa Bumi Terkini BMKG
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded border border-borderDark/80">
          <span className="w-2 h-2 rounded-full bg-danger animate-ping"></span>
          <span className="text-[10px] font-mono font-bold tracking-wider text-danger uppercase">
            LIVE
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-black font-mono tracking-tight ${
                isDanger ? "text-danger" : "text-accentBlue"
              }`}
            >
              M {earthquake.Magnitude}
            </span>
            <span className="text-textSecondary text-[11px]">
              Kedalaman: {earthquake.Kedalaman}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border block ${
              earthquake.Potensi.toLowerCase().includes("tidak berpotensi tsunami")
                ? "text-accentGreen border-accentGreen/30 bg-accentGreen/10"
                : "text-danger border-danger/30 bg-danger/10"
            }`}
          >
            {earthquake.Potensi}
          </span>
        </div>
      </div>

      <div className="space-y-1 text-[11px] text-textSecondary pt-1 border-t border-borderDark/40">
        <div className="flex items-start gap-1.5 text-textPrimary">
          <MapPin className="w-3.5 h-3.5 text-accentBlue shrink-0 mt-0.5" />
          <span className="leading-snug">{earthquake.Wilayah}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{earthquake.Tanggal}, {earthquake.Jam}</span>
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            {earthquake.Coordinates}
          </span>
        </div>
      </div>
    </div>
  );
}
