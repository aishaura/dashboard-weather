import { BMKGQuake, BMKGEarlyWarning } from "@/types/bmkg";

export const BMKG = {
  latestQuake: "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json",
  recentQuakes: "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json",
  feltQuakes: "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json",
  forecast: "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=",
  earlyWarning: "https://api.bmkg.go.id/publik/peringatan-dini-cuaca",
};

export const fetchLatestQuake = async (): Promise<BMKGQuake | null> => {
  try {
    const res = await fetch(BMKG.latestQuake, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.Infogempa?.gempa || null;
  } catch {
    return null;
  }
};

export const fetchRecentQuakes = async (): Promise<BMKGQuake[]> => {
  try {
    const res = await fetch(BMKG.recentQuakes, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.Infogempa?.gempa || [];
  } catch {
    return [];
  }
};

export const fetchEarlyWarning = async (province?: string): Promise<BMKGEarlyWarning | null> => {
  try {
    const res = await fetch(BMKG.earlyWarning, { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.message) return data;
    }
  } catch {}

  const targetProvince = province || "wilayah Indonesia";
  return {
    level: "waspada",
    message: `Waspada potensi hujan lebat disertai kilat/petir dan angin kencang di sebagian ${targetProvince}.`,
  };
};
