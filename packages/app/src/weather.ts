/**
 * WeatherAPI service for Dharwad and North Karnataka locations.
 * Fetches real-time weather and 3-day rainfall forecast for agronomic models.
 */

export interface WeatherData {
  location: string;
  tempC: number;
  conditionText: string;
  conditionIcon: string;
  humidity: number;
  windKph: number;
  forecastRain72h: number; // Sum of rainfall (mm) over next 72 hours
  forecastDays: Array<{
    date: string;
    maxTempC: number;
    minTempC: number;
    rainMm: number;
    rainChance: number;
    conditionText: string;
    conditionIcon: string;
  }>;
}

const DEFAULT_WEATHER: WeatherData = {
  location: 'Dharwad',
  tempC: 28,
  conditionText: 'Partly Cloudy',
  conditionIcon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
  humidity: 55,
  windKph: 12,
  forecastRain72h: 0,
  forecastDays: [
    { date: 'Today', maxTempC: 30, minTempC: 21, rainMm: 0, rainChance: 10, conditionText: 'Partly Cloudy', conditionIcon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png' },
    { date: 'Tomorrow', maxTempC: 31, minTempC: 22, rainMm: 0, rainChance: 15, conditionText: 'Sunny', conditionIcon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png' },
    { date: 'Day 3', maxTempC: 29, minTempC: 21, rainMm: 0, rainChance: 20, conditionText: 'Cloudy', conditionIcon: 'https://cdn.weatherapi.com/weather/64x64/day/119.png' }
  ]
};

export async function fetchLiveWeather(location = 'Dharwad'): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY || '570b2af92138423bba2152042261510';
  if (!apiKey) return DEFAULT_WEATHER;

  // Clean location query (e.g., 'Dharwad (ಧಾರವಾಡ)' -> 'Dharwad')
  const cleanLoc = location.replace(/\(.*\)/g, '').trim() || 'Dharwad';

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(cleanLoc)}&days=3&aqi=no&alerts=no`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`WeatherAPI returned ${res.status}, using cached/fallback weather`);
      return DEFAULT_WEATHER;
    }

    const data = await res.json();
    const forecastDays = (data.forecast?.forecastday || []).map((fd: any, i: number) => ({
      date: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : fd.date,
      maxTempC: Math.round(fd.day.maxtemp_c),
      minTempC: Math.round(fd.day.mintemp_c),
      rainMm: Number(fd.day.totalprecip_mm || 0),
      rainChance: Number(fd.day.daily_chance_of_rain || 0),
      conditionText: fd.day.condition.text,
      conditionIcon: fd.day.condition.icon.startsWith('http') ? fd.day.condition.icon : `https:${fd.day.condition.icon}`
    }));

    const totalRain72h = forecastDays.reduce((sum: number, d: any) => sum + d.rainMm, 0);

    const result: WeatherData = {
      location: data.location?.name || cleanLoc,
      tempC: Math.round(data.current?.temp_c ?? 28),
      conditionText: data.current?.condition?.text || 'Clear',
      conditionIcon: data.current?.condition?.icon?.startsWith('http')
        ? data.current.condition.icon
        : `https:${data.current?.condition?.icon || '//cdn.weatherapi.com/weather/64x64/day/113.png'}`,
      humidity: data.current?.humidity ?? 60,
      windKph: Math.round(data.current?.wind_kph ?? 10),
      forecastRain72h: Math.round(totalRain72h * 10) / 10,
      forecastDays
    };

    // Cache locally for offline use
    try {
      localStorage.setItem(`weather_${cleanLoc.toLowerCase()}`, JSON.stringify(result));
    } catch {}

    return result;
  } catch (err) {
    console.warn('WeatherAPI fetch failed (offline or network error), using cache:', err);
    try {
      const cached = localStorage.getItem(`weather_${cleanLoc.toLowerCase()}`);
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEFAULT_WEATHER;
  }
}
