import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudRainWind, CloudSun, Moon, Sun } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { WeatherCondition } from "./weather"

export const WEATHER_ICONS: Record<WeatherCondition, { day: LucideIcon; night: LucideIcon }> = {
    clear: { day: Sun, night: Moon },
    mostlyClear: { day: CloudSun, night: CloudMoon },
    partlyCloudy: { day: CloudSun, night: CloudMoon },
    overcast: { day: Cloud, night: Cloud },
    fog: { day: CloudFog, night: CloudFog },
    drizzle: { day: CloudDrizzle, night: CloudDrizzle },
    lightRain: { day: CloudRain, night: CloudRain },
    rain: { day: CloudRain, night: CloudRain },
    heavyRain: { day: CloudRainWind, night: CloudRainWind },
    showers: { day: CloudRain, night: CloudRain },
    thunderstorm: { day: CloudLightning, night: CloudLightning },
    other: { day: Cloud, night: Cloud },
}

