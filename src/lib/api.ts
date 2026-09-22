import { WeatherApiResponse, GeoLocation } from "@/types/weather";

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherApiResponse> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,precipitation,apparent_temperature,surface_pressure&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mengambil data cuaca");
  return res.json();
};

export const searchLocation = async (query: string): Promise<GeoLocation[]> => {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=5&language=id`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
};
