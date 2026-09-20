// Current conditions for Pagbilao from Open-Meteo (free, no key, CC BY 4.0, non-commercial use).
// Coordinates are the municipality's point from the Better Pagbilao nearby-places data (13.9745, 121.6854).

const ENDPOINT =
    "https://api.open-meteo.com/v1/forecast?latitude=13.9745&longitude=121.6854" +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=Asia%2FManila"

export const WEATHER_REFRESH_MS = 15 * 60 * 1000

export type WeatherCondition =
    | "clear"
    | "mostlyClear"
    | "partlyCloudy"
    | "overcast"
    | "fog"
    | "drizzle"
    | "lightRain"
    | "rain"
    | "heavyRain"
    | "showers"
    | "thunderstorm"
    | "other"

export interface Weather {
    temperature: number
    feelsLike: number
    humidity: number
    windKmh: number
    condition: WeatherCondition
    isDay: boolean
    /** local time of the observation, e.g. "2026-09-20T18:00" */
    observedAt: string
}

// WMO weather interpretation codes, grouped for Philippine conditions. Snow and ice codes cannot occur here.
function toCondition(code: number): WeatherCondition {
    if (code === 0) return "clear"
    if (code === 1) return "mostlyClear"
    if (code === 2) return "partlyCloudy"
    if (code === 3) return "overcast"
    if (code === 45 || code === 48) return "fog"
    if (code >= 51 && code <= 57) return "drizzle"
    if (code === 61) return "lightRain"
    if (code === 63 || code === 66 || code === 67) return "rain"
    if (code === 65 || code === 82) return "heavyRain"
    if (code === 80 || code === 81) return "showers"
    if (code >= 95 && code <= 99) return "thunderstorm"
    return "other"
}

interface OpenMeteoResponse {
    current?: {
        time: string
        temperature_2m: number
        apparent_temperature: number
        relative_humidity_2m: number
        weather_code: number
        wind_speed_10m: number
        is_day: number
    }
}

export async function fetchWeather(signal?: AbortSignal): Promise<Weather> {
    const response = await fetch(ENDPOINT, { signal })
    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`)

    const { current } = (await response.json()) as OpenMeteoResponse
    if (!current || typeof current.temperature_2m !== "number") throw new Error("Weather response had no current conditions")

    return {
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windKmh: current.wind_speed_10m,
        condition: toCondition(current.weather_code),
        isDay: current.is_day === 1,
        observedAt: current.time,
    }
}
