"use client";

import { useState } from "react";
import { WeatherApiResponse, WeatherScoreResult } from "@/types/weather";
import {
  Compass,
  Activity,
  Bike,
  TreePine,
  Anchor,
  Sparkles,
  RefreshCw,
  Umbrella,
  Sun,
  ShieldCheck,
} from "lucide-react";

interface Props {
  weather: WeatherApiResponse;
  scoreData: WeatherScoreResult;
  tips: string;
  loadingTips: boolean;
  errorTips: string | null;
  onRefreshTips: () => void;
}

const iconsMap: Record<string, React.ReactNode> = {
  sport: <Activity className="w-4 h-4" />,
  commute: <Bike className="w-4 h-4" />,
  garden: <TreePine className="w-4 h-4" />,
  travel: <Compass className="w-4 h-4" />,
  maritime: <Anchor className="w-4 h-4" />,
};

export default function WeatherInsights({
  weather,
  scoreData,
  tips,
  loadingTips,
  errorTips,
  onRefreshTips,
}: Props) {
  const [activeTab, setActiveTab] = useState<"advice" | "activities">("advice");

  const current = weather.current;
  const currentHour = new Date().getHours();
  const rainProb = weather.hourly.precipitation_probability?.[currentHour] ?? 0;
  const uv = weather.hourly.uv_index?.[currentHour] ?? 0;

  const defaultTips: { title: string; desc: string; icon: React.ReactNode }[] = [];

  if (rainProb > 40 || current.precipitation > 0) {
    defaultTips.push({
      title: "Persiapan Hujan",
      desc: "Bawa payung atau jas hujan setelan. Waspadai jalanan licin terutama bagi pengendara roda dua.",
      icon: <Umbrella className="w-4 h-4 text-sky-500 dark:text-sky-400" />,
    });
  }

  if (uv >= 6) {
    defaultTips.push({
      title: "Perlindungan UV",
      desc: "Indeks radiasi matahari cukup tinggi. Disarankan memakai tabir surya (sunscreen) dan pelindung kepala saat di luar.",
      icon: <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />,
    });
  }

  if (current.temperature_2m >= 32) {
    defaultTips.push({
      title: "Asupan Hidrasi",
      desc: "Suhu lingkungan cukup terik. Pastikan minum air putih teratur untuk menjaga stamina tubuh.",
      icon: <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400" />,
    });
  }

  if (defaultTips.length === 0) {
    defaultTips.push({
      title: "Cuaca Kondusif",
      desc: "Atmosfer terpantau bersahabat dan nyaman untuk berbagai aktivitas luar ruangan sepanjang hari.",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />,
    });
  }

  const getScoreBadge = () => {
    if (scoreData.score >= 80) {
      return {
        bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
        label: "Sangat Baik",
      };
    }
    if (scoreData.score >= 60) {
      return {
        bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300",
        label: "Cukup Baik",
      };
    }
    return {
      bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300",
      label: "Perlu Waspada",
    };
  };

  const scoreBadge = getScoreBadge();

  return (
    <div
      className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] p-5 sm:p-6 backdrop-blur-md shadow-sm transition-colors"
      id="weather-insights"
    >
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Panduan Hari Ini & Aktivitas
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${scoreBadge.bg}`}
            >
              Indeks Kelayakan: {scoreData.score}/100 • {scoreBadge.label}
            </span>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("advice")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === "advice"
                ? "bg-white dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-slate-200 dark:border-sky-400/30 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Saran Cuaca
          </button>
          <button
            onClick={() => setActiveTab("activities")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === "activities"
                ? "bg-white dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-slate-200 dark:border-sky-400/30 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Skor Aktivitas ({scoreData.activities.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Saran Cuaca */}
      {activeTab === "advice" && (
        <div className="space-y-3">
          {/* Smart Summary Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                Catatan Situasional
              </span>
              <button
                onClick={onRefreshTips}
                disabled={loadingTips}
                className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 transition"
                title="Perbarui rekomendasi"
              >
                <RefreshCw className={`w-3 h-3 ${loadingTips ? "animate-spin text-sky-500" : ""}`} />
                <span>Pembaruan</span>
              </button>
            </div>

            {loadingTips ? (
              <div className="space-y-1.5 py-1">
                <div className="h-3 bg-slate-200 dark:bg-white/[0.06] rounded animate-pulse w-4/5" />
                <div className="h-3 bg-slate-200 dark:bg-white/[0.06] rounded animate-pulse w-full" />
              </div>
            ) : tips ? (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {tips}
              </p>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {scoreData.headline}. Pastikan selalu memeriksa potensi perubahan cuaca mendadak sebelum beraktivitas di luar.
              </p>
            )}
          </div>

          {/* Practical Checklist Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {defaultTips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-white/[0.04] shadow-sm shrink-0 mt-0.5">{tip.icon}</div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{tip.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Skor Kelayakan Aktivitas */}
      {activeTab === "activities" && (
        <div className="space-y-2">
          {scoreData.activities.map((act) => {
            const isAman = act.status === "aman";
            const isWaspada = act.status === "waspada";
            return (
              <div
                key={act.key}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.05] transition"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-white/[0.04] text-sky-600 dark:text-sky-400 shadow-sm shrink-0 mt-0.5">
                  {iconsMap[act.key] || <Activity className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{act.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isAman
                          ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                          : isWaspada
                          ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300"
                          : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300"
                      }`}
                    >
                      {act.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {act.suggestion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
