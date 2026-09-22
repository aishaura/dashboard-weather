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
      className={`border-b px-4 py-2.5 flex items-center justify-between gap-3 text-xs transition ${
        isDanger
          ? "bg-red-950/40 border-danger/60 text-red-100"
          : "bg-amber-950/30 border-warning/60 text-amber-100"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertTriangle
          className={`w-4 h-4 shrink-0 ${isDanger ? "text-danger" : "text-warning"}`}
        />
        <div className="truncate sm:overflow-visible">
          <span className={`font-semibold mr-1.5 uppercase text-[10px] px-1.5 py-0.5 rounded border ${
            isDanger ? "border-danger/40 bg-danger/10 text-danger" : "border-warning/40 bg-warning/10 text-warning"
          }`}>
            BMKG {warning.level}
          </span>
          <span className="leading-snug">{warning.message}</span>
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-textPrimary transition shrink-0"
        title="Tutup Peringatan"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
