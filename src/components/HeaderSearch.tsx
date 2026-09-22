"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Navigation,
  Loader2,
  CloudSun,
  X,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Clock,
  Activity,
  Calendar,
  Sparkles,
} from "lucide-react";
import { GeoLocation } from "@/types/weather";
import { searchLocation } from "@/lib/api";

interface Props {
  currentLocation: GeoLocation;
  onSelectLocation: (loc: GeoLocation) => void;
  isLoading: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onQuickAction?: (action: "rain" | "wind" | "hourly" | "daily" | "quake" | "activity") => void;
}

const POPULAR_CITIES: GeoLocation[] = [
  { id: 101, name: "Jakarta", latitude: -6.2088, longitude: 106.8456, admin1: "DKI Jakarta", country: "Indonesia" },
  { id: 102, name: "Bandung", latitude: -6.9175, longitude: 107.6191, admin1: "Jawa Barat", country: "Indonesia" },
  { id: 103, name: "Surabaya", latitude: -7.2575, longitude: 112.7521, admin1: "Jawa Timur", country: "Indonesia" },
  { id: 104, name: "Yogyakarta", latitude: -7.7956, longitude: 110.3695, admin1: "DI Yogyakarta", country: "Indonesia" },
  { id: 105, name: "Denpasar", latitude: -8.6705, longitude: 115.2126, admin1: "Bali", country: "Indonesia" },
  { id: 106, name: "Medan", latitude: 3.5952, longitude: 98.6722, admin1: "Sumatera Utara", country: "Indonesia" },
  { id: 107, name: "Makassar", latitude: -5.1477, longitude: 119.4327, admin1: "Sulawesi Selatan", country: "Indonesia" },
];

export default function HeaderSearch({
  currentLocation,
  onSelectLocation,
  isLoading,
  theme,
  onToggleTheme,
  onQuickAction,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setSearching(true);
        const data = await searchLocation(query);
        setResults(data);
        setSearching(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrentGeo = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi geolokasi.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onSelectLocation({
          id: Date.now(),
          name: "Lokasi Perangkat",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          admin1: "Deteksi GPS",
          country: "Indonesia",
        });
      },
      () => {
        setLocating(false);
        alert("Tidak dapat membaca koordinat GPS.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#0b1120]/85 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08] px-4 lg:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Brand & Active Location */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 via-blue-600/20 to-indigo-600/30 border border-sky-400/30 flex items-center justify-center text-sky-500 dark:text-sky-400 shadow-sm shrink-0">
            <CloudSun className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
                <span>{currentLocation.name}</span>
              </h1>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/[0.06]">
                {currentLocation.admin1 || currentLocation.country || "Indonesia"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <span>Koordinat:</span>
              <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300">
                {currentLocation.latitude.toFixed(2)}°, {currentLocation.longitude.toFixed(2)}°
              </span>
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md lg:max-w-lg justify-end" ref={wrapperRef}>
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kota, kabupaten, provinsi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.1] rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 transition shadow-inner"
            />
            {query && !searching && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {searching && (
              <Loader2 className="w-4 h-4 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-500 dark:text-sky-400" />
            )}

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#0e172a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.12] rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.05]">
                {results.map((loc) => (
                  <button
                    key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                    onClick={() => {
                      onSelectLocation(loc);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-center justify-between transition group"
                  >
                    <div>
                      <span className="text-slate-800 dark:text-slate-200 font-medium group-hover:text-sky-600 dark:group-hover:text-sky-300 transition">
                        {loc.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5">
                        {loc.admin1 ? `${loc.admin1}, ` : ""}
                        {loc.country}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* GPS Button */}
          <button
            onClick={handleCurrentGeo}
            disabled={locating || isLoading}
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl shrink-0 transition shadow-sm"
            title="Deteksi Lokasi GPS Anda"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-500 dark:text-sky-400" />
            ) : (
              <Navigation className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            )}
            <span className="hidden sm:inline">GPS</span>
          </button>

          {/* Dark / Light Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 transition shadow-sm"
            title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-sky-600 transition-transform -rotate-12 hover:rotate-0" />
            )}
          </button>
        </div>
      </div>

      {/* Shortcuts & Popular Cities Strip */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-white/[0.04]">
        {/* Popular Cities */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Kota Cepat:
          </span>
          {POPULAR_CITIES.map((city) => {
            const isActive = currentLocation.name.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.id}
                onClick={() => onSelectLocation(city)}
                className={`text-xs px-2.5 py-0.5 rounded-lg shrink-0 transition font-medium ${
                  isActive
                    ? "bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-400/40"
                    : "bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-white/[0.05]"
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>

        {/* Quick Data Shortcuts */}
        {onQuickAction && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
              Pintasan Data:
            </span>
            <button
              onClick={() => onQuickAction("rain")}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 transition font-medium shrink-0"
            >
              <CloudRain className="w-3 h-3" />
              <span>Radar Hujan</span>
            </button>
            <button
              onClick={() => onQuickAction("wind")}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 dark:hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 transition font-medium shrink-0"
            >
              <Wind className="w-3 h-3" />
              <span>Peta Angin</span>
            </button>
            <button
              onClick={() => onQuickAction("hourly")}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 transition font-medium shrink-0"
            >
              <Clock className="w-3 h-3" />
              <span>Per Jam</span>
            </button>
            <button
              onClick={() => onQuickAction("daily")}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 transition font-medium shrink-0"
            >
              <Calendar className="w-3 h-3" />
              <span>7 Hari</span>
            </button>
            <button
              onClick={() => onQuickAction("quake")}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 transition font-medium shrink-0"
            >
              <Activity className="w-3 h-3" />
              <span>Gempa BMKG</span>
            </button>
            <button
              onClick={() => onQuickAction("activity")}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 transition font-medium shrink-0"
            >
              <Sparkles className="w-3 h-3" />
              <span>Aktivitas</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
