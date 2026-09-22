"use client";

import { WeatherApiResponse } from "@/types/weather";
import { Info, Umbrella, Sparkles, AlertCircle } from "lucide-react";

interface Props {
  weather: WeatherApiResponse;
}

export default function WeatherAdvisor({ weather }: Props) {
  const current = weather.current;
  const currentHour = new Date().getHours();
  const rainProb = weather.hourly.precipitation_probability?.[currentHour] ?? 0;
  const uv = weather.hourly.uv_index?.[currentHour] ?? 0;

  const tips: { title: string; desc: string; icon: React.ReactNode }[] = [];

  if (rainProb > 40 || current.precipitation > 0) {
    tips.push({
      title: "Persiapan Hujan Tropis",
      desc: "Bawa jas hujan model setelan (bukan ponco) jika mengendarai sepeda motor. Hindari berteduh di bawah jalan layang atau pohon rindang saat badai.",
      icon: <Umbrella className="w-4 h-4 text-sky-400" />,
    });
  }

  if (uv >= 6) {
    tips.push({
      title: "Proteksi Radiasi UV Siang Hari",
      desc: "Paparan sinar ultraviolet cukup intens. Gunakan tabir surya minimal SPF 30 dan gunakan topi atau payung jika beraktivitas di bawah terik matahari.",
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    });
  }

  if (current.temperature_2m >= 32) {
    tips.push({
      title: "Cegah Dehidrasi di Cuaca Panas",
      desc: "Suhu udara tinggi mempercepat penguapan cairan tubuh. Pastikan minum air putih minimal 2-2.5 liter per hari dan kurangi minuman berpemanis berlebih.",
      icon: <Info className="w-4 h-4 text-accentBlue" />,
    });
  }

  if (current.wind_speed_10m > 30) {
    tips.push({
      title: "Kewaspadaan Angin Kencang",
      desc: "Perhatikan parkir kendaraan bermotor jauh dari pohon tua dan tiang reklame besar. Waspadai embusan angin silang saat melintas di area terbuka.",
      icon: <AlertCircle className="w-4 h-4 text-warning" />,
    });
  }

  if (tips.length === 0) {
    tips.push({
      title: "Kondisi Atmosfer Stabil",
      desc: "Cuaca hari ini cukup bersahabat. Waktu yang baik untuk mobilitas harian, penjemuran pakaian, maupun kegiatan pemeliharaan pekarangan dan luar ruangan.",
      icon: <Info className="w-4 h-4 text-accentGreen" />,
    });
  }

  return (
    <div className="bg-bgCard border border-borderDark rounded p-4">
      <div className="flex items-center justify-between border-b border-borderDark pb-3 mb-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-textSecondary font-semibold block">
            Panduan & Tips Wilayah Indonesia
          </span>
          <h3 className="text-sm font-semibold text-textPrimary">
            Rekomendasi Situasional
          </h3>
        </div>
      </div>

      <div className="space-y-2.5">
        {tips.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-borderDark/60 rounded p-3 flex items-start gap-3"
          >
            <div className="p-1.5 rounded bg-slate-800 shrink-0 mt-0.5">{item.icon}</div>
            <div>
              <h4 className="text-xs font-semibold text-textPrimary">{item.title}</h4>
              <p className="text-[11px] text-textSecondary mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
