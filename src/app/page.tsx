"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import HeaderSearch from "@/components/HeaderSearch";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherAlerts from "@/components/WeatherAlerts";
import HourlyChart from "@/components/HourlyChart";
import DailyForecast from "@/components/DailyForecast";
import WeatherInsights from "@/components/WeatherInsights";
import EarthquakeAlert from "@/components/bmkg/EarthquakeAlert";
import EarlyWarning from "@/components/bmkg/EarlyWarning";
import { OverlayType } from "@/components/WindyMap";
import { GeoLocation, WeatherApiResponse } from "@/types/weather";
import { fetchWeather } from "@/lib/api";
import { calcWeatherScore, getSystemAlerts } from "@/lib/utils";
import { useBMKG } from "@/hooks/useBMKG";
import { useWeatherTips } from "@/hooks/useWeatherTips";
import { Loader2, RefreshCw, Radio, Map, BarChart3 } from "lucide-react";

const WindyMap = dynamic(() => import("@/components/WindyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] rounded-2xl flex flex-col items-center justify-center bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 gap-2 text-xs">
      <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
      <span>Memuat modul peta satelit cuaca...</span>
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

export default function Home() {
  const [location, setLocation] = useState<GeoLocation>(defaultLocation);
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Theme state: dark / light
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Map overlay state for quick action synchronization
  const [mapOverlay, setMapOverlay] = useState<OverlayType>("wind");

  // Mobile view tab: "map" or "data"
  const [mobileTab, setMobileTab] = useState<"map" | "data">("map");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("weather_theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("weather_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const {
    earthquake,
    earlyWarning,
    loading: bmkgLoading,
    refresh: refreshBMKG,
  } = useBMKG(location.admin1 || location.name);

  const {
    tips: aiTips,
    loading: aiLoading,
    error: aiError,
    refresh: refreshAITips,
  } = useWeatherTips({
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
      setLastUpdated(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      setError("Gagal memuat data cuaca real-time. Periksa koneksi internet Anda.");
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

  // Quick Action Handler to jump or set layer
  const handleQuickAction = (action: "rain" | "wind" | "hourly" | "daily" | "quake" | "activity") => {
    if (action === "rain") {
      setMapOverlay("rain");
      setMobileTab("map");
    } else if (action === "wind") {
      setMapOverlay("wind");
      setMobileTab("map");
    } else {
      setMobileTab("data");
      setTimeout(() => {
        const idMap: Record<string, string> = {
          hourly: "hourly-chart",
          daily: "daily-forecast",
          quake: "earthquake-alert",
          activity: "weather-insights",
        };
        const elem = document.getElementById(idMap[action]);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  const scoreData = weatherData ? calcWeatherScore(weatherData) : null;
  const alerts = weatherData ? getSystemAlerts(weatherData) : [];

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 flex flex-col ambient-glow transition-colors duration-200">
      {/* 1. Header Navigation (Fixed at top) */}
      <HeaderSearch
        currentLocation={location}
        onSelectLocation={setLocation}
        isLoading={loading}
        theme={theme}
        onToggleTheme={toggleTheme}
        onQuickAction={handleQuickAction}
      />

      {/* 2. Official Early Warning Banner (BMKG) */}
      <EarlyWarning warning={earlyWarning} />

      {/* 3. Main Screen-Fit Container (fills remaining viewport height, no outer page scroll) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-2 pb-3 overflow-hidden flex flex-col min-h-0">
        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/[0.06] pb-2 mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Stasiun Meteorologi Aktif
            </span>
            {lastUpdated && (
              <span className="text-slate-500 hidden sm:inline">• Diperbarui {lastUpdated} WIB</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAll}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] transition shadow-sm text-xs font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-sky-500" : ""}`} />
              <span className="hidden sm:inline">Perbarui</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Tabs (Only visible on mobile) */}
        <div className="flex lg:hidden items-center p-1 rounded-xl bg-slate-200/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs mb-2 shrink-0">
          <button
            onClick={() => setMobileTab("map")}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              mobileTab === "map"
                ? "bg-white dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-slate-200 dark:border-sky-400/30 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Peta Sentral</span>
          </button>
          <button
            onClick={() => setMobileTab("data")}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              mobileTab === "data"
                ? "bg-white dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-slate-200 dark:border-sky-400/30 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Detail & Analisis ({weatherData ? `${Math.round(weatherData.current.temperature_2m)}°C` : "..."})</span>
          </button>
        </div>

        {/* Severe Alerts Callout */}
        {alerts.length > 0 && (
          <div className="mb-2 shrink-0">
            <WeatherAlerts alerts={alerts} />
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-500/40 p-3 text-xs text-rose-700 dark:text-rose-300 shadow-sm mb-2 shrink-0">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !weatherData && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Sinkronisasi data cuaca {location.name}...
            </p>
          </div>
        )}

        {/* 4. Split Layout: FIXED PETA DI KIRI (TIDAK SCROLL), SCROLLABLE DATA DI KANAN */}
        {weatherData && scoreData && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 min-h-0 h-full overflow-hidden">
            {/* LEFT COLUMN: THE CENTRAL MAP (Fixed, 100% height, NEVER SCROLLS) */}
            <div
              className={`lg:col-span-7 xl:col-span-7 h-full flex flex-col min-h-0 overflow-hidden ${
                mobileTab === "map" ? "flex" : "hidden lg:flex"
              }`}
            >
              <WindyMap
                lat={location.latitude}
                lon={location.longitude}
                locationName={location.name}
                weather={weatherData}
                earthquake={earthquake}
                currentOverlay={mapOverlay}
                onOverlaySelect={setMapOverlay}
                className="w-full h-full flex-1 min-h-0"
              />
            </div>

            {/* RIGHT COLUMN: INDEPENDENT SCROLLABLE DATA STREAM (HANYA INI YANG DI-SCROLL) */}
            <div
              className={`lg:col-span-5 xl:col-span-5 h-full overflow-y-auto pr-1 sm:pr-2 space-y-4 min-h-0 scrollbar-thin ${
                mobileTab === "data" ? "block" : "hidden lg:block"
              }`}
            >
              {/* 1. Hero Current Weather & Bento Metrics */}
              <CurrentWeather data={weatherData} />

              {/* 2. 24-Hour Dynamics (Hourly Chart) */}
              <HourlyChart data={weatherData.hourly} />

              {/* 3. 7-Day Forecast */}
              <DailyForecast data={weatherData.daily} />

              {/* 4. Smart Daily Guidance & Activity Scorecard */}
              <WeatherInsights
                weather={weatherData}
                scoreData={scoreData}
                tips={aiTips}
                loadingTips={aiLoading}
                errorTips={aiError}
                onRefreshTips={refreshAITips}
              />

              {/* 5. BMKG Detailed Earthquake Card */}
              <EarthquakeAlert earthquake={earthquake} loading={bmkgLoading} />

              {/* Integrated Data Source Credit */}
              <div className="pt-2 pb-4 text-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-white/[0.04] flex items-center justify-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-500" />
                <span>Data terintegrasi: Open-Meteo, Windy ECMWF & BMKG Indonesia</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
