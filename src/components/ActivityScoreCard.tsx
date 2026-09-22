"use client";

import { WeatherScoreResult } from "@/types/weather";
import { Activity, Bike, TreePine, Compass, Anchor } from "lucide-react";

interface Props {
  data: WeatherScoreResult;
}

const iconsMap: Record<string, React.ReactNode> = {
  sport: <Activity className="w-4 h-4" />,
  commute: <Bike className="w-4 h-4" />,
  garden: <TreePine className="w-4 h-4" />,
  travel: <Compass className="w-4 h-4" />,
  maritime: <Anchor className="w-4 h-4" />,
};

export default function ActivityScoreCard({ data }: Props) {
  const getBadge = () => {
    if (data.score >= 80) return { dot: "bg-accentGreen", text: "text-accentGreen", border: "border-accentGreen/30" };
    if (data.score >= 60) return { dot: "bg-warning", text: "text-warning", border: "border-warning/30" };
    if (data.score >= 40) return { dot: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/30" };
    return { dot: "bg-danger", text: "text-danger", border: "border-danger/30" };
  };

  const badge = getBadge();

  return (
    <div className="bg-bgCard border border-borderDark rounded p-4">
      <div className="flex items-center justify-between border-b border-borderDark pb-3 mb-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-textSecondary font-semibold block">
            Indeks Kelayakan Aktivitas
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`}></span>
            <h3 className={`text-sm font-semibold ${badge.text}`}>
              {data.headline}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black font-mono text-textPrimary tracking-tight">
            {data.score}
            <span className="text-xs text-textSecondary font-normal">/100</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.activities.map((act) => {
          const isAman = act.status === "aman";
          const isWaspada = act.status === "waspada";
          return (
            <div
              key={act.key}
              className="bg-slate-900 border border-borderDark/60 rounded p-2.5 flex items-start gap-3"
            >
              <div className="p-1.5 rounded bg-slate-800 text-accentBlue shrink-0 mt-0.5">
                {iconsMap[act.key] || <Activity className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-textPrimary">{act.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      isAman
                        ? "text-accentGreen border-accentGreen/30 bg-accentGreen/10"
                        : isWaspada
                        ? "text-warning border-warning/30 bg-warning/10"
                        : "text-danger border-danger/30 bg-danger/10"
                    }`}
                  >
                    {act.status}
                  </span>
                </div>
                <p className="text-[11px] text-textSecondary mt-1 leading-snug">
                  {act.suggestion}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
