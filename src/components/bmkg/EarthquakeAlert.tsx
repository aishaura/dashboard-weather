"use client";

import { BMKGQuake } from "@/types/bmkg";
import { Activity, Clock, MapPin } from "lucide-react";

interface Props {
  earthquake: BMKGQuake | null;
  loading?: boolean;
}

export default function EarthquakeAlert({ earthquake, loading }: Props) {
  if (loading && !earthquake) {
    return (
      <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] p-4 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between shadow-sm">
        <span className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-500 dark:text-sky-400 animate-pulse" />
          Memperbarui data seismik BMKG...
        </span>
      </div>
    );
  }

  if (!earthquake) return null;

  const mag = parseFloat(earthquake.Magnitude) || 0;
  const isSignificant = mag >= 5.0;

  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-md transition-colors shadow-sm ${
        isSignificant
          ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30"
          : "bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08]"
      }`}
      id="earthquake-alert"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isSignificant ? "text-rose-500 dark:text-rose-400" : "text-sky-500 dark:text-sky-400"}`} />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
            Gempa Bumi Terkini (BMKG)
          </h2>
        </div>

        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            isSignificant
              ? "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30"
              : "bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/[0.08]"
          }`}
        >
          {earthquake.Potensi.toLowerCase().includes("tidak berpotensi tsunami")
            ? "Aman Tsunami"
            : "Waspada Tsunami"}
        </span>
      </div>

      {/* Magnitude & Region */}
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold tracking-tight ${
                isSignificant ? "text-rose-600 dark:text-rose-400" : "text-sky-600 dark:text-sky-400"
              }`}
            >
              M {earthquake.Magnitude}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Kedalaman {earthquake.Kedalaman}
            </span>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
          <span>{earthquake.Potensi}</span>
        </div>
      </div>

      {/* Wilayah / Lokasi */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs">
        <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
          <MapPin className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{earthquake.Wilayah}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>
              {earthquake.Tanggal}, {earthquake.Jam}
            </span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {earthquake.Coordinates}
          </span>
        </div>
      </div>
    </div>
  );
}
