export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
  precipitation: number;
  apparent_temperature: number;
  surface_pressure: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
  weather_code: number[];
  uv_index: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface ActivityItem {
  key: string;
  name: string;
  status: "aman" | "waspada" | "bahaya";
  suggestion: string;
}

export interface WeatherScoreResult {
  score: number;
  level: "sempurna" | "cukup" | "kurang" | "buruk";
  headline: string;
  activities: ActivityItem[];
}

export interface WeatherAlertItem {
  id: string;
  type: "info" | "warning" | "danger";
  title: string;
  detail: string;
}
