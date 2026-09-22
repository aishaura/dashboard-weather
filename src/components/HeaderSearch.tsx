"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { GeoLocation } from "@/types/weather";
import { searchLocation } from "@/lib/api";

interface Props {
  currentLocation: GeoLocation;
  onSelectLocation: (loc: GeoLocation) => void;
  isLoading: boolean;
}

export default function HeaderSearch({ currentLocation, onSelectLocation, isLoading }: Props) {
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
    }, 350);
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
      alert("Browser tidak mendukung geolokasi.");
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
        alert("Gagal membaca koordinat GPS.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <header className="bg-bgSecondary border-b border-borderDark px-4 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-slate-900 border border-slate-700 p-2 rounded text-accentBlue">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-textPrimary tracking-tight">
              {currentLocation.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-borderDark text-accentBlue font-mono">
              {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
            </span>
          </div>
          <p className="text-xs text-textSecondary">
            {currentLocation.admin1 ? `${currentLocation.admin1}, ` : ""}
            {currentLocation.country || "Indonesia"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative" ref={wrapperRef}>
        <div className="relative flex-1 md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
          <input
            type="text"
            placeholder="Cari kota di Indonesia..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-borderDark rounded pl-9 pr-8 py-1.5 text-sm text-textPrimary placeholder:text-slate-500 focus:outline-none focus:border-accentBlue"
          />
          {searching && (
            <Loader2 className="w-4 h-4 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2 text-textSecondary" />
          )}

          {isOpen && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-borderDark rounded shadow-lg z-50 max-h-60 overflow-y-auto">
              {results.map((loc) => (
                <button
                  key={`${loc.id}-${loc.latitude}`}
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 border-b border-slate-800 last:border-b-0 flex items-center justify-between"
                >
                  <span className="text-textPrimary font-medium">{loc.name}</span>
                  <span className="text-textSecondary text-[11px]">
                    {loc.admin1 ? `${loc.admin1}, ` : ""}
                    {loc.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleCurrentGeo}
          disabled={locating || isLoading}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-borderDark text-xs font-medium text-textPrimary px-3 py-2 rounded shrink-0 transition"
          title="Gunakan Lokasi GPS Saya"
        >
          {locating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-accentBlue" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-accentBlue" />
          )}
          <span className="hidden sm:inline">Lokasi Saya</span>
        </button>
      </div>
    </header>
  );
}
