"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import HeaderSearch from "@/components/HeaderSearch";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherAlerts from "@/components/WeatherAlerts";
import ActivityScoreCard from "@/components/ActivityScoreCard";
import HourlyChart from "@/components/HourlyChart";
import DailyForecast from "@/components/DailyForecast";
import WeatherAdvisor from "@/components/WeatherAdvisor";
import EarthquakeAlert from "@/components/bmkg/EarthquakeAlert";
import EarlyWarning from "@/components/bmkg/EarlyWarning";
import WeatherTips from "@/components/ai/WeatherTips";
import { GeoLocation, WeatherApiResponse } from "@/types/weather";
import { fetchWeather } from "@/lib/api";
import { calcWeatherScore, getSystemAlerts } from "@/lib/utils";
import { useBMKG } from "@/hooks/useBMKG";
import { useWeatherTips } from "@/hooks/useWeatherTips";
import { Loader2, RefreshCw } from "lucide-react";

const WindyMap = dynamic(() => import("@/components/WindyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-slate-950 text-slate-500 font-mono text-xs">
      Memuat modul peta cuaca...
    </div>
  ),
});

const defaultLocation: GeoLocation = {
  id: 1,
  name: "Bandung",
  latitude: -6.9175,
  longitude: 107.6191,
  admin1: "Jawa Barat",
  country: "Indonesia",
};

const getRelativeTime = (dateTimeStr?: string): string => {
  if (!dateTimeStr) return "";
  try {
    const diff = Date.now() - new Date(dateTimeStr).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return "baru saja";
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  } catch {
    return "";
  }
};

export default function Home() {
  const [location, setLocation] = useState<GeoLocation>(defaultLocation);
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const { earthquake, earlyWarning, loading: bmkgLoading, refresh: refreshBMKG } = useBMKG(location.admin1 || location.name);
  const { tips: aiTips, loading: aiLoading, error: aiError, refresh: refreshAITips } = useWeatherTips({
    location,
    weather: weatherData,
    bmkgQuake: earthquake,
    bmkgWarning: earlyWarning,
  });

  const loadData = useCallback(async (loc: GeoLocation) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(loc.latitude, loc.longitude);
      setWeatherData(data);
      setLastUpdated(new Date().toLocaleTimeString("id-ID"));
    } catch {
      setError("Gagal memuat data cuaca real-time. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(location);
  }, [location, loadData]);

  const handleRefreshAll = () => {
    loadData(location);
    refreshBMKG();
    refreshAITips();
  };

  const scoreData = weatherData ? calcWeatherScore(weatherData) : null;
  const alerts = weatherData ? getSystemAlerts(weatherData) : [];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bgPrimary">
      <HeaderSearch
        currentLocation={location}
        onSelectLocation={setLocation}
        isLoading={loading}
      />

      <EarlyWarning warning={earlyWarning} />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <section className="w-full h-[320px] md:h-full md:w-1/2 lg:w-[60%] shrink-0 flex flex-col">
          <div className="flex-1 relative min-h-0">
            <WindyMap lat={location.latitude} lon={location.longitude} />
          </div>

          {earthquake && (
            <div className="bg-slate-900 border-t border-b md:border-b-0 border-r-0 lg:border-r border-borderDark px-3 py-2 flex items-center gap-2 text-xs text-textSecondary overflow-hidden shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse shrink-0"></span>
              <span className="truncate font-medium text-textPrimary">
                <span className="text-danger font-semibold">Gempa terakhir:</span> M{earthquake.Magnitude} — {earthquake.Wilayah}
                {getRelativeTime(earthquake.DateTime) ? ` (${getRelativeTime(earthquake.DateTime)})` : ` (${earthquake.Jam})`}
              </span>
            </div>
          )}
        </section>

        <section className="w-full flex-1 md:w-1/2 lg:w-[40%] overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-textSecondary border-b border-borderDark pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accentGreen animate-pulse"></span>
              <span className="font-medium text-textPrimary">Monitoring Aktif</span>
              {lastUpdated && <span>(Pembaruan: {lastUpdated})</span>}
            </div>
            <button
              onClick={handleRefreshAll}
              disabled={loading}
              className="flex items-center gap-1 hover:text-accentBlue transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Segarkan</span>
            </button>
          </div>

          {error && (
            <div className="bg-slate-900 border border-danger/60 p-3 rounded text-xs text-danger">
              {error}
            </div>
          )}

          {loading && !weatherData && (
            <div className="py-20 flex flex-col items-center justify-center text-textSecondary gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-accentBlue" />
              <span className="text-xs">Sinkronisasi stasiun meteorologi...</span>
            </div>
          )}

          {weatherData && scoreData && (
            <>
              <WeatherAlerts alerts={alerts} />
              <CurrentWeather data={weatherData} />
              <EarthquakeAlert earthquake={earthquake} loading={bmkgLoading} />
              <WeatherTips
                tips={aiTips}
                loading={aiLoading}
                error={aiError}
                onRefresh={refreshAITips}
                weather={weatherData}
              />
              <ActivityScoreCard data={scoreData} />
              <HourlyChart data={weatherData.hourly} />
              <DailyForecast data={weatherData.daily} />
              <WeatherAdvisor weather={weatherData} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
