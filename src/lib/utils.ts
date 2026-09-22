import { WeatherApiResponse, WeatherScoreResult, WeatherAlertItem, ActivityItem } from "@/types/weather";

export const getWeatherDescription = (code: number): { text: string; icon: string } => {
  if (code === 0) return { text: "Cerah", icon: "☀️" };
  if ([1, 2, 3].includes(code)) return { text: "Cerah Berawan", icon: "⛅" };
  if ([45, 48].includes(code)) return { text: "Berkabut", icon: "🌫️" };
  if ([51, 53, 55].includes(code)) return { text: "Gerimis", icon: "🌦️" };
  if ([61, 63, 65].includes(code)) return { text: "Hujan", icon: "🌧️" };
  if ([71, 73, 75].includes(code)) return { text: "Salju", icon: "❄️" };
  if ([80, 81, 82].includes(code)) return { text: "Hujan Deras", icon: "🌦️" };
  if (code === 95) return { text: "Badai Petir", icon: "⛈️" };
  if ([96, 99].includes(code)) return { text: "Badai Petir & Es", icon: "⛈️" };
  return { text: "Berawan", icon: "☁️" };
};

export const calcWeatherScore = (weather: WeatherApiResponse): WeatherScoreResult => {
  const current = weather.current;
  const currentHourIndex = new Date().getHours();
  const rainProb = weather.hourly.precipitation_probability?.[currentHourIndex] ?? 0;
  const uv = weather.hourly.uv_index?.[currentHourIndex] ?? 0;
  const wind = current.wind_speed_10m;
  const temp = current.temperature_2m;

  let score = 100;
  if (rainProb > 70) score -= 30;
  else if (rainProb > 40) score -= 15;
  if (wind > 50) score -= 25;
  else if (wind > 30) score -= 10;
  if (uv > 10) score -= 15;
  else if (uv > 7) score -= 5;
  if (temp > 36 || temp < 15) score -= 10;
  score = Math.max(0, Math.min(100, Math.round(score)));

  let level: WeatherScoreResult["level"] = "buruk";
  let headline = "Tidak disarankan aktivitas outdoor";
  if (score >= 80) {
    level = "sempurna";
    headline = "Sempurna untuk aktivitas outdoor";
  } else if (score >= 60) {
    level = "cukup";
    headline = "Cukup baik, siapkan antisipasi";
  } else if (score >= 40) {
    level = "kurang";
    headline = "Kurang ideal, pertimbangkan aktivitas indoor";
  }

  const activities: ActivityItem[] = [
    {
      key: "sport",
      name: "Jogging / Olahraga",
      status: score >= 75 ? "aman" : score >= 45 ? "waspada" : "bahaya",
      suggestion:
        score >= 75
          ? "Kondisi sangat nyaman untuk lari pagi atau olahraga ruang terbuka."
          : score >= 45
          ? "Siapkan jaket tahan angin dan hindari rute rawan becek atau licin."
          : "Disarankan berpindah ke gym atau latihan indoor karena cuaca kurang kondusif.",
    },
    {
      key: "commute",
      name: "Berkendara",
      status: rainProb > 60 || wind > 40 ? "waspada" : "aman",
      suggestion:
        rainProb > 60
          ? "Pengendara motor wajib siapkan jas hujan model setelan, waspadai jalanan licin."
          : wind > 35
          ? "Waspadai angin samping di jembatan layang dan area terbuka."
          : "Arus lalu lintas dan jarak pandang terpantau optimal dan aman.",
    },
    {
      key: "garden",
      name: "Pertanian / Kebun",
      status: rainProb > 75 ? "waspada" : "aman",
      suggestion:
        rainProb > 70
          ? "Tunda pemupukan terbuka agar tidak hanyut tergerus air hujan deras."
          : uv > 8
          ? "Lakukan penyiraman tanaman saat pagi sebelum matahari terik membakar daun."
          : "Waktu ideal untuk perawatan tanaman dan pemangkasan dahan kebun.",
    },
    {
      key: "travel",
      name: "Wisata / Jalan-jalan",
      status: score >= 70 ? "aman" : score >= 45 ? "waspada" : "bahaya",
      suggestion:
        score >= 70
          ? "Sangat cocok untuk destinasi alam, taman kota, atau wisata keluarga."
          : score >= 45
          ? "Pilih destinasi yang memiliki shelter/area teduh atau bawa payung lipat."
          : "Prioritaskan wisata indoor seperti museum, galeri, atau pusat perbelanjaan.",
    },
    {
      key: "maritime",
      name: "Petani / Nelayan",
      status: wind > 35 || rainProb > 70 ? "bahaya" : wind > 20 ? "waspada" : "aman",
      suggestion:
        wind > 35 || rainProb > 70
          ? "Gelombang laut berisiko tinggi; tunda melaut perahu kecil dan amankan jemuran gabah/ikan asin."
          : wind > 20
          ? "Perhatikan dinamika angin pesisir dan pasang surut air laut sebelum melaut."
          : "Kondisi perairan stabil, pengeringan gabah dan hasil tangkapan berjalan optimal.",
    },
  ];

  return { score, level, headline, activities };
};

export const getSystemAlerts = (weather: WeatherApiResponse): WeatherAlertItem[] => {
  const alerts: WeatherAlertItem[] = [];
  const current = weather.current;
  const currentHourIndex = new Date().getHours();
  const rainProb = weather.hourly.precipitation_probability?.[currentHourIndex] ?? 0;
  const uv = weather.hourly.uv_index?.[currentHourIndex] ?? 0;

  if (current.weather_code >= 95) {
    alerts.push({
      id: "storm",
      type: "danger",
      title: "Peringatan Dini Cuaca Ekstrem: Badai Petir",
      detail: "Terdeteksi potensi petir dan angin kencang lokal. Segera berlindung di gedung kokoh dan jauhi pohon tinggi serta tiang listrik.",
    });
  }

  if (current.precipitation > 5 || rainProb > 80) {
    alerts.push({
      id: "heavy-rain",
      type: "warning",
      title: "Waspada Curah Hujan Tinggi",
      detail: "Potensi genangan air pada ruas jalan dataran rendah dan drainase kota yang padat.",
    });
  }

  if (current.wind_speed_10m > 40) {
    alerts.push({
      id: "high-wind",
      type: "warning",
      title: "Peringatan Angin Kencang",
      detail: `Kecepatan angin terukur mencapai ${Math.round(current.wind_speed_10m)} km/jam. Waspadai bahaya dahan patah atau baliho roboh.`,
    });
  }

  if (uv >= 8) {
    alerts.push({
      id: "high-uv",
      type: "warning",
      title: "Indeks Sinar UV Sangat Tinggi",
      detail: `Indeks radiasi UV berada di level ${uv.toFixed(1)}. Gunakan tabir surya (sunscreen), kacamata UV, dan topi pelindung jika berada di luar ruangan.`,
    });
  }

  if (current.temperature_2m >= 35) {
    alerts.push({
      id: "extreme-heat",
      type: "warning",
      title: "Suhu Udara Panas Terik",
      detail: `Suhu terukur mencapai ${current.temperature_2m.toFixed(1)}°C. Perbanyak konsumsi air putih untuk mencegah dehidrasi tropis.`,
    });
  }

  return alerts;
};

export const formatTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoString;
  }
};

export const formatDayName = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return isoString;
  }
};
