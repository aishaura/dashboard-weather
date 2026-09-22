"use client";

import { useState } from "react";
import { BMKGEarlyWarning } from "@/types/bmkg";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  warning: BMKGEarlyWarning | null;
}

export default function EarlyWarning({ warning }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (!warning || dismissed) return null;

  const isDanger = warning.level === "berbahaya";

  return (
    <div
      className={`border-b px-4 lg:px-6 py-2.5 transition-colors text-xs ${
        isDanger
          ? "bg-rose-100/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/30 text-rose-900 dark:text-rose-200"
          : "bg-amber-100/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertTriangle
            className={`w-4 h-4 shrink-0 ${isDanger ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"}`}
          />
          <div className="truncate sm:overflow-visible">
            <span
              className={`font-semibold mr-2 text-[10px] uppercase px-2 py-0.5 rounded-full border ${
                isDanger
                  ? "bg-rose-200 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40"
                  : "bg-amber-200 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40"
              }`}
            >
              Peringatan BMKG
            </span>
            <span className="leading-snug text-slate-800 dark:text-slate-200">{warning.message}</span>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.1] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition shrink-0"
          title="Tutup pemberitahuan"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
